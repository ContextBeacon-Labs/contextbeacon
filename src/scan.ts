import { readdir, readFile } from "node:fs/promises"
import { basename, join, relative } from "node:path"
import { z } from "zod"

import { REPOSITORY_IGNORED_NAMES } from "./constants.js"
import { toPosixPath } from "./path-utils.js"
import type { RepositorySummary, ScriptMap } from "./types.js"

const packageJsonSchema = z
  .object({
    name: z.string().optional(),
    scripts: z.record(z.string(), z.string()).optional(),
  })
  .passthrough()

const ignoredNames = new Set<string>(REPOSITORY_IGNORED_NAMES)

function entryPriority(name: string): number {
  switch (name) {
    case "LICENSE":
      return 0
    case "README.md":
      return 1
    case "package.json":
      return 2
    default:
      return 10
  }
}

function compareEntryNames(left: string, right: string): number {
  const priorityDelta = entryPriority(left) - entryPriority(right)
  if (priorityDelta !== 0) {
    return priorityDelta
  }

  return left.localeCompare(right)
}

function shouldIgnoreName(name: string): boolean {
  return ignoredNames.has(name)
}

function isRegularRepositoryEntry(name: string): boolean {
  return !shouldIgnoreName(name)
}

async function readPackageManifest(root: string): Promise<{
  name: string | undefined
  scripts: ScriptMap
}> {
  const packageJsonPath = join(root, "package.json")

  try {
    const raw = await readFile(packageJsonPath, "utf8")
    const parsed = packageJsonSchema.parse(JSON.parse(raw))
    return {
      name: parsed.name,
      scripts: parsed.scripts ?? {},
    }
  } catch {
    return {
      name: undefined,
      scripts: {},
    }
  }
}

async function collectFiles(root: string, currentDir: string, files: string[]): Promise<void> {
  const entries = await readdir(currentDir, { withFileTypes: true })
  entries.sort((left, right) => compareEntryNames(left.name, right.name))

  for (const entry of entries) {
    if (!isRegularRepositoryEntry(entry.name)) {
      continue
    }

    const absolutePath = join(currentDir, entry.name)
    const relativePath = toPosixPath(relative(root, absolutePath))

    if (entry.isDirectory()) {
      await collectFiles(root, absolutePath, files)
      continue
    }

    if (entry.isFile()) {
      files.push(relativePath)
    }
  }
}

async function collectTopLevelEntries(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true })

  return entries
    .filter((entry) => isRegularRepositoryEntry(entry.name))
    .filter((entry) => entry.isDirectory() || entry.isFile())
    .map((entry) => entry.name)
    .sort(compareEntryNames)
}

export async function scanRepository(root: string): Promise<RepositorySummary> {
  const manifest = await readPackageManifest(root)
  const files: string[] = []

  await collectFiles(root, root, files)

  return {
    root,
    repoName: manifest.name ?? basename(root),
    hasReadme: files.includes("README.md"),
    hasLicense: files.includes("LICENSE"),
    files,
    topLevelEntries: await collectTopLevelEntries(root),
    scripts: manifest.scripts,
  }
}
