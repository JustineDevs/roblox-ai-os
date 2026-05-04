# Autoresearch Research Showcase

This folder collects **small, reproducible research-style demos** used to showcase `rcs autoresearch` on harder optimization problems.

Design goals:
- deterministic or seed-controlled evaluations
- small code footprint
- no large datasets checked into git
- no heavyweight runtime artifacts committed
- evaluator-driven keep/discard loops that are easy to inspect under `.rcs/logs/autoresearch/`

## Layout

- `playground/*` — demo code and benchmark logic
- `missions/*` — autoresearch mission contracts used by the showcase
- `scripts/eval-*` — focused evaluator entrypoints
- `scripts/run-autoresearch-showcase.sh` — convenience launcher for the bundled showcase missions

Naming convention:
- playground demo dirs use `*_demo` when they are standalone benchmark implementations
- mission dirs use problem/task slugs under `missions/`
- evaluator scripts follow `scripts/eval-<mission-slug>.(js|py)`
- the showcase runner maps short names (for example `bayesopt`, `latent`, `sorting`) to mission dirs

## Index

| Showcase | Mission | Evaluator | Status | Representative result |
|---|---|---|---|---|
| RCS self-optimization | `missions/in-action-cat-shellout-demo/` | `scripts/eval-in-action-cat-shellout-demo.js` | ✅ completed | kept commit `99ebf16` / cherry-picked as `8478261` removing the autoresearch manifest `cat` shell-out |
| Kaggle-style tabular ML | `missions/ml-kaggle-model-optimization/` | `scripts/eval-ml-kaggle-model-optimization.py` | ✅ completed | ROC AUC improved from `0.9458071278825997` to `0.9976939203354298` |
| Noisy high-dimensional Bayes-opt | `missions/noisy-bayesopt-highdim/` | `scripts/eval-noisy-bayesopt-highdim.py` | ✅ completed | score improved from `2.833048700169374` to `4.75978993804531` |
| Latent subspace discovery | `missions/noisy-latent-subspace-discovery/` | `scripts/eval-noisy-latent-subspace-discovery.py` | ✅ completed | score improved from `3.7019658949006504` to `4.176124116152444` with a compact `cem_search` strategy |
| Adaptive sorting optimization | `missions/adaptive-sort-optimization/` | `scripts/eval-adaptive-sort-optimization.py` | ✅ completed | score improved from `2.1198297352756628` to `9.411498969440865` by switching counting sort to the observed value span |

Use `scripts/run-autoresearch-showcase.sh --list` to see the bundled launch targets, or run one or more showcases directly with the wrapper script.

## Results matrix

| Showcase | Baseline | Kept / best documented result | Delta |
|---|---:|---:|---:|
| RCS self-optimization | n/a | behavior-preserving cleanup | n/a |
| Kaggle-style tabular ML | 0.9458071278825997 AUC | 0.9976939203354298 AUC | +0.0518867924528301 |
| Noisy high-dimensional Bayes-opt | 2.833048700169374 | 4.75978993804531 | +1.926741237875936 |
| Latent subspace discovery | 3.7019658949006504 | 4.176124116152444 | +0.47415822125179353 |
| Adaptive sorting optimization | 2.1198297352756628 | 9.411498969440865 | +7.291669234165202 |

## Demos

### 1. RCS self-optimization
- Mission: `missions/in-action-cat-shellout-demo/`
- Evaluator: `scripts/eval-in-action-cat-shellout-demo.js`
- What it demonstrates: a tiny self-hosted code optimization loop where autoresearch removes an unnecessary shell-out from RCS itself.

### 2. Kaggle-style tabular ML optimization
- Demo code: `playground/ml_kaggle_demo/`
- Mission: `missions/ml-kaggle-model-optimization/`
- Evaluator: `scripts/eval-ml-kaggle-model-optimization.py`
- What it demonstrates: model-family / hyperparameter search on a deterministic tabular classification benchmark with a score-improvement keep policy.

### 3. Noisy high-dimensional Bayes-opt demo
- Demo code: `playground/bayesopt_highdim_demo/`
- Mission: `missions/noisy-bayesopt-highdim/`
- Evaluator: `scripts/eval-noisy-bayesopt-highdim.py`
- What it demonstrates: a harder black-box optimization task with noise, limited evaluation budget, and curse-of-dimensionality pressure. The successful autoresearch run switched from random search to a subspace-aware fixed-kernel GP with denoised incumbent selection.

### 4. Latent subspace discovery demo
- Demo code: `playground/bayesopt_latent_discovery_demo/`
- Mission: `missions/noisy-latent-subspace-discovery/`
- Evaluator: `scripts/eval-noisy-latent-subspace-discovery.py`
- What it demonstrates: a follow-on harder variant where useful structure is mixed through latent directions rather than directly exposed as obvious coordinates.

### 5. Adaptive sorting optimization demo
- Demo code: `playground/adaptive_sort_demo/`
- Mission: `missions/adaptive-sort-optimization/`
- Evaluator: `scripts/eval-adaptive-sort-optimization.py`
- What it demonstrates: algorithm-engineering optimization over a deterministic mixed-distribution sorting benchmark using weighted comparison/move cost rather than noisy wall-clock timing.

## Running the showcase

Example:

```bash
rcs autoresearch missions/noisy-bayesopt-highdim
```

Then inspect:

```bash
RUN_ID=$(find .rcs/logs/autoresearch -maxdepth 1 -mindepth 1 -type d -printf '%f\n' | sort | tail -n 1)
cat .rcs/logs/autoresearch/$RUN_ID/manifest.json
cat .rcs/logs/autoresearch/$RUN_ID/candidate.json
cat .rcs/logs/autoresearch/$RUN_ID/iteration-ledger.json
```

You can also run evaluators directly without the supervisor:

```bash
node scripts/eval-in-action-cat-shellout-demo.js
python3 scripts/eval-ml-kaggle-model-optimization.py
python3 scripts/eval-noisy-bayesopt-highdim.py
python3 scripts/eval-noisy-latent-subspace-discovery.py
python3 scripts/eval-adaptive-sort-optimization.py
```

## Repository hygiene

These showcases are meant to stay lightweight.

Please avoid committing:
- downloaded datasets
- large model artifacts
- benchmark output dumps
- generated caches like `__pycache__/`
- runtime autoresearch logs under `.rcs/logs/`

Keep research state in code, configs, missions, and evaluator scripts; keep bulky runtime outputs local.
