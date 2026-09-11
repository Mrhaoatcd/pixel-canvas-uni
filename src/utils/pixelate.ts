// H5: full browser Canvas API — scale down then scale up with no smoothing
// #ifdef H5
export function pixelate(
  imageUrl: string,
  targetPixels = 128,
  outputSize = 512,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const small = document.createElement('canvas')
      small.width = targetPixels
      small.height = targetPixels
      const sctx = small.getContext('2d')!
      sctx.imageSmoothingEnabled = false
      sctx.drawImage(img, 0, 0, targetPixels, targetPixels)

      const out = document.createElement('canvas')
      out.width = outputSize
      out.height = outputSize
      const octx = out.getContext('2d')!
      octx.imageSmoothingEnabled = false
      octx.drawImage(small, 0, 0, outputSize, outputSize)

      resolve(out.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageUrl
  })
}
// #endif

// Mini-program: no imageSmoothingEnabled support in older Canvas API,
// skip post-process and return the AI output URL directly.
// #ifndef H5
export async function pixelate(imageUrl: string): Promise<string> {
  return imageUrl
}
// #endif
