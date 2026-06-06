import { strict as assert } from "node:assert"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, test } from "node:test"

import { generateRepositoryDocs } from "../src/generate.js"
import { scanRepository } from "../src/scan.js"
import { syncRepository } from "../src/sync.js"

const createdRoots: string[] = []

afterEach(async () => {
  await Promise.all(
    createdRoots.splice(0).map(async (root) => {
      await rm(root, { recursive: true, force: true })
    }),
  )
})

async function createFixtureRepo(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "contextbeacon-"))
  createdRoots.push(root)

  await mkdir(join(root, "src"), { recursive: true })
  await mkdir(join(root, "dist"), { recursive: true })
  await mkdir(join(root, "node_modules", "ignored"), { recursive: true })

  await writeFile(join(root, "README.md"), "# ContextBeacon\n")
  await writeFile(join(root, "LICENSE"), "MIT\n")
  await writeFile(
    join(root, "package.json"),
    JSON.stringify(
      { name: "contextbeacon", scripts: { scan: "bun run src/cli.ts scan" } },
      null,
      2,
    ),
  )
  await writeFile(join(root, "src", "index.ts"), "export const answer = 42;\n")
  await writeFile(join(root, "dist", "ignored.js"), "console.log('ignored');\n")
  await writeFile(join(root, "node_modules", "ignored", "index.js"), "console.log('ignored');\n")

  return root
}

describe("ContextBeacon repository scanning", () => {
  test("Given a repository fixture When scanned Then generated paths are ignored", async () => {
    const root = await createFixtureRepo()

    const summary = await scanRepository(root)

    assert.equal(summary.repoName, "contextbeacon")
    assert.equal(summary.hasReadme, true)
    assert.equal(summary.hasLicense, true)
    assert.deepEqual(summary.files, ["LICENSE", "README.md", "package.json", "src/index.ts"])
    assert.deepEqual(summary.topLevelEntries, ["LICENSE", "README.md", "package.json", "src"])
    const { scan } = summary.scripts
    assert.equal(scan, "bun run src/cli.ts scan")

    const docs = generateRepositoryDocs(summary)
    assert.match(docs.agents, /# ContextBeacon/)
    assert.match(docs.agents, /scan/)
    assert.match(docs.claude, /ContextBeacon/)
  })
})

describe("ContextBeacon context generation", () => {
  test("Given a repository fixture When synced Then context files are written", async () => {
    const root = await createFixtureRepo()

    const result = await syncRepository(root)

    assert.deepEqual(result.written, ["AGENTS.md", "CLAUDE.md"])
    assert.match(await readFile(join(root, "AGENTS.md"), "utf8"), /# ContextBeacon/)
    assert.match(await readFile(join(root, "AGENTS.md"), "utf8"), /scan/)
    assert.match(await readFile(join(root, "CLAUDE.md"), "utf8"), /ContextBeacon/)
  })
})
