export const PRODUCT_NAME = "ContextBeacon" as const

export const CONTEXT_FILES = ["AGENTS.md", "CLAUDE.md"] as const

export const REPOSITORY_IGNORED_NAMES = [
  ".git",
  ".playwright-mcp",
  "build",
  "coverage",
  "dist",
  "node_modules",
] as const

export const CLI_COMMANDS = ["generate", "lint", "scan", "sync"] as const

export type CliCommand = (typeof CLI_COMMANDS)[number]
