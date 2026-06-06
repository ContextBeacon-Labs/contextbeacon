# ContextBeacon

This repository packages a source-backed scanning and context-generation workflow.

## What it does
- Scans repository structure.
- Generates agent-ready Markdown context files.
- Synchronizes `AGENTS.md` and `CLAUDE.md` with the source tree.

## Repository snapshot
- Repository: `contextbeacon`
- Root: `.`
- README present: yes
- License present: yes
- Top-level entries: LICENSE, README.md, package.json, .github, .gitignore, AGENTS.md, assets, biome.json, CLAUDE.md, docs, pnpm-lock.yaml, src, tests, tsconfig.build.json, tsconfig.json
- File count: 24

## Useful scripts
- `build`: `tsc -p tsconfig.build.json`
- `check`: `biome check . && tsc --noEmit && pnpm test`
- `format`: `biome format --write .`
- `generate`: `pnpm run build && node dist/src/cli.js generate`
- `lint`: `pnpm run build && node dist/src/cli.js lint`
- `scan`: `pnpm run build && node dist/src/cli.js scan`
- `sync`: `pnpm run build && node dist/src/cli.js sync`
- `test`: `pnpm run build && node --test dist/tests/contextbeacon.test.js`
- `typecheck`: `tsc --noEmit`
