---
name: security-review
description: Review Roblox experience security — Luau server authority, remotes, DataStore, economy, anti-exploit
surface-class: "operator"
domain: "creator-runtime"
audience: "operator"
artifact-type: "skill"
---

# Security Review Skill

Review **Roblox Studio / Luau** experiences for **trust-boundary mistakes** and **exploit-friendly design**. Default to the **game-code** threat model first (Scripts, ModuleScripts, RemoteEvents, services), not enterprise web checklists. If the scoped target is RCS runtime code, Node tooling, or another off-Roblox surface, switch to the matching runtime/backend threat model instead of forcing Luau-only guidance.

## When to Use

- User asks for a **security review**, **exploit check**, or **anti-cheat pass** on a place or Luau codebase
- After adding or changing **RemoteEvents**, **RemoteFunctions**, **BindableEvents** that cross the client–server boundary
- After **economy** work (developer products, passes, `ProcessReceipt`, grants, currency)
- After **DataStore / OrderedDataStore / MemoryStore** access patterns change
- Before a **live** or high-traffic update when combat, trading, or progression is involved

## What It Does

## GPT-5.5 Guidance Alignment

- Default outcome-first: what you checked, what failed, severity, and what “fixed” means before process narration.
- Use outcome-first framing for progress and completion reporting.
- Treat newer user instructions as overrides for the active review thread when they do not conflict with earlier constraints.
- Keep local overrides for the active workflow branch explicit when new evidence or user direction narrows the review scope.
- Keep reading and tracing until findings are grounded in **actual scripts and remotes**, not generic categories.

Delegates to the `security-reviewer` agent (THOROUGH tier) for a **Roblox-native** pass:

1. **Server authority**
   - Economy, inventory, progression, bans, and moderation decisions run on the **server** only
   - No security-sensitive branching on **client-only** state the server cannot corroborate

2. **Remote surface**
   - Every **RemoteEvent** / **RemoteFunction** handler validates **types, ranges, and caller context** before mutating state
   - Sensitive remotes are not spam-friendly (debounce, cooldowns, or server-side rate patterns where appropriate)

3. **Persistence**
   - **DataStore** keys are scoped (e.g. per-player or per-shard); no cross-player reads/writes by mistake
   - Retries, versioning, and failure paths do not corrupt progression or double-apply rewards

4. **Economy integrity**
   - Purchase flows use **server-verified** patterns (`ProcessReceipt` / official APIs as applicable); grants are **idempotent** where duplicate delivery is possible
   - No client-trusted “I bought it” flags for entitlement

5. **Anti-exploit (gameplay systems)**
   - Combat, movement, trading, and duping-prone flows assume **malicious clients**; validate timing, ownership, and state transitions server-side

6. **Secrets and off-platform calls**
   - **HttpService** / proxy keys and third-party tokens stay **server-only** and out of **ReplicatedStorage** / client scripts
   - No API keys or shared secrets in place files committed to public repos

7. **Privacy and platform rules (when relevant)**
   - PolicyService / age-appropriate behavior, chat filtering, and data minimization for what you persist

## Agent Delegation

```
delegate(
  role="security-reviewer",
  tier="THOROUGH",
  prompt="SECURITY REVIEW TASK (Roblox experience)

Scope: [e.g. ServerScriptService combat + ReplicatedStorage remotes + economy module]

Roblox checklist:
1. Server authority for economy / progression / moderation
2. RemoteEvent/RemoteFunction validation and abuse resistance
3. DataStore keying, isolation, retries
4. Purchase / entitlement verification and idempotent grants
5. Anti-exploit posture for high-risk loops (combat, trade, currency)
6. HttpService secrets only on server; nothing sensitive replicated to clients

Output:
- Findings by severity (CRITICAL, HIGH, MEDIUM, LOW) with Script path:line
- Exploit sketch (short) and Luau-focused remediation
- Overall posture for this place update"
)
```

## External Model Consultation (Preferred)

The security-reviewer agent SHOULD consult Codex for cross-validation on subtle remote or economy bugs.

### Protocol

1. Form your **own** Roblox-centric analysis first  
2. Cross-check with Codex on high-severity items  
3. Do not copy-paste external claims without matching them to your traced code paths  

### When to Consult

- New or high-risk **remote** or **economy** surfaces  
- **DataStore** layout or migration that touches player-owned state  
- Unusual **HttpService** integrations  

### When to Skip

- Purely cosmetic client UI with no authority implications  
- Already-reviewed modules with no behavioral diff  

### Tool Usage

Before first MCP tool use, call `ToolSearch("mcp")` to discover deferred MCP tools.  
Use `mcp__x__ask_codex` with `agent_role: "security-reviewer"`.  
If ToolSearch finds no MCP tools, fall back to the `security-reviewer` agent.

## Output Format (example shape)

```
SECURITY REVIEW REPORT — Roblox place
=====================================
Scope: ServerScriptService/Combat, ReplicatedStorage/Remotes, ServerScriptService/Economy
Scan Date: ...

CRITICAL (1)
------------
1. ServerScriptService/Combat/Damage.server.lua:112 — Client-chosen hit damage applied without server validation
   Impact: Arbitrary damage / instakill exploits
   Remediation: Recompute or clamp damage server-side from hit context you trust (position, weapon id, cooldowns)

HIGH (2)
--------
...

OVERALL: [POSTURE] — ship / fix-first / block live
```

## Security Checklist (Roblox)

- [ ] **Server authority:** sensitive rules never rely on `LocalScript` conclusions alone  
- [ ] **Remotes:** validate every argument; reject garbage early  
- [ ] **DataStore:** correct keyspace; no accidental cross-player leakage  
- [ ] **Economy:** server-side verification; idempotent grants where needed  
- [ ] **Anti-exploit:** high-risk loops assume cheaters  
- [ ] **Secrets:** nothing credential-like under `ReplicatedStorage` or in client modules  
- [ ] **HttpService:** keys and URLs only where the server runs them  

## Severity Definitions

**CRITICAL** — Trivial or likely remote exploit with large player impact (economy duping, unauthorized admin, mass grief)  
**HIGH** — Exploitable with conditions; serious fairness or data impact  
**MEDIUM** — Weaker exploit or limited blast radius  
**LOW** — Hardening / clarity improvements  

## Use with Other Skills

**With Team:**

```
/team "run security review on server RemoteEvents and ProcessReceipt grants before publish"
```

**With Swarm (compatibility alias):**

```
/swarm 4:security-reviewer "parallel pass on combat + trading + datastore modules"
```

**With Forge:**

```
/forge security-review then fix CRITICAL/HIGH only
```

## Best Practices

- Review **before** wiring new remotes to economy or progression  
- Prefer **small, auditable** server modules over giant client-driven state machines  
- Re-review after any change to **grant**, **refund**, or **inventory** paths  
- After fixes, re-run the same remote-level checks you used the first time  

## Scenario Examples

**Good:** The user says `continue` after you already listed the next remote to trace; keep tracing until the chain is complete.

**Bad:** The user says `continue` and you restart from “what is Roblox” instead of finishing the active exploit hypothesis.
