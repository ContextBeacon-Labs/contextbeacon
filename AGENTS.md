# ContextBeacon

Local-first repository intelligence for coding agents.

## Repository snapshot
- Repository: `contextbeacon`
- Root: `.`
- README present: yes
- License present: yes
- Top-level entries: LICENSE, README.md, package.json, .github, .gitignore, AGENTS.md, assets, biome.json, CLAUDE.md, docs, pnpm-lock.yaml, src, tests, tsconfig.build.json, tsconfig.json
- File count: 24

## Available scripts
- `build`: `tsc -p tsconfig.build.json`
- `check`: `biome check . && tsc --noEmit && pnpm test`
- `format`: `biome format --write .`
- `generate`: `pnpm run build && node dist/src/cli.js generate`
- `lint`: `pnpm run build && node dist/src/cli.js lint`
- `scan`: `pnpm run build && node dist/src/cli.js scan`
- `sync`: `pnpm run build && node dist/src/cli.js sync`
- `test`: `pnpm run build && node --test dist/tests/contextbeacon.test.js`
- `typecheck`: `tsc --noEmit`

## Generated context files
- `AGENTS.md`
- `CLAUDE.md`
