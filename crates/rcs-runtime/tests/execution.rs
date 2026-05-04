use std::process::Command;

#[test]
fn schema_subcommand_prints_contract_summary() {
    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .arg("schema")
        .output()
        .expect("ran rcs-runtime");

    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("utf8 stdout");
    assert!(stdout.contains("runtime-schema=1"));
    assert!(stdout.contains("acquire-authority"));
    assert!(stdout.contains("dispatch-queued"));
    assert!(stdout.contains("transport=tmux"));
    assert!(stdout.contains("queue-transition=notified"));
}

#[test]
fn schema_json_subcommand_prints_valid_json() {
    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .args(["schema", "--json"])
        .output()
        .expect("ran rcs-runtime");

    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("utf8 stdout");
    let parsed: serde_json::Value = serde_json::from_str(&stdout).expect("valid JSON");
    assert_eq!(parsed["schema_version"], 1);
    assert!(parsed["commands"].is_array());
    assert!(parsed["events"].is_array());
}

#[test]
fn snapshot_subcommand_prints_runtime_snapshot() {
    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .arg("snapshot")
        .output()
        .expect("ran rcs-runtime");

    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("utf8 stdout");
    assert!(stdout.contains("authority="));
    assert!(stdout.contains("readiness=blocked"));
}

#[test]
fn snapshot_json_subcommand_prints_valid_json() {
    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .args(["snapshot", "--json"])
        .output()
        .expect("ran rcs-runtime");

    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("utf8 stdout");
    let parsed: serde_json::Value = serde_json::from_str(&stdout).expect("valid JSON");
    assert_eq!(parsed["schema_version"], 1);
    assert!(parsed["authority"].is_object());
    assert!(parsed["backlog"].is_object());
    assert!(parsed["replay"].is_object());
    assert!(parsed["readiness"].is_object());
    assert_eq!(parsed["readiness"]["ready"], false);
}

#[test]
fn mux_contract_subcommand_reports_adapter_status() {
    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .arg("mux-contract")
        .output()
        .expect("ran rcs-runtime");

    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("utf8 stdout");
    assert!(stdout.contains("adapter-status=tmux adapter ready"));
    assert!(stdout.contains("resolve-target"));
    assert!(stdout.contains("submit-policy=enter(presses=2, delay_ms=100)"));
    assert!(stdout.contains("confirmation=Confirmed"));
}

#[test]
fn exec_subcommand_processes_json_command() {
    let cmd_json = r#"{"command":"CaptureSnapshot"}"#;
    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .args(["exec", cmd_json])
        .output()
        .expect("ran rcs-runtime");

    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("utf8 stdout");
    let parsed: serde_json::Value = serde_json::from_str(&stdout).expect("valid JSON");
    assert_eq!(parsed["event"], "SnapshotCaptured");
}

#[test]
fn exec_acquire_authority_returns_event() {
    let cmd_json = r#"{"command":"AcquireAuthority","owner":"w1","lease_id":"l1","leased_until":"2026-03-19T02:00:00Z"}"#;
    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .args(["exec", cmd_json])
        .output()
        .expect("ran rcs-runtime");

    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("utf8 stdout");
    let parsed: serde_json::Value = serde_json::from_str(&stdout).expect("valid JSON");
    assert_eq!(parsed["event"], "AuthorityAcquired");
    assert_eq!(parsed["owner"], "w1");
}

#[test]
fn exec_invalid_json_fails() {
    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .args(["exec", "not-json"])
        .output()
        .expect("ran rcs-runtime");

    assert!(!output.status.success());
    let stderr = String::from_utf8(output.stderr).expect("utf8 stderr");
    assert!(stderr.contains("invalid JSON"));
}

#[test]
fn init_creates_state_directory() {
    let dir = std::env::temp_dir().join("rcs-runtime-test-init");
    let _ = std::fs::remove_dir_all(&dir);

    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .args(["init", dir.to_str().unwrap()])
        .output()
        .expect("ran rcs-runtime");

    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("utf8 stdout");
    assert!(stdout.contains("initialized state directory"));

    // Verify files were created
    assert!(dir.join("snapshot.json").exists());
    assert!(dir.join("events.json").exists());

    // Verify snapshot.json is valid JSON
    let snapshot_contents = std::fs::read_to_string(dir.join("snapshot.json")).unwrap();
    let parsed: serde_json::Value =
        serde_json::from_str(&snapshot_contents).expect("valid snapshot JSON");
    assert_eq!(parsed["schema_version"], 1);
    assert_eq!(parsed["readiness"]["ready"], false);

    let _ = std::fs::remove_dir_all(&dir);
}

#[test]
fn exec_with_state_dir_persists() {
    let dir = std::env::temp_dir().join("rcs-runtime-test-exec-persist");
    let _ = std::fs::remove_dir_all(&dir);

    let cmd_json = r#"{"command":"AcquireAuthority","owner":"w1","lease_id":"l1","leased_until":"2026-03-19T02:00:00Z"}"#;
    let state_arg = format!("--state-dir={}", dir.display());

    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .args(["exec", cmd_json, &state_arg])
        .output()
        .expect("ran rcs-runtime");

    assert!(output.status.success());

    // Verify snapshot was persisted with authority
    let snapshot_contents = std::fs::read_to_string(dir.join("snapshot.json")).unwrap();
    let parsed: serde_json::Value =
        serde_json::from_str(&snapshot_contents).expect("valid snapshot JSON");
    assert_eq!(parsed["authority"]["owner"], "w1");
    assert_eq!(parsed["readiness"]["ready"], true);

    // Verify events were persisted
    let events_contents = std::fs::read_to_string(dir.join("events.json")).unwrap();
    let events: serde_json::Value =
        serde_json::from_str(&events_contents).expect("valid events JSON");
    assert!(events.is_array());
    assert_eq!(events.as_array().unwrap().len(), 1);

    let _ = std::fs::remove_dir_all(&dir);
}

#[test]
fn snapshot_from_state_dir_reads_persisted_state() {
    let dir = std::env::temp_dir().join("rcs-runtime-test-snapshot-statedir");
    let _ = std::fs::remove_dir_all(&dir);

    // First: init and exec to create state
    Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .args(["init", dir.to_str().unwrap()])
        .output()
        .expect("init");

    let cmd_json = r#"{"command":"AcquireAuthority","owner":"w1","lease_id":"l1","leased_until":"2026-03-19T02:00:00Z"}"#;
    let state_arg = format!("--state-dir={}", dir.display());
    Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .args(["exec", cmd_json, &state_arg])
        .output()
        .expect("exec");

    // Then: snapshot --json with state-dir
    let output = Command::new(env!("CARGO_BIN_EXE_rcs-runtime"))
        .args(["snapshot", "--json", &state_arg])
        .output()
        .expect("ran rcs-runtime");

    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).expect("utf8 stdout");
    let parsed: serde_json::Value = serde_json::from_str(&stdout).expect("valid JSON");
    assert_eq!(parsed["authority"]["owner"], "w1");
    assert_eq!(parsed["readiness"]["ready"], true);

    let _ = std::fs::remove_dir_all(&dir);
}
