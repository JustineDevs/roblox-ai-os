# RCS Wiki

RCS Wiki is a compiled markdown knowledge layer for agents.

## What it is

- local project knowledge stored under `.rcs/wiki/`
- markdown-first and search-first
- designed for agentic retrieval workflows, not vector-first RAG

## Core user surfaces

- `rcs wiki add`
- `rcs wiki query`
- `rcs wiki lint`
- `rcs wiki refresh`
- `rcs wiki list`
- `rcs wiki read`
- `rcs wiki delete`

## Retrieval model

- Wiki pages are queried first when useful
- `rcs explore` can inject wiki-first context before broader repository search
- repository search remains the fallback when wiki evidence is weak or missing

## Lifecycle model

- SessionStart can inject compact wiki context through the native hook path
- SessionEnd can capture session-log pages through the runtime cleanup path

## Constraints

- no vector embeddings required
- wiki is local project state, not source-controlled product code
