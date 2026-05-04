use rcs_mux::{canonical_contract_summary, MuxAdapter, MuxOperation, MuxTarget, TmuxAdapter};
use rcs_runtime_core::{runtime_contract_summary, RuntimeCommand, RuntimeEngine};
use std::env;
use std::process;

fn main() {
    if let Err(error) = run() {
        eprintln!("rcs-runtime: {error}");
        process::exit(1);
    }
}

fn run() -> Result<(), String> {
    let args: Vec<String> = env::args().skip(1).collect();
    let first = args.first().map(|s| s.as_str());
    let second = args.get(1).map(|s| s.as_str());

    match first {
        None | Some("--help") | Some("-h") => {
            print_usage();
            Ok(())
        }
        Some("schema") => {
            if second == Some("--json") {
                let summary = serde_json::json!({
                    "schema_version": rcs_runtime_core::RUNTIME_SCHEMA_VERSION,
                    "commands": rcs_runtime_core::RUNTIME_COMMAND_NAMES,
                    "events": rcs_runtime_core::RUNTIME_EVENT_NAMES,
                    "transport": "tmux",
                });
                println!(
                    "{}",
                    serde_json::to_string_pretty(&summary).map_err(|e| e.to_string())?
                );
            } else {
                println!("{}", runtime_contract_summary());
            }
            Ok(())
        }
        Some("snapshot") => {
            let state_dir = args.iter().find_map(|a| a.strip_prefix("--state-dir="));
            let engine = if let Some(dir) = state_dir {
                RuntimeEngine::load(dir).map_err(|e| e.to_string())?
            } else {
                RuntimeEngine::new()
            };
            let snapshot = engine.snapshot();
            if second == Some("--json") || args.get(2).map(|s| s.as_str()) == Some("--json") {
                println!(
                    "{}",
                    serde_json::to_string_pretty(&snapshot).map_err(|e| e.to_string())?
                );
            } else {
                println!("{snapshot}");
            }
            Ok(())
        }
        Some("mux-contract") => {
            let adapter = TmuxAdapter::new();
            println!("adapter-status={}", adapter.status());
            println!("{}", canonical_contract_summary());
            let sample = MuxOperation::InspectLiveness {
                target: MuxTarget::Detached,
            };
            if let Err(error) = adapter.execute(&sample) {
                println!("sample-operation={error}");
            }
            Ok(())
        }
        Some("exec") => {
            let json_input = second.ok_or("exec requires a JSON command argument")?;
            let state_dir = args.iter().find_map(|a| a.strip_prefix("--state-dir="));
            let compact = args.iter().any(|a| a == "--compact");
            let mut engine = match state_dir {
                Some(dir) => RuntimeEngine::load(dir)
                    .unwrap_or_else(|_| RuntimeEngine::new().with_state_dir(dir)),
                None => RuntimeEngine::new(),
            };

            let command: RuntimeCommand =
                serde_json::from_str(json_input).map_err(|e| format!("invalid JSON: {e}"))?;
            let event = engine.process(command).map_err(|e| e.to_string())?;

            if compact {
                engine.compact();
            }

            if state_dir.is_some() {
                engine
                    .persist()
                    .map_err(|e| format!("persist failed: {e}"))?;
                engine
                    .write_compatibility_view()
                    .map_err(|e| format!("compatibility view failed: {e}"))?;
            }

            println!(
                "{}",
                serde_json::to_string_pretty(&event).map_err(|e| e.to_string())?
            );
            Ok(())
        }
        Some("init") => {
            let dir = second.ok_or("init requires a state directory path")?;
            let engine = RuntimeEngine::new().with_state_dir(dir);
            engine.persist().map_err(|e| e.to_string())?;
            println!("initialized state directory: {dir}");
            Ok(())
        }
        Some(other) => Err(format!("unknown subcommand `{other}`")),
    }
}

fn print_usage() {
    println!(concat!(
        "usage: rcs-runtime <command> [options]\n",
        "\n",
        "commands:\n",
        "  schema [--json]                     print the runtime contract summary\n",
        "  snapshot [--json] [--state-dir=DIR]  print a runtime snapshot\n",
        "  mux-contract                        print the mux boundary summary\n",
        "  exec <json> [--state-dir=DIR]       process a runtime command from JSON\n",
        "  init <state-dir>                    initialize a fresh state directory\n",
    ));
}
