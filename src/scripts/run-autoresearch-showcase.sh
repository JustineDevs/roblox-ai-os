#!/usr/bin/env bash
set -euo pipefail

show_usage() {
  cat <<'USAGE'
Usage:
  scripts/run-autoresearch-showcase.sh --list
  scripts/run-autoresearch-showcase.sh <showcase> [<showcase> ...]

Available showcases:
  rcs-self       -> missions/in-action-cat-shellout-demo
  ml-tabular     -> missions/ml-kaggle-model-optimization
  bayesopt       -> missions/noisy-bayesopt-highdim
  latent         -> missions/noisy-latent-subspace-discovery
  sorting        -> missions/adaptive-sort-optimization
  all            -> rcs-self ml-tabular bayesopt latent sorting

Examples:
  scripts/run-autoresearch-showcase.sh --list
  scripts/run-autoresearch-showcase.sh bayesopt
  scripts/run-autoresearch-showcase.sh rcs-self ml-tabular
USAGE
}

mission_for() {
  case "$1" in
    rcs-self)   printf '%s' 'missions/in-action-cat-shellout-demo' ;;
    ml-tabular) printf '%s' 'missions/ml-kaggle-model-optimization' ;;
    bayesopt)   printf '%s' 'missions/noisy-bayesopt-highdim' ;;
    latent)     printf '%s' 'missions/noisy-latent-subspace-discovery' ;;
    sorting)    printf '%s' 'missions/adaptive-sort-optimization' ;;
    *) return 1 ;;
  esac
}

list_showcases() {
  cat <<'LIST'
rcs-self   missions/in-action-cat-shellout-demo
ml-tabular missions/ml-kaggle-model-optimization
bayesopt   missions/noisy-bayesopt-highdim
latent     missions/noisy-latent-subspace-discovery
sorting    missions/adaptive-sort-optimization
LIST
}

if [[ $# -eq 0 ]]; then
  show_usage
  exit 1
fi

if [[ "$1" == "--help" || "$1" == "-h" ]]; then
  show_usage
  exit 0
fi

if [[ "$1" == "--list" ]]; then
  list_showcases
  exit 0
fi

args=("$@")
if [[ " ${args[*]} " == *" all "* ]]; then
  args=(rcs-self ml-tabular bayesopt latent sorting)
fi

for showcase in "${args[@]}"; do
  mission="$(mission_for "$showcase")" || {
    printf 'Unknown showcase: %s\n\n' "$showcase" >&2
    show_usage >&2
    exit 1
  }

  printf '\n==> Running showcase %s (%s)\n' "$showcase" "$mission"
  rcs autoresearch "$mission"
done
