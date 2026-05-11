---
name: wiki
description: Persistent markdown project wiki stored under .rcs/wiki with keyword search and lifecycle capture
triggers: ["wiki add", "wiki lint", "wiki query", "wiki read", "wiki delete"]
surface-class: "operator"
domain: "creator-runtime"
audience: "operator"
artifact-type: "skill"
---

# Wiki

Persistent, self-maintained markdown knowledge base for project and session knowledge.

## Operations

### Ingest
```text
wiki_ingest({ title: "Economy & remotes", content: "...", tags: ["roblox", "security"], category: "architecture" })
```

### Query
```text
wiki_query({ query: "DataStore player profile", tags: ["roblox", "data"], category: "architecture" })
```

### Lint
```text
wiki_lint()
```

### Quick Add
```text
wiki_add({ title: "Page Title", content: "...", tags: ["tag1"], category: "decision" })
```

### List / Read / Delete
```text
wiki_list()
wiki_read({ page: "economy-remotes" })
wiki_delete({ page: "outdated-page" })
wiki_refresh()
```

## Categories
`architecture`, `decision`, `pattern`, `debugging`, `environment`, `session-log`, `reference`, `convention`

## Storage
- Pages: `.rcs/wiki/*.md`
- Index: `.rcs/wiki/index.md`
- Log: `.rcs/wiki/log.md`

## Cross-References
Use `[[page-name]]` wiki-link syntax to create cross-references between pages.

## Auto-Capture
At session end, discoveries can be captured as `session-log-*` pages. Configure via `wiki.autoCapture` in `.rcs-config.json`.

## Hard Constraints
- No vector embeddings — query uses keyword + tag matching only
- Wiki files remain local project state under `.rcs/wiki/`
