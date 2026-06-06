import { writeFile } from "node:fs/promises"
import { join } from "node:path"

import { CONTEXT_FILES } from "./constants.js"
import { generateRepositoryDocs } from "./generate.js"
import { scanRepository } from "./scan.js"
import type { SyncResult } from "./types.js"

export async function syncRepository(root: string): Promise<SyncResult> {
  const summary = await scanRepository(root)
  const docs = generateRepositoryDocs(summary)

  await writeFile(join(root, CONTEXT_FILES[0]), docs.agents, "utf8")
  await writeFile(join(root, CONTEXT_FILES[1]), docs.claude, "utf8")

  return {
    written: [...CONTEXT_FILES],
  }
}
