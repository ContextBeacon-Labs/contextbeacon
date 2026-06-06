import { CONTEXT_FILES, PRODUCT_NAME } from "./constants.js"
import type { GeneratedDocs, RepositorySummary } from "./types.js"

function renderScriptList(scripts: RepositorySummary["scripts"]): string[] {
  const scriptEntries = Object.entries(scripts).sort(([left], [right]) => left.localeCompare(right))

  if (scriptEntries.length === 0) {
    return ["- No package scripts detected yet."]
  }

  return scriptEntries.map(([name, command]) => `- \`${name}\`: \`${command}\``)
}

function renderRepositoryFacts(summary: RepositorySummary): string[] {
  return [
    `- Repository: \`${summary.repoName}\``,
    `- Root: \`${summary.root}\``,
    `- README present: ${summary.hasReadme ? "yes" : "no"}`,
    `- License present: ${summary.hasLicense ? "yes" : "no"}`,
    `- Top-level entries: ${summary.topLevelEntries.join(", ") || "none"}`,
    `- File count: ${summary.files.length}`,
  ]
}

function renderContextFiles(): string[] {
  return CONTEXT_FILES.map((file) => `- \`${file}\``)
}

export function generateRepositoryDocs(summary: RepositorySummary): GeneratedDocs {
  const agentsLines = [
    `# ${PRODUCT_NAME}`,
    "",
    "Local-first repository intelligence for coding agents.",
    "",
    "## Repository snapshot",
    ...renderRepositoryFacts(summary),
    "",
    "## Available scripts",
    ...renderScriptList(summary.scripts),
    "",
    "## Generated context files",
    ...renderContextFiles(),
  ]

  const claudeLines = [
    `# ${PRODUCT_NAME}`,
    "",
    "This repository packages a source-backed scanning and context-generation workflow.",
    "",
    "## What it does",
    "- Scans repository structure.",
    "- Generates agent-ready Markdown context files.",
    "- Synchronizes `AGENTS.md` and `CLAUDE.md` with the source tree.",
    "",
    "## Repository snapshot",
    ...renderRepositoryFacts(summary),
    "",
    "## Useful scripts",
    ...renderScriptList(summary.scripts),
  ]

  return {
    agents: `${agentsLines.join("\n")}\n`,
    claude: `${claudeLines.join("\n")}\n`,
  }
}
