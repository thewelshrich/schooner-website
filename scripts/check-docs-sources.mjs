import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'

const sourceRoot = process.argv[2]
if (!sourceRoot) {
  console.error('Usage: npm run docs:check -- /path/to/schooner-cli')
  process.exit(1)
}
const manifest = JSON.parse(await readFile(new URL('../docs-sources.json', import.meta.url), 'utf8'))
let changed = false
for (const [file, expected] of Object.entries(manifest.files)) {
  try {
    const digest = createHash('sha256').update(await readFile(resolve(sourceRoot, file))).digest('hex')
    if (digest !== expected) {
      console.error(`Review guides: upstream ${file} has changed since ${manifest.revision.slice(0, 7)}.`)
      changed = true
    }
  } catch {
    console.error(`Unable to read ${file} in the supplied CLI checkout.`)
    changed = true
  }
}
if (changed) process.exit(1)
console.log(`Documentation sources match the recorded snapshot (${manifest.revision.slice(0, 7)}).`)
