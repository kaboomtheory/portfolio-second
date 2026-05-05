import sharp from 'sharp'

const DEFAULT_MAX_WIDTH = 2400
const DEFAULT_MAX_FILE_SIZE = 400 * 1024
const DEFAULT_START_QUALITY = 90
const DEFAULT_QUALITY_STEP = 3
const DEFAULT_QUALITY_FLOOR = 75
const DEFAULT_DPI = 72

/**
 * @param {Buffer} inputBuffer
 * @param {{
 *   maxWidth?: number,
 *   maxFileSize?: number,
 *   startQuality?: number,
 *   qualityFloor?: number,
 *   qualityStep?: number,
 *   dpi?: number,
 *   format?: 'webp' | 'png' | 'original',
 *   keepFormat?: boolean,
 * }} [options]
 * @returns {Promise<{
 *   buffer: Buffer,
 *   metadata: {
 *     width: number,
 *     height: number,
 *     format: string,
 *     originalFormat: string,
 *     sizeBytes: number,
 *     originalSizeBytes: number,
 *     quality: number,
 *     needsReview: boolean,
 *     resized: boolean,
 *   }
 * }>}
 */
export async function optimizeImage(inputBuffer, options = {}) {
  const maxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH
  const maxFileSize = options.maxFileSize ?? DEFAULT_MAX_FILE_SIZE
  const startQuality = options.startQuality ?? DEFAULT_START_QUALITY
  const qualityFloor = options.qualityFloor ?? DEFAULT_QUALITY_FLOOR
  const qualityStep = options.qualityStep ?? DEFAULT_QUALITY_STEP
  const dpi = options.dpi ?? DEFAULT_DPI
  const targetFormat = options.format ?? 'webp'
  const keepFormat = options.keepFormat ?? false

  const meta = await sharp(inputBuffer).metadata()
  const originalFormat = meta.format || 'unknown'
  const originalWidth = meta.width || 0
  const originalHeight = meta.height || 0
  const originalSizeBytes = inputBuffer.length

  const needsResize = originalWidth > maxWidth
  const outputFormat = keepFormat ? originalFormat : targetFormat === 'original' ? originalFormat : targetFormat

  let quality = startQuality
  let needsReview = false
  let outputBuffer

  while (quality >= qualityFloor) {
    let pipeline = sharp(inputBuffer)

    if (needsResize) {
      pipeline = pipeline.resize({
        width: maxWidth,
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      })
    }

    if (outputFormat === 'webp') {
      pipeline = pipeline.webp({ quality, effort: 6 })
    } else if (outputFormat === 'png') {
      pipeline = pipeline.png({ quality, compressionLevel: 9 })
    } else if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      pipeline = pipeline.jpeg({ quality, mozjpeg: true })
    }

    pipeline = pipeline.withMetadata({ density: dpi })

    outputBuffer = await pipeline.toBuffer()

    if (outputBuffer.length <= maxFileSize) {
      break
    }

    quality -= qualityStep
  }

  if (outputBuffer.length > maxFileSize) {
    needsReview = true
  }

  const outputMeta = await sharp(outputBuffer).metadata()

  return {
    buffer: outputBuffer,
    metadata: {
      width: outputMeta.width || 0,
      height: outputMeta.height || 0,
      format: outputFormat,
      originalFormat,
      sizeBytes: outputBuffer.length,
      originalSizeBytes,
      quality: Math.max(quality, qualityFloor),
      needsReview,
      resized: needsResize,
    },
  }
}
