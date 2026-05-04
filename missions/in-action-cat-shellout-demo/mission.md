# Mission
Optimize RCS autoresearch itself by removing the unnecessary shell-out to `cat` inside `runAutoresearchLoop()`.

Primary target:
- `src/cli/autoresearch.ts`

Supporting surfaces that may need updates:
- `src/cli/__tests__/autoresearch.test.ts`
- other focused autoresearch tests only if needed

Success means:
1. `runAutoresearchLoop()` no longer shells out to `cat` just to read the manifest/run id
2. the autoresearch CLI/runtime tests still pass
3. the change stays small and behavior-preserving
