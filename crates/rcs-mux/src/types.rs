use std::fmt;

use serde::{Deserialize, Serialize};

pub const MUX_OPERATION_NAMES: &[&str] = &[
    "resolve-target",
    "send-input",
    "capture-tail",
    "inspect-liveness",
    "attach",
    "detach",
];
pub const MUX_TARGET_KINDS: &[&str] = &["delivery-handle", "detached"];

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum MuxTarget {
    DeliveryHandle(String),
    Detached,
}

impl MuxTarget {
    pub fn delivery_handle(handle: impl Into<String>) -> Self {
        Self::DeliveryHandle(handle.into())
    }
}

impl fmt::Display for MuxTarget {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::DeliveryHandle(handle) => write!(f, "delivery-handle({handle})"),
            Self::Detached => write!(f, "detached"),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum SubmitPolicy {
    None,
    Enter { presses: u8, delay_ms: u64 },
}

impl SubmitPolicy {
    pub fn enter(presses: u8, delay_ms: u64) -> Self {
        Self::Enter {
            presses: presses.max(1),
            delay_ms,
        }
    }

    pub fn presses(&self) -> u8 {
        match self {
            Self::None => 0,
            Self::Enter { presses, .. } => *presses,
        }
    }
}

impl fmt::Display for SubmitPolicy {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::None => write!(f, "none"),
            Self::Enter { presses, delay_ms } => {
                write!(f, "enter(presses={presses}, delay_ms={delay_ms})")
            }
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct InputEnvelope {
    pub literal_text: String,
    pub submit: SubmitPolicy,
    pub replace_newlines_with_spaces: bool,
}

impl InputEnvelope {
    pub fn new(literal_text: impl Into<String>, submit: SubmitPolicy) -> Self {
        Self {
            literal_text: literal_text.into(),
            submit,
            replace_newlines_with_spaces: true,
        }
    }

    pub fn normalized_text(&self) -> String {
        if self.replace_newlines_with_spaces {
            self.literal_text
                .chars()
                .map(|ch| if ch == '\r' || ch == '\n' { ' ' } else { ch })
                .collect()
        } else {
            self.literal_text.clone()
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct InjectionPreflight {
    pub skip_if_scrolling: bool,
    pub require_running_agent: bool,
    pub require_ready: bool,
    pub require_idle: bool,
    pub capture_lines: usize,
}

impl Default for InjectionPreflight {
    fn default() -> Self {
        Self {
            skip_if_scrolling: true,
            require_running_agent: true,
            require_ready: true,
            require_idle: true,
            capture_lines: 80,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum PaneReadinessReason {
    Ok,
    MissingTarget,
    ScrollActive,
    PaneRunningShell,
    PaneHasActiveTask,
    PaneNotReady,
    TargetResolutionFailed(String),
}

impl fmt::Display for PaneReadinessReason {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Ok => write!(f, "ok"),
            Self::MissingTarget => write!(f, "missing_target"),
            Self::ScrollActive => write!(f, "scroll_active"),
            Self::PaneRunningShell => write!(f, "pane_running_shell"),
            Self::PaneHasActiveTask => write!(f, "pane_has_active_task"),
            Self::PaneNotReady => write!(f, "pane_not_ready"),
            Self::TargetResolutionFailed(reason) => {
                write!(f, "target_resolution_failed({reason})")
            }
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PaneReadiness {
    pub reason: PaneReadinessReason,
    pub pane_target: Option<String>,
    pub pane_current_command: Option<String>,
    pub pane_capture: Option<String>,
}

impl PaneReadiness {
    pub fn ok(pane_target: impl Into<String>) -> Self {
        Self {
            reason: PaneReadinessReason::Ok,
            pane_target: Some(pane_target.into()),
            pane_current_command: None,
            pane_capture: None,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum DeliveryConfirmation {
    Confirmed,
    ConfirmedActiveTask,
    Unconfirmed,
}

impl fmt::Display for DeliveryConfirmation {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Confirmed => write!(f, "Confirmed"),
            Self::ConfirmedActiveTask => write!(f, "ConfirmedActiveTask"),
            Self::Unconfirmed => write!(f, "Unconfirmed"),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConfirmationPolicy {
    pub narrow_capture_lines: usize,
    pub wide_capture_lines: usize,
    pub verify_delay_ms: u64,
    pub verify_rounds: u8,
    pub allow_active_task_confirmation: bool,
    pub require_ready_for_worker_targets: bool,
    pub non_empty_tail_lines: usize,
    pub retry_submit_without_retyping: bool,
}

impl Default for ConfirmationPolicy {
    fn default() -> Self {
        Self {
            narrow_capture_lines: 8,
            wide_capture_lines: 80,
            verify_delay_ms: 250,
            verify_rounds: 3,
            allow_active_task_confirmation: true,
            require_ready_for_worker_targets: true,
            non_empty_tail_lines: 24,
            retry_submit_without_retyping: true,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct DeliveryAttempt {
    pub pane_target: String,
    pub input: InputEnvelope,
    pub typed_prompt: bool,
    pub confirmation: DeliveryConfirmation,
}

impl DeliveryAttempt {
    pub fn new(
        pane_target: impl Into<String>,
        input: InputEnvelope,
        typed_prompt: bool,
        confirmation: DeliveryConfirmation,
    ) -> Self {
        Self {
            pane_target: pane_target.into(),
            input,
            typed_prompt,
            confirmation,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum MuxOperation {
    ResolveTarget {
        target: MuxTarget,
    },
    SendInput {
        target: MuxTarget,
        envelope: InputEnvelope,
    },
    CaptureTail {
        target: MuxTarget,
        visible_lines: usize,
    },
    InspectLiveness {
        target: MuxTarget,
    },
    Attach {
        target: MuxTarget,
    },
    Detach {
        target: MuxTarget,
    },
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum MuxOutcome {
    TargetResolved { resolved_handle: String },
    InputAccepted { bytes_written: usize },
    TailCaptured { visible_lines: usize, body: String },
    LivenessChecked { alive: bool },
    Attached { handle: String },
    Detached { handle: String },
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum MuxError {
    Unsupported(String),
    InvalidTarget(String),
    AdapterFailed(String),
}

impl fmt::Display for MuxError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Unsupported(message) => write!(f, "unsupported: {message}"),
            Self::InvalidTarget(message) => write!(f, "invalid target: {message}"),
            Self::AdapterFailed(message) => write!(f, "adapter failed: {message}"),
        }
    }
}

impl std::error::Error for MuxError {}

pub trait MuxAdapter {
    fn adapter_name(&self) -> &'static str;

    fn execute(&self, operation: &MuxOperation) -> Result<MuxOutcome, MuxError>;
}

pub fn describe_operation(operation: &MuxOperation) -> &'static str {
    match operation {
        MuxOperation::ResolveTarget { .. } => "resolve-target",
        MuxOperation::SendInput { .. } => "send-input",
        MuxOperation::CaptureTail { .. } => "capture-tail",
        MuxOperation::InspectLiveness { .. } => "inspect-liveness",
        MuxOperation::Attach { .. } => "attach",
        MuxOperation::Detach { .. } => "detach",
    }
}
