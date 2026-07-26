// mirrors the real API's event object field-for-field (snake_case and all)

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

export interface EventItem {
  id: number
  title: string
  slug: string // used for the public event page url
  short_description: string
  description: string
  event_date: string
  start_time: string
  end_time?: string | null
  location: string
  status: EventStatus
  is_featured: boolean
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface EventListResponse {
  items: EventItem[]
  pagination: PaginationMeta
}

export interface EventListParams {
  page?: number
  limit?: number
  search?: string
  status?: EventStatus | 'all' // admin only, public endpoint always returns published
  featured?: boolean
  date_from?: string
  date_to?: string
  sort_by?: 'event_date' | 'created_at' | 'title' | 'status'
  sort_order?: 'asc' | 'desc'
}

export interface EventFormPayload {
  title: string
  short_description: string
  description: string
  event_date: string
  start_time: string
  end_time: string
  location: string
  status: EventStatus
  is_featured: boolean
  image: File | null // null = no new image chosen
}