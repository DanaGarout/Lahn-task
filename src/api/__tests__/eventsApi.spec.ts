// Unit tests for the Events API service layer (bonus test coverage item:
// "Events API service"). We mock apiClient itself so these tests verify
// *how* eventsApi talks to the client (correct URL, method, payload shape)
// without needing a real network call.
import { describe, expect, it, vi, beforeEach } from 'vitest'
import apiClient from '@/api/apiClient'
import { eventsApi } from '@/api/eventsApi'
import type { EventFormPayload } from '@/types/event'

vi.mock('@/api/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedApiClient = vi.mocked(apiClient, true)

describe('eventsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listPublic() calls GET /public/events with the given query params', async () => {
    mockedApiClient.get.mockResolvedValue({
      data: { items: [], pagination: { page: 1, limit: 6, totalItems: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } },
    })

    await eventsApi.listPublic({ page: 2, search: 'vue' })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/public/events', {
      params: { page: 2, search: 'vue' },
    })
  })

  it('listAdmin() calls GET /admin/events with the given query params, including status', async () => {
    mockedApiClient.get.mockResolvedValue({
      data: { items: [], pagination: { page: 1, limit: 6, totalItems: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } },
    })

    await eventsApi.listAdmin({ page: 1, status: 'published' })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/events', {
      params: { page: 1, status: 'published' },
    })
  })

  it('getPublicBySlug() calls GET /public/events/:slug', async () => {
    mockedApiClient.get.mockResolvedValue({ data: { id: 1, slug: 'vue-conf' } })

    await eventsApi.getPublicBySlug('vue-conf')

    expect(mockedApiClient.get).toHaveBeenCalledWith('/public/events/vue-conf')
  })

  it('getById() calls GET /admin/events/:id', async () => {
    mockedApiClient.get.mockResolvedValue({ data: { id: 1 } })

    await eventsApi.getById(1)

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/events/1')
  })

  it('create() posts a FormData body containing every field to /admin/events', async () => {
    mockedApiClient.post.mockResolvedValue({ data: { id: 99 } })

    const payload: EventFormPayload = {
      title: 'Vue Conf',
      short_description: 'short',
      description: 'full',
      event_date: '2026-08-01',
      start_time: '10:00',
      end_time: '12:00',
      location: 'Riyadh',
      status: 'draft',
      is_featured: true,
      image: null,
    }

    await eventsApi.create(payload)

    expect(mockedApiClient.post).toHaveBeenCalledTimes(1)
    const [url, body] = mockedApiClient.post.mock.calls[0]
    expect(url).toBe('/admin/events')
    expect(body).toBeInstanceOf(FormData)
    expect((body as FormData).get('title')).toBe('Vue Conf')
    expect((body as FormData).get('status')).toBe('draft')
    expect((body as FormData).get('is_featured')).toBe('true')
  })

  it('update() sends a PATCH request with a FormData body to /admin/events/:id', async () => {
    mockedApiClient.patch.mockResolvedValue({ data: { id: 5 } })

    const payload: EventFormPayload = {
      title: 'Updated title',
      short_description: 'short',
      description: 'full',
      event_date: '2026-08-01',
      start_time: '10:00',
      end_time: '',
      location: 'Riyadh',
      status: 'published',
      is_featured: false,
      image: null,
    }

    await eventsApi.update(5, payload)

    const [url, body] = mockedApiClient.patch.mock.calls[0]
    expect(url).toBe('/admin/events/5')
    expect(body).toBeInstanceOf(FormData)
    expect((body as FormData).get('title')).toBe('Updated title')
  })

  it('remove() calls DELETE /admin/events/:id', async () => {
    mockedApiClient.delete.mockResolvedValue({ data: undefined })

    await eventsApi.remove(42)

    expect(mockedApiClient.delete).toHaveBeenCalledWith('/admin/events/42')
  })
})