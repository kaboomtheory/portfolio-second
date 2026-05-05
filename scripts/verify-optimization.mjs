import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const PUBLIC_DIR = join(REPO_ROOT, 'public')
const OUTPUT_DIR = join(REPO_ROOT, 'scripts', 'output')
const ASSET_MAP_PATH = join(OUTPUT_DIR, 'sanity-asset-id-map.json')

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp'])
const MAX_SIZE = 400 * 1024
const MAX_WIDTH = 2400

const SKIP_FILES = new Set([
  'favicon.svg', 'apple-touch-icon.png', 'grain.gif',
  'shadow-grain.png', 'Jeff_Buckley_grace.jpg',
  'layer_animation.webp', 'layer_animation.apng',
])

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)}KB`
  return `${(kb / 1024).toFixed(2)}MB`
}

async function collectImages(dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await collectImages(full, results)
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase()
      if (IMAGE_EXT.has(ext) && !SKIP_FILES.has(entry.name)) {
        results.push(full)
      }
    }
  }
  return results
}

async function main() {
  console.log('Image Optimization Verification\n')

  let pass = 0
  let fail = 0
  const failures = []

  const images = await collectImages(PUBLIC_DIR)
  console.log(`Checking ${images.length} local images...\n`)

  for (const imgPath of images) {
    const rel = relative(REPO_ROOT, imgPath)
    const s = await stat(imgPath)
    const meta = await sharp(await readFile(imgPath)).metadata()

    const sizeOk = s.size <= MAX_SIZE
    const widthOk = (meta.width || 0) <= MAX_WIDTH

    if (sizeOk && widthOk) {
      pass++
    } else {
      fail++
      const reasons = []
      if (!sizeOk) reasons.push(`size ${formatBytes(s.size)} > ${formatBytes(MAX_SIZE)}`)
      if (!widthOk) reasons.push(`width ${meta.width}px > ${MAX_WIDTH}px`)
      failures.push({ file: rel, reasons })
      console.log(`  FAIL: ${rel} — ${reasons.join(', ')}`)
    }
  }

  console.log(`\nLocal images: ${pass} pass, ${fail} fail`)

  let assetMap = null
  try {
    assetMap = JSON.parse(await readFile(ASSET_MAP_PATH, 'utf8'))
    const mappings = Object.keys(assetMap).length
    console.log(`\nSanity asset map: ${mappings} asset(s) remapped`)
  } catch {
    console.log(`\nNo Sanity asset map found (run optimize-sanity-images.mjs first)`)
  }

  let reportData = null
  try {
    reportData = JSON.parse(await readFile(join(OUTPUT_DIR, 'optimization-report.json'), 'utf8'))
    const reviewCount = reportData.needsReview?.length || 0
    if (reviewCount > 0) {
      console.log(`\nImages needing manual review: ${reviewCount}`)
      for (const r of reportData.needsReview) {
        console.log(`  - ${r.file}: ${formatBytes(r.optimizedSize)} at q${r.quality}`)
      }
    }
  } catch {}

  console.log(`\n${'='.repeat(40)}`)
  if (fail === 0) {
    console.log('ALL LOCAL IMAGES PASS')
  } else {
    console.log(`${fail} LOCAL IMAGE(S) OVER BUDGET`)
    for (const f of failures) {
      console.log(`  ${f.file}: ${f.reasons.join(', ')}`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
