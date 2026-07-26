// public/admin split here mirrors the real API's own /public/events vs /admin/events

import apiClient from '@/api/apiClient'
import type { EventFormPayload, EventItem, EventListParams, EventListResponse, EventStatus } from '@/types/event'

// create/update always send multipart since the endpoints accept an optional image
function toFormData(payload: EventFormPayload): FormData {
  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('short_description', payload.short_description)
  formData.append('description', payload.description)
  formData.append('event_date', payload.event_date)
  formData.append('start_time', payload.start_time)
  formData.append('end_time', payload.end_time ?? '')
  formData.append('location', payload.location)
  formData.append('status', payload.status)
  formData.append('is_featured', String(payload.is_featured))
  if (payload.image) {
    formData.append('image', payload.image)
  }
  return formData
}

export const eventsApi = {
  // public site — always published events, looked up by slug
  async listPublic(params: EventListParams = {}): Promise<EventListResponse> {
    const { data } = await apiClient.get<EventListResponse>('/public/events', { params })
    return data
  },

  async getPublicBySlug(slug: string): Promise<EventItem> {
    const { data } = await apiClient.get<EventItem>(`/public/events/${slug}`)
    return data
  },

  // admin dashboard — any status, looked up by id
  async listAdmin(params: EventListParams = {}): Promise<EventListResponse> {
    const { data } = await apiClient.get<EventListResponse>('/admin/events', { params })
    return data
  },

  async getById(id: number | string): Promise<EventItem> {
    const { data } = await apiClient.get<EventItem>(`/admin/events/${id}`)
    return data
  },

  async create(payload: EventFormPayload): Promise<EventItem> {
    const { data } = await apiClient.post<EventItem>('/admin/events', toFormData(payload))
    return data
  },

  async update(id: number | string, payload: EventFormPayload): Promise<EventItem> {
    const { data } = await apiClient.patch<EventItem>(`/admin/events/${id}`, toFormData(payload))
    return data
  },

  async updateStatus(id: number | string, status: EventStatus): Promise<EventItem> {
    const { data } = await apiClient.patch<EventItem>(`/admin/events/${id}/status`, { status })
    return data
  },

  // API soft-deletes, so this isn't permanent — see restore() below
  async remove(id: number | string): Promise<void> {
    await apiClient.delete(`/admin/events/${id}`)
  },

  // not wired into the UI yet, but available since the API supports it
  async restore(id: number | string): Promise<EventItem> {
    const { data } = await apiClient.post<EventItem>(`/admin/events/${id}/restore`)
    return data
  },
}