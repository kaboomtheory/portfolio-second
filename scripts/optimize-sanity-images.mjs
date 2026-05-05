import { config as loadEnv } from 'dotenv'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@sanity/client'
import { optimizeImage } from './lib/optimize-image.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
loadEnv({ path: join(REPO_ROOT, '.env') })

const OUTPUT_DIR = join(REPO_ROOT, 'scripts', 'output')
const TMP_DIR = join(OUTPUT_DIR, '.tmp-optimize')
const MANIFEST_PATH = join(OUTPUT_DIR, 'sanity-project-images-manifest.json')
const ASSET_MAP_PATH = join(OUTPUT_DIR, 'sanity-asset-id-map.json')

const projectId = process.env.SANITY_PROJECT_ID || 'ns0czoug'
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2025-01-01'
const token = process.env.SANITY_API_TOKEN

const DRY_RUN = process.argv.includes('--dry-run')
const CLEANUP = process.argv.includes('--cleanup')

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)}KB`
  return `${(kb / 1024).toFixed(2)}MB`
}

function extractAssetRef(assetId) {
  return assetId.startsWith('image-') ? assetId : `image-${assetId}`
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function downloadImage(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

function walkImageRefs(obj, path = '') {
  const refs = []
  if (!obj || typeof obj !== 'object') return refs

  if (obj.asset && obj.asset._ref) {
    refs.push({ path: path ? `${path}.asset._ref` : 'asset._ref', ref: obj.asset._ref })
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      refs.push(...walkImageRefs(obj[i], `${path}[${i}]`))
    }
  } else {
    for (const [key, val] of Object.entries(obj)) {
      if (key === '_type' || key === '_key' || key === '_id' || key === '_rev' || key === '_createdAt' || key === '_updatedAt') continue
      if (typeof val === 'object' && val !== null) {
        refs.push(...walkImageRefs(val, path ? `${path}.${key}` : key))
      }
    }
  }

  return refs
}

function setNestedValue(obj, pathStr, value) {
  const parts = pathStr.split(/\.|\[(\d+)\]/).filter(Boolean)
  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const key = /^\d+$/.test(parts[i]) ? parseInt(parts[i]) : parts[i]
    current = current[key]
  }
  const lastKey = /^\d+$/.test(parts[parts.length - 1]) ? parseInt(parts[parts.length - 1]) : parts[parts.length - 1]
  current[lastKey] = value
}

async function main() {
  if (!token?.trim()) {
    console.error('Missing SANITY_API_TOKEN. Set it in .env or the environment.')
    process.exit(1)
  }

  const client = createClient({ projectId, dataset, apiVersion, token: token.trim(), useCdn: false })

  if (CLEANUP) {
    await runCleanup(client)
    return
  }

  let manifest
  try {
    manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
  } catch {
    console.error(`Cannot read manifest: ${MANIFEST_PATH}`)
    process.exit(1)
  }

  const entries = Object.entries(manifest.entries)
  console.log(`Manifest has ${entries.length} entries`)

  const uniqueAssets = new Map()
  for (const [key, val] of entries) {
    const id = val.assetId
    if (!uniqueAssets.has(id)) {
      uniqueAssets.set(id, { key, url: val.url, assetId: id, aliases: [key] })
    } else {
      uniqueAssets.get(id).aliases.push(key)
    }
  }

  console.log(`${uniqueAssets.size} unique assets (${entries.length - uniqueAssets.size} duplicates)\n`)

  await mkdir(TMP_DIR, { recursive: true })

  const results = []
  const assetMap = {}
  let totalOriginal = 0
  let totalOptimized = 0
  let index = 0

  for (const [assetId, info] of uniqueAssets) {
    index++
    const isGif = info.key.endsWith('.gif')
    if (isGif) {
      console.log(`[${index}/${uniqueAssets.size}] SKIP (GIF): ${info.key}`)
      continue
    }

    console.log(`[${index}/${uniqueAssets.size}] Downloading: ${info.key} (${assetId})`)

    let inputBuffer
    try {
      inputBuffer = await downloadImage(info.url)
    } catch (err) {
      console.error(`  FAILED to download: ${err.message}`)
      continue
    }

    console.log(`  Downloaded: ${formatBytes(inputBuffer.length)}`)

    const result = await optimizeImage(inputBuffer, { format: 'webp' })
    const m = result.metadata
    const savings = ((1 - m.sizeBytes / m.originalSizeBytes) * 100).toFixed(1)
    const status = m.needsReview ? ' [NEEDS REVIEW]' : ''

    console.log(`  Optimized: ${formatBytes(m.sizeBytes)} (q${m.quality}, ${m.width}x${m.height}, -${savings}%)${status}`)

    totalOriginal += m.originalSizeBytes
    totalOptimized += m.sizeBytes

    const safeName = info.key.replace(/[/\\]/g, '_').replace(/\.[^.]+$/, '.webp')
    const tmpPath = join(TMP_DIR, safeName)
    await writeFile(tmpPath, result.buffer)

    results.push({
      key: info.key,
      aliases: info.aliases,
      oldAssetId: assetId,
      originalSize: m.originalSizeBytes,
      optimizedSize: m.sizeBytes,
      savings: `${savings}%`,
      quality: m.quality,
      width: m.width,
      height: m.height,
      needsReview: m.needsReview,
      tmpPath,
      buffer: result.buffer,
    })

    if (index % 10 === 0) await sleep(500)
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`DOWNLOAD & OPTIMIZE COMPLETE`)
  console.log(`${'='.repeat(60)}`)
  console.log(`Total before: ${formatBytes(totalOriginal)}`)
  console.log(`Total after:  ${formatBytes(totalOptimized)}`)
  console.log(`Total saved:  ${formatBytes(totalOriginal - totalOptimized)} (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`)

  const reviewItems = results.filter((r) => r.needsReview)
  if (reviewItems.length > 0) {
    console.log(`\n${reviewItems.length} image(s) need manual review:`)
    for (const r of reviewItems) {
      console.log(`  - ${r.key}: ${formatBytes(r.optimizedSize)} at q${r.quality}`)
    }
  }

  if (DRY_RUN) {
    console.log(`\n--dry-run: No uploads or patches performed.`)
    console.log(`Optimized files saved to: ${TMP_DIR}`)
    return
  }

  console.log(`\nPhase 2: Uploading optimized assets to Sanity...\n`)

  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    console.log(`[${i + 1}/${results.length}] Uploading: ${r.key}`)

    try {
      const asset = await client.assets.upload('image', r.buffer, {
        filename: r.key.replace(/\.[^.]+$/, '.webp'),
      })
      assetMap[r.oldAssetId] = asset._id
      console.log(`  OK → ${asset._id}`)
    } catch (err) {
      console.error(`  FAILED: ${err.message}`)
    }

    if ((i + 1) % 5 === 0) await sleep(1000)
  }

  await writeFile(ASSET_MAP_PATH, JSON.stringify(assetMap, null, 2), 'utf8')
  console.log(`\nAsset ID map saved: ${ASSET_MAP_PATH}`)

  console.log(`\nPhase 3: Patching document references...\n`)

  const docs = await client.fetch(`*[_type in ["project", "aboutPage", "statusItem"]]`)
  console.log(`Found ${docs.length} documents to check`)

  let patchCount = 0
  for (const doc of docs) {
    const refs = walkImageRefs(doc)
    const toUpdate = refs.filter((r) => assetMap[r.ref])

    if (toUpdate.length === 0) continue

    console.log(`  ${doc._type} "${doc.name || doc._id}": ${toUpdate.length} ref(s) to update`)

    for (const ref of toUpdate) {
      setNestedValue(doc, ref.path, assetMap[ref.ref])
    }

    const { _id, _type, _rev, _createdAt, _updatedAt, ...fields } = doc
    try {
      await client.patch(_id).set(fields).commit()
      patchCount++
      console.log(`    Patched: ${_id}`)
    } catch (err) {
      console.error(`    FAILED to patch ${_id}: ${err.message}`)
    }
  }

  console.log(`\nPatched ${patchCount} document(s).`)

  console.log(`\nPhase 4: Verifying references...\n`)
  const verifyDocs = await client.fetch(`*[_type in ["project", "aboutPage", "statusItem"]]`)
  const oldIds = new Set(Object.keys(assetMap))
  let staleCount = 0
  for (const doc of verifyDocs) {
    const refs = walkImageRefs(doc)
    for (const r of refs) {
      if (oldIds.has(r.ref)) {
        console.error(`  STALE ref in ${doc._id}: ${r.path} → ${r.ref}`)
        staleCount++
      }
    }
  }

  if (staleCount === 0) {
    console.log(`All references updated successfully.`)
  } else {
    console.error(`${staleCount} stale reference(s) remain — run again or patch manually.`)
  }

  console.log(`\nDone. Run with --cleanup to delete old assets.`)
}

async function runCleanup(client) {
  let assetMap
  try {
    assetMap = JSON.parse(await readFile(ASSET_MAP_PATH, 'utf8'))
  } catch {
    console.error(`No asset map found at ${ASSET_MAP_PATH}. Run optimization first.`)
    process.exit(1)
  }

  const oldIds = Object.keys(assetMap)
  console.log(`Deleting ${oldIds.length} old asset(s)...\n`)

  let deleted = 0
  let failed = 0
  for (const id of oldIds) {
    try {
      await client.delete(id)
      deleted++
      console.log(`  Deleted: ${id}`)
    } catch (err) {
      failed++
      console.error(`  Failed to delete ${id}: ${err.message}`)
    }
  }

  console.log(`\nDeleted: ${deleted}, Failed: ${failed}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
