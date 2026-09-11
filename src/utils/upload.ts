import { getUploadUrl } from './api'

const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function getMimeType(filePath: string): string {
  const lower = filePath.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  return 'image/jpeg'
}

// H5: use fetch PUT with Blob
// #ifdef H5
async function putToOSS_H5(signedUrl: string, filePath: string, mimeType: string): Promise<void> {
  const fileRes = await fetch(filePath)
  const blob = await fileRes.blob()
  const res = await fetch(signedUrl, {
    method: 'PUT',
    body: blob,
    headers: { 'Content-Type': mimeType },
  })
  if (!res.ok) throw new Error(`OSS upload failed: ${res.status}`)
}
// #endif

// Mini-program: read as ArrayBuffer then PUT via uni.request
// #ifndef H5
function putToOSS_MP(signedUrl: string, filePath: string, mimeType: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const fs = uni.getFileSystemManager()
    fs.readFile({
      filePath,
      success: ({ data }) => {
        uni.request({
          url: signedUrl,
          method: 'PUT',
          data: data as ArrayBuffer,
          header: { 'Content-Type': mimeType },
          success: (res) => {
            if (res.statusCode === 200 || res.statusCode === 204) {
              resolve()
            } else {
              reject(new Error(`OSS upload failed: ${res.statusCode}`))
            }
          },
          fail: (err) => reject(new Error(err.errMsg || 'Upload failed')),
        })
      },
      fail: (err) => reject(new Error(err.errMsg || 'Read file failed')),
    })
  })
}
// #endif

export async function uploadImage(
  tempFilePath: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const mimeType = getMimeType(tempFilePath)
  const ext = EXT_MAP[mimeType] || 'jpg'

  onProgress?.(10)

  const { signedUrl, publicUrl } = await getUploadUrl(mimeType, 0, ext)

  onProgress?.(40)

  // #ifdef H5
  await putToOSS_H5(signedUrl, tempFilePath, mimeType)
  // #endif

  // #ifndef H5
  await putToOSS_MP(signedUrl, tempFilePath, mimeType)
  // #endif

  onProgress?.(100)

  return publicUrl
}
