import { access } from "node:fs/promises"
import { join } from "node:path"

import { CONTEXT_FILES } from "./constants.js"
import { scanRepository } from "./scan.js"
import type { LintIssue, LintReport } from "./types.js"

const requiredFiles = ["LICENSE", "README.md"] as const
const requiredScripts = ["generate", "lint", "scan", "sync"] as const

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function createIssue(file: string, message: string): LintIssue {
  return {
    file,
    message,
    severity: "error",
  }
}

export async function lintRepository(root: string): Promise<LintReport> {
  const summary = await scanRepository(root)
  const issues: LintIssue[] = []

  for (const fileName of requiredFiles) {
    if (!(await fileExists(join(root, fileName)))) {
      issues.push(createIssue(fileName, "Required repository file is missing."))
    }
  }

  for (const contextFile of CONTEXT_FILES) {
    if (!(await fileExists(join(root, contextFile)))) {
      issues.push(createIssue(contextFile, "Generated context file is missing."))
    }
  }

  for (const scriptName of requiredScripts) {
    if (summary.scripts[scriptName] === undefined) {
      issues.push(createIssue("package.json", `Missing package script: ${scriptName}.`))
    }
  }

  return {
    issues,
  }
}
