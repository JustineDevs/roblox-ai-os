from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

CONFIG_PATH = Path('playground/bayesopt_latent_discovery_demo/config.json')
SEEDS = (23, 41, 59)


def run_for_seed(seed: int) -> dict:
    config = json.loads(CONFIG_PATH.read_text())
    config['seed'] = seed
    tmp_path = Path('.rcs') / 'tmp' / f'latent-discovery-seed-{seed}.json'
    tmp_path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path.write_text(json.dumps(config))

    result = subprocess.run(
        [sys.executable, 'playground/bayesopt_latent_discovery_demo/run_search.py', '--config', str(tmp_path)],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.stdout:
        sys.stderr.write(result.stdout)
    if result.stderr:
        sys.stderr.write(result.stderr)
    if result.returncode != 0:
        raise SystemExit(result.returncode)
    return json.loads(result.stdout)


def main() -> None:
    rows = [run_for_seed(seed) for seed in SEEDS]
    means = [float(row['best_mean']) for row in rows]
    overall_mean = sum(means) / len(means)
    variance_penalty = (max(means) - min(means)) * 0.18
    score = overall_mean - variance_penalty
    print(json.dumps({'pass': score >= 1.4, 'score': score}))


if __name__ == '__main__':
    main()
