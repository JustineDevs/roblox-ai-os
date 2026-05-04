use std::process::Command;
use std::thread;
use std::time::Duration;

use crate::types::{MuxAdapter, MuxError, MuxOperation, MuxOutcome, MuxTarget, SubmitPolicy};

/// Run a tmux command with the given arguments. Returns stdout on success.
fn run_tmux(args: &[&str]) -> Result<String, MuxError> {
    let output = Command::new("tmux")
        .args(args)
        .output()
        .map_err(|e| MuxError::AdapterFailed(format!("failed to run tmux: {e}")))?;

    if output.status.success() {
        String::from_utf8(output.stdout)
            .map_err(|e| MuxError::AdapterFailed(format!("invalid utf-8 from tmux: {e}")))
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(MuxError::AdapterFailed(format!(
            "tmux {} failed: {}",
            args.first().unwrap_or(&""),
            stderr.trim()
        )))
    }
}

/// Extract a tmux target string from a `MuxTarget`.
fn resolve_target_handle(target: &MuxTarget) -> Result<String, MuxError> {
    match target {
        MuxTarget::DeliveryHandle(handle) => {
            if handle.is_empty() {
                Err(MuxError::InvalidTarget("empty delivery handle".into()))
            } else {
                Ok(handle.clone())
            }
        }
        MuxTarget::Detached => Err(MuxError::InvalidTarget(
            "cannot operate on a detached target".into(),
        )),
    }
}

/// Extract the session name portion from a tmux target string (e.g. "mysess:0.1" -> "mysess").
fn session_from_handle(handle: &str) -> &str {
    handle.split(':').next().unwrap_or(handle)
}

/// Build the argument list for `tmux send-keys` with literal text.
pub(crate) fn build_send_keys_args<'a>(target: &'a str, text: &'a str) -> Vec<&'a str> {
    vec!["send-keys", "-t", target, "-l", text]
}

/// Build the argument list for `tmux send-keys` enter press.
pub(crate) fn build_enter_key_args(target: &str) -> Vec<String> {
    vec!["send-keys".into(), "-t".into(), target.into(), "C-m".into()]
}

/// Build the argument list for `tmux capture-pane`.
pub fn build_capture_pane_args(target: &str, visible_lines: usize) -> Vec<String> {
    vec![
        "capture-pane".into(),
        "-t".into(),
        target.into(),
        "-p".into(),
        "-S".into(),
        format!("-{visible_lines}"),
    ]
}

#[derive(Debug, Clone, Copy, Default)]
pub struct TmuxAdapter;

impl TmuxAdapter {
    pub fn new() -> Self {
        Self
    }

    pub fn status(&self) -> &'static str {
        "tmux adapter ready"
    }

    fn do_resolve_target(&self, target: &MuxTarget) -> Result<MuxOutcome, MuxError> {
        let handle = resolve_target_handle(target)?;

        // Verify the target exists by listing all panes
        let pane_list = run_tmux(&[
            "list-panes",
            "-a",
            "-F",
            "#{session_name}:#{window_index}.#{pane_index}",
        ])?;

        let found = pane_list.lines().any(|line| line.trim() == handle);
        if found {
            Ok(MuxOutcome::TargetResolved {
                resolved_handle: handle,
            })
        } else {
            Err(MuxError::InvalidTarget(format!("pane not found: {handle}")))
        }
    }

    fn do_send_input(
        &self,
        target: &MuxTarget,
        envelope: &crate::types::InputEnvelope,
    ) -> Result<MuxOutcome, MuxError> {
        let handle = resolve_target_handle(target)?;
        let text = envelope.normalized_text();

        // Send the literal text
        let args = build_send_keys_args(&handle, &text);
        run_tmux(&args)?;

        // Send enter presses per submit policy
        if let SubmitPolicy::Enter { presses, delay_ms } = &envelope.submit {
            for i in 0..*presses {
                if i > 0 && *delay_ms > 0 {
                    thread::sleep(Duration::from_millis(*delay_ms));
                }
                let enter_args = build_enter_key_args(&handle);
                let str_args: Vec<&str> = enter_args.iter().map(|s| s.as_str()).collect();
                run_tmux(&str_args)?;
            }
        }

        Ok(MuxOutcome::InputAccepted {
            bytes_written: text.len(),
        })
    }

    fn do_capture_tail(
        &self,
        target: &MuxTarget,
        visible_lines: usize,
    ) -> Result<MuxOutcome, MuxError> {
        let handle = resolve_target_handle(target)?;
        let args = build_capture_pane_args(&handle, visible_lines);
        let str_args: Vec<&str> = args.iter().map(|s| s.as_str()).collect();
        let body = run_tmux(&str_args)?;

        Ok(MuxOutcome::TailCaptured {
            visible_lines,
            body,
        })
    }

    fn do_inspect_liveness(&self, target: &MuxTarget) -> Result<MuxOutcome, MuxError> {
        let handle = resolve_target_handle(target)?;
        let session = session_from_handle(&handle);

        let output = Command::new("tmux")
            .args(["has-session", "-t", session])
            .output()
            .map_err(|e| MuxError::AdapterFailed(format!("failed to run tmux: {e}")))?;

        Ok(MuxOutcome::LivenessChecked {
            alive: output.status.success(),
        })
    }

    fn do_attach(&self, target: &MuxTarget) -> Result<MuxOutcome, MuxError> {
        let handle = resolve_target_handle(target)?;
        run_tmux(&["attach-session", "-t", &handle])?;
        Ok(MuxOutcome::Attached { handle })
    }

    fn do_detach(&self, target: &MuxTarget) -> Result<MuxOutcome, MuxError> {
        let handle = resolve_target_handle(target)?;
        run_tmux(&["detach-client", "-t", &handle])?;
        Ok(MuxOutcome::Detached { handle })
    }
}

