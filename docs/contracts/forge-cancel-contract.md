# Forge Cancellation Contract

This contract defines required post-conditions for cancelling Forge.

## Required post-conditions

After cancelling Forge, implementations MUST ensure:

1. Targeted Forge state is terminal and non-active:
   - `active=false`
   - `current_phase='cancelled'`
   - `completed_at` is set
2. If Forge is linked to Ultrawork or Ecomode in the same scope, that linked mode MUST also be terminal/non-active.
3. Cancellation MUST NOT mutate unrelated sessions.

## Alignment points

- `src/cli/index.ts`
- `src/modes/base.ts`
- `skills/cancel/SKILL.md`
