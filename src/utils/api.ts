import { API_BASE } from './config'
import type { Style, Prediction } from './types'

function request<T>(options: {
  url: string
  method?: 'GET' | 'POST'
  data?: Record<string, unknown>
}): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
        } else {
          const data = res.data as any
          reject(new Error(data?.error || `HTTP ${res.statusCode}`))
        }
      },
      fail: (err) => reject(new Error(err.errMsg || 'Network error')),
    })
  })
}

export type UploadUrlResponse = {
  signedUrl: string
  publicUrl: string
}

export function getUploadUrl(mimeType: string, size: number, ext: string): Promise<UploadUrlResponse> {
  return request<UploadUrlResponse>({
    url: '/api/upload-url',
    method: 'POST',
    data: { mimeType, size, ext },
  })
}

export type StylizeResponse = {
  predictionId?: string
  status: string
  output?: string | string[] | null
}

export function startStylize(imageUrl: string, style: Style): Promise<StylizeResponse> {
  return request<StylizeResponse>({
    url: '/api/stylize',
    method: 'POST',
    data: { imageUrl, style },
  })
}

export function pollPrediction(id: string): Promise<Prediction> {
  return request<Prediction>({
    url: `/api/predictions/${id}`,
    method: 'GET',
  })
}
