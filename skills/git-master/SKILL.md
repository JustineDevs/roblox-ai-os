---
name: git-master
description: Git expert for atomic commits, rebasing, and history management
surface-class: "operator"
domain: "creator-runtime"
audience: "operator"
artifact-type: "skill"
---

# Git Master Command

Routes to the git-master agent for git operations.

## Usage

```
/git-master <git task>
```

## Routing

```
delegate(role="git-master", tier="STANDARD", task="{{ARGUMENTS}}")
```

## Capabilities
- Atomic commits with conventional format
- Interactive rebasing
- Branch management
- History cleanup
- Style detection from repo history

Task: {{ARGUMENTS}}
