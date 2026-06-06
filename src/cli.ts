import { z } from "zod"

import { CLI_COMMANDS } from "./constants.js"
import { generateRepositoryDocs } from "./generate.js"
import { lintRepository } from "./lint.js"
import { scanRepository } from "./scan.js"
import { syncRepository } from "./sync.js"

const commandSchema = z.enum(CLI_COMMANDS)
const rootSchema = z.string().min(1)

type CliInput = Readonly<{
  command: (typeof CLI_COMMANDS)[number]
  root: string
}>

function parseArgs(argv: readonly string[]): CliInput {
  const commandResult = commandSchema.safeParse(argv[0] ?? "sync")
  if (!commandResult.success) {
    throw new Error(`Unknown command: ${argv[0] ?? ""}`)
  }

  const rootResult = rootSchema.safeParse(argv[1] ?? ".")
  if (!rootResult.success) {
    throw new Error("Repository root must be a non-empty string.")
  }

  return {
    command: commandResult.data,
    root: rootResult.data,
  }
}

async function runScan(root: string): Promise<void> {
  const summary = await scanRepository(root)
  console.log(JSON.stringify(summary, null, 2))
}

async function runGenerate(root: string): Promise<void> {
  const summary = await scanRepository(root)
  const docs = generateRepositoryDocs(summary)
  console.log(docs.agents)
  console.log("---")
  console.log(docs.claude)
}

async function runLint(root: string): Promise<number> {
  const report = await lintRepository(root)
  if (report.issues.length === 0) {
    console.log("No lint issues found.")
    return 0
  }

  for (const issue of report.issues) {
    console.log(`${issue.severity.toUpperCase()}: ${issue.file} - ${issue.message}`)
  }

  return 1
}

async function runSync(root: string): Promise<void> {
  const result = await syncRepository(root)
  console.log(`Wrote ${result.written.join(", ")}`)
}

async function main(argv: readonly string[]): Promise<number> {
  const input = parseArgs(argv)

  switch (input.command) {
    case "generate":
      await runGenerate(input.root)
      return 0
    case "lint":
      return await runLint(input.root)
    case "scan":
      await runScan(input.root)
      return 0
    case "sync":
      await runSync(input.root)
      return 0
    default: {
      const exhaustiveCheck: never = input.command
      throw new Error(`Unhandled command: ${exhaustiveCheck}`)
    }
  }
}

if (import.meta.main) {
  main(process.argv.slice(2))
    .then((exitCode) => {
      if (exitCode !== 0) {
        process.exitCode = exitCode
      }
    })
    .catch((error: unknown) => {
      console.error(error)
      process.exitCode = 1
    })
}
