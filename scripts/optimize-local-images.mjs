import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { optimizeImage } from './lib/optimize-image.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..')
const PUBLIC_DIR = join(REPO_ROOT, 'public')
const OUTPUT_DIR = join(REPO_ROOT, 'scripts', 'output')

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp'])

const SKIP_FILES = new Set([
  'favicon.svg',
  'apple-touch-icon.png',
  'grain.gif',
  'shadow-grain.png',
  'Jeff_Buckley_grace.jpg',
  'layer_animation.webp',
  'layer_animation.apng',
])

const SKIP_PATTERNS = [
  /clXzZO24Rzu8affcTBLudTtxw\.webp$/,
]

const KEEP_PNG = new Set([
  'og-default.png',
])

function shouldSkip(filePath) {
  const name = basename(filePath)
  if (SKIP_FILES.has(name)) return true
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(filePath)) return true
  }
  const ext = extname(name).toLowerCase()
  if (!IMAGE_EXT.has(ext)) return true
  return false
}

async function collectImages(dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await collectImages(full, results)
    } else if (entry.isFile() && !shouldSkip(full)) {
      const s = await stat(full)
      results.push({ path: full, size: s.size })
    }
  }
  return results
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)}KB`
  return `${(kb / 1024).toFixed(2)}MB`
}

async function main() {
  const files = await collectImages(PUBLIC_DIR)
  files.sort((a, b) => b.size - a.size)

  console.log(`Found ${files.length} images to process\n`)

  const report = { processedAt: new Date().toISOString(), results: [], needsReview: [], codeUpdates: [] }

  for (const file of files) {
    const rel = relative(REPO_ROOT, file.path)
    const name = basename(file.path)
    const isPng = KEEP_PNG.has(name)

    console.log(`Processing: ${rel} (${formatBytes(file.size)})`)

    const inputBuffer = await readFile(file.path)

    const opts = isPng
      ? { format: 'png', keepFormat: true }
      : { format: 'webp' }

    const result = await optimizeImage(inputBuffer, opts)
    const m = result.metadata

    const ext = isPng ? '.png' : '.webp'
    const oldExt = extname(file.path)
    const formatChanged = ext !== oldExt
    const outputPath = formatChanged
      ? file.path.replace(/\.[^.]+$/, ext)
      : file.path

    await writeFile(outputPath, result.buffer)

    const savings = ((1 - m.sizeBytes / m.originalSizeBytes) * 100).toFixed(1)
    const status = m.needsReview ? ' [NEEDS REVIEW]' : ''
    console.log(`  → ${formatBytes(m.sizeBytes)} (q${m.quality}, ${m.width}x${m.height}, -${savings}%)${status}`)

    if (formatChanged) {
      const relOld = relative(REPO_ROOT, file.path)
      const relNew = relative(REPO_ROOT, outputPath)
      console.log(`  Format changed: ${relOld} → ${relNew}`)
      report.codeUpdates.push({ oldPath: '/' + relative(PUBLIC_DIR, file.path), newPath: '/' + relative(PUBLIC_DIR, outputPath) })
    }

    const entry = {
      file: rel,
      outputFile: relative(REPO_ROOT, outputPath),
      originalSize: m.originalSizeBytes,
      optimizedSize: m.sizeBytes,
      savings: `${savings}%`,
      quality: m.quality,
      width: m.width,
      height: m.height,
      format: m.format,
      originalFormat: m.originalFormat,
      resized: m.resized,
      needsReview: m.needsReview,
      formatChanged,
    }

    report.results.push(entry)
    if (m.needsReview) report.needsReview.push(entry)
  }

  await mkdir(OUTPUT_DIR, { recursive: true })
  const reportPath = join(OUTPUT_DIR, 'optimization-report.json')
  await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8')

  console.log(`\n${'='.repeat(60)}`)
  console.log(`SUMMARY`)
  console.log(`${'='.repeat(60)}`)
  console.log(`Processed: ${report.results.length} images`)

  const totalOriginal = report.results.reduce((s, r) => s + r.originalSize, 0)
  const totalOptimized = report.results.reduce((s, r) => s + r.optimizedSize, 0)
  console.log(`Total before: ${formatBytes(totalOriginal)}`)
  console.log(`Total after:  ${formatBytes(totalOptimized)}`)
  console.log(`Total saved:  ${formatBytes(totalOriginal - totalOptimized)} (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`)

  if (report.needsReview.length > 0) {
    console.log(`\n⚠ ${report.needsReview.length} image(s) need manual review (couldn't hit 400KB at quality 75):`)
    for (const r of report.needsReview) {
      console.log(`  - ${r.file} → ${formatBytes(r.optimizedSize)} at q${r.quality}`)
    }
  }

  if (report.codeUpdates.length > 0) {
    console.log(`\nCode references to update:`)
    for (const u of report.codeUpdates) {
      console.log(`  ${u.oldPath} → ${u.newPath}`)
    }
  }

  console.log(`\nFull report: ${reportPath}`)
  console.log(`Originals NOT deleted — verify optimized images visually before cleanup.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
