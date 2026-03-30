export interface Studio {
  id: string
  user_id: string
  name: string
  description: string
  location: string
  city: string
  state: string
  studio_type: 'natural_light' | 'cyclorama' | 'product' | 'portrait' | 'video' | 'multi_use'
  hourly_rate: number
  min_hours: number
  max_capacity: number
  amenities: string[]
  is_verified: boolean
  is_active: boolean
  created_at: string
  deleted_at: string | null
}

export interface Booking {
  id: string
  user_id: string
  studio_id: string
  start_time: string
  end_time: string
  hours: number
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string
  created_at: string
  deleted_at: string | null
  studio?: Studio
}

export interface Profile {
  id: string
  user_id: string
  full_name: string
  bio: string
  is_host: boolean
  referral_code: string
  created_at: string
}

export type StudioType = Studio['studio_type']

export const STUDIO_TYPE_LABELS: Record<StudioType, string> = {
  natural_light: 'Natural Light',
  cyclorama: 'Cyclorama',
  product: 'Product',
  portrait: 'Portrait',
  video: 'Video',
  multi_use: 'Multi-Use'
}

export const AMENITY_OPTIONS = [
  'Backdrop stands',
  'Continuous lighting',
  'Strobe lighting',
  'Makeup station',
  'Dressing room',
  'WiFi',
  'Air conditioning',
  'Parking',
  'Loading dock',
  'Green room',
  'Kitchen access',
  'Prop storage'
]
