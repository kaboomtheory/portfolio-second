import { config as loadEnv } from 'dotenv'
import { createReadStream } from 'node:fs'
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
loadEnv({ path: join(REPO_ROOT, '.env') })
const IMAGES_ROOT = join(REPO_ROOT, 'public', 'images', 'projects')
const OUTPUT_DIR = join(REPO_ROOT, 'scripts', 'output')
const MANIFEST_PATH = join(
  OUTPUT_DIR,
  'sanity-project-images-manifest.json',
)

const IMAGE_EXT = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.svg',
])

const projectId = process.env.SANITY_PROJECT_ID || 'ns0czoug'
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2025-01-01'
const token = process.env.SANITY_API_TOKEN

function isImageFile(name) {
  const lower = name.toLowerCase()
  const dot = lower.lastIndexOf('.')
  if (dot < 0) return false
  return IMAGE_EXT.has(lower.slice(dot))
}

/**
 * @param {string} dir
 * @param {string} base - root for relative paths (IMAGES_ROOT)
 * @param {{ full: string, rel: string }[]} acc
 */
async function collectImageFiles(dir, base, acc) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      await collectImageFiles(full, base, acc)
    } else if (e.isFile() && isImageFile(e.name)) {
      acc.push({
        full,
        rel: relative(base, full).split('\\').join('/'),
      })
    }
  }
  return acc
}

async function main() {
  if (!token?.trim()) {
    console.error(
      'Missing SANITY_API_TOKEN. Set it in .env or the environment (write-capable token).',
    )
    process.exit(1)
  }

  let rootStat
  try {
    rootStat = await stat(IMAGES_ROOT)
  } catch {
    console.error(`Directory not found: ${IMAGES_ROOT}`)
    process.exit(1)
  }
  if (!rootStat.isDirectory()) {
    console.error(`Not a directory: ${IMAGES_ROOT}`)
    process.exit(1)
  }

  const files = await collectImageFiles(IMAGES_ROOT, IMAGES_ROOT, [])
  files.sort((a, b) => a.rel.localeCompare(b.rel))

  if (files.length === 0) {
    console.warn(`No image files under ${IMAGES_ROOT}`)
    await mkdir(OUTPUT_DIR, { recursive: true })
    await writeFile(
      MANIFEST_PATH,
      JSON.stringify({ uploadedAt: new Date().toISOString(), entries: {} }, null, 2),
      'utf8',
    )
    console.log(`Wrote empty manifest: ${MANIFEST_PATH}`)
    return
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token: token.trim(),
    useCdn: false,
  })

  /** @type {Record<string, { assetId: string, url?: string }>} */
  const entries = {}
  const errors = []

  console.log(
    `Uploading ${files.length} file(s) to project=${projectId} dataset=${dataset}…`,
  )

  for (const { full, rel } of files) {
    try {
      const asset = await client.assets.upload(
        'image',
        createReadStream(full),
        { filename: rel },
      )
      entries[rel] = {
        assetId: asset._id ?? '',
        url: asset.url,
      }
      console.log(`  OK  ${rel}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push({ rel, msg })
      console.error(`  ERR ${rel}: ${msg}`)
    }
  }

  await mkdir(OUTPUT_DIR, { recursive: true })
  const payload = {
    uploadedAt: new Date().toISOString(),
    projectId,
    dataset,
    entries,
    errors: errors.length ? errors : undefined,
  }
  await writeFile(MANIFEST_PATH, JSON.stringify(payload, null, 2), 'utf8')
  console.log(`\nManifest: ${MANIFEST_PATH}`)

  if (errors.length) {
    console.error(`\n${errors.length} upload(s) failed.`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
