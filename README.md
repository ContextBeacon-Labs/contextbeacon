![ContextBeacon icon](./assets/contextbeacon-icon.png)

# ContextBeacon

Local-first repository intelligence for coding agents.

ContextBeacon turns a codebase into an agent-ready package: a compact repo map, the key entry points, the relevant dependencies, and the docs an AI assistant needs before it starts editing.

## Current status

- GitHub organization: `ContextBeacon-Labs`
- Public repository: `ContextBeacon-Labs/contextbeacon`
- Organization avatar: custom beacon mark
- Brand assets: `assets/contextbeacon-icon.svg` and `assets/contextbeacon-icon.png`
- CLI scaffold: `scan`, `generate`, `lint`, `sync`
- Generated context files: `AGENTS.md` and `CLAUDE.md`

## Quick start

```bash
pnpm install
pnpm run scan
pnpm run sync
pnpm test
```

## CLI

- `scan` prints a repository summary as JSON
- `generate` renders `AGENTS.md` and `CLAUDE.md` content to stdout
- `lint` checks for the minimum OSS launch files and scripts
- `sync` writes the generated context files into the repository root

## Why this exists

- Agents waste tokens rediscovering the same repository shape.
- Context files go stale unless they are generated from the codebase.
- Maintainers need a simple way to hand an AI the right context, not the whole tree.

## What it will do

- Generate `AGENTS.md`, `CLAUDE.md`, and other agent context files from a repository
- Produce a repository map with key files, modules, scripts, and entry points
- Flag stale paths, missing docs, and broken command references
- Keep the generated context aligned with the current codebase

## First release structure

1. `scan` - inspect a repo and collect structure
2. `generate` - emit agent-ready context files
3. `lint` - detect stale instructions and missing repo metadata
4. `sync` - update generated files when the source changes

## Suggested stack

- TypeScript
- Node.js CLI
- Markdown-first outputs
- Optional GitHub Action for automation

## Roadmap

- Repo structure scanner
- Context file generator
- Stale-path linter
- GitHub Action
- MCP adapter for agent tools

## Contributing

The first useful contributions are:

- repo scanner rules
- output templates
- command discovery
- validation checks

## License

MIT