impl MuxAdapter for TmuxAdapter {
    fn adapter_name(&self) -> &'static str {
        "tmux"
    }

    fn execute(&self, operation: &MuxOperation) -> Result<MuxOutcome, MuxError> {
        match operation {
            MuxOperation::ResolveTarget { target } => self.do_resolve_target(target),
            MuxOperation::SendInput { target, envelope } => self.do_send_input(target, envelope),
            MuxOperation::CaptureTail {
                target,
                visible_lines,
            } => self.do_capture_tail(target, *visible_lines),
            MuxOperation::InspectLiveness { target } => self.do_inspect_liveness(target),
            MuxOperation::Attach { target } => self.do_attach(target),
            MuxOperation::Detach { target } => self.do_detach(target),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::{InputEnvelope, SubmitPolicy};

    #[test]
    fn resolve_target_handle_rejects_empty() {
        let err = resolve_target_handle(&MuxTarget::DeliveryHandle(String::new()))
            .expect_err("should reject empty");
        assert!(matches!(err, MuxError::InvalidTarget(_)));
    }

    #[test]
    fn resolve_target_handle_rejects_detached() {
        let err = resolve_target_handle(&MuxTarget::Detached).expect_err("should reject detached");
        assert!(matches!(err, MuxError::InvalidTarget(_)));
    }

    #[test]
    fn resolve_target_handle_accepts_valid() {
        let handle = resolve_target_handle(&MuxTarget::DeliveryHandle("sess:0.1".into()))
            .expect("should accept valid handle");
        assert_eq!(handle, "sess:0.1");
    }

    #[test]
    fn session_from_handle_extracts_session() {
        assert_eq!(session_from_handle("mysess:0.1"), "mysess");
        assert_eq!(session_from_handle("plain"), "plain");
        assert_eq!(session_from_handle("a:b:c"), "a");
    }

    #[test]
    fn build_send_keys_args_constructs_correct_args() {
        let args = build_send_keys_args("sess:0.1", "hello world");
        assert_eq!(
            args,
            vec!["send-keys", "-t", "sess:0.1", "-l", "hello world"]
        );
    }

    #[test]
    fn build_enter_key_args_constructs_correct_args() {
        let args = build_enter_key_args("sess:0.1");
        assert_eq!(args, vec!["send-keys", "-t", "sess:0.1", "C-m"]);
    }

    #[test]
    fn build_capture_pane_args_constructs_correct_args() {
        let args = build_capture_pane_args("sess:0.1", 80);
        assert_eq!(
            args,
            vec!["capture-pane", "-t", "sess:0.1", "-p", "-S", "-80"]
        );
    }

    #[test]
    fn send_keys_uses_normalized_text() {
        let envelope = InputEnvelope::new("line1\nline2", SubmitPolicy::None);
        let text = envelope.normalized_text();
        assert_eq!(text, "line1 line2");
        let args = build_send_keys_args("t:0.0", &text);
        assert_eq!(args[4], "line1 line2");
    }

    #[test]
    fn adapter_name_is_tmux() {
        let adapter = TmuxAdapter::new();
        assert_eq!(adapter.adapter_name(), "tmux");
    }

    #[test]
    fn status_reports_ready() {
        let adapter = TmuxAdapter::new();
        assert_eq!(adapter.status(), "tmux adapter ready");
    }

    #[test]
    fn execute_rejects_detached_target() {
        let adapter = TmuxAdapter::new();
        let result = adapter.execute(&MuxOperation::ResolveTarget {
            target: MuxTarget::Detached,
        });
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(matches!(err, MuxError::InvalidTarget(_)));
    }
}
