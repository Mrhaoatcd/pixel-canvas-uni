export type Style =
  | 'pixel'
  | 'oil'
  | 'surreal'
  | 'fauvism'
  | 'watercolor'
  | 'ukiyoe'
  | 'cyberpunk'
  | 'anime'
  | 'comic'
  | 'sketch'
  | 'lego'
  | 'claymation'
  | 'lowpoly'
  | 'vaporwave'
  | 'cubism'

export const ALL_STYLES: Style[] = [
  'pixel', 'oil', 'surreal', 'fauvism', 'watercolor',
  'ukiyoe', 'cyberpunk', 'anime', 'comic', 'sketch',
  'lego', 'claymation', 'lowpoly', 'vaporwave', 'cubism',
]

export function isStyle(value: string): value is Style {
  return (ALL_STYLES as string[]).includes(value)
}

export type PredictionStatus = 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'

export type Prediction = {
  id: string
  status: PredictionStatus
  output?: string | string[] | null
  error?: string | null
  logs?: string | null
}

export type JobPhase = 'idle' | 'uploading' | 'stylizing' | 'done' | 'error'
