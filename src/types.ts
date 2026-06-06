export type ScriptMap = Readonly<Record<string, string>>

export type RepositorySummary = Readonly<{
  root: string
  repoName: string
  hasReadme: boolean
  hasLicense: boolean
  files: readonly string[]
  topLevelEntries: readonly string[]
  scripts: ScriptMap
}>

export type GeneratedDocs = Readonly<{
  agents: string
  claude: string
}>

export type SyncResult = Readonly<{
  written: readonly string[]
}>

export type LintSeverity = "error" | "warning"

export type LintIssue = Readonly<{
  file: string
  message: string
  severity: LintSeverity
}>

export type LintReport = Readonly<{
  issues: readonly LintIssue[]
}>
