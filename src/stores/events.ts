// shared between the public site (published only, by slug) and the admin
// dashboard (any status, by id) so both reuse the same loading/pagination logic

import { defineStore } from 'pinia'
import { eventsApi } from '@/api/eventsApi'
import type { EventFormPayload, EventItem, EventListParams, EventStatus, PaginationMeta } from '@/types/event'
import type { NormalizedApiError } from '@/types/api'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

interface EventsState {
  events: EventItem[]
  meta: PaginationMeta
  listStatus: FetchStatus
  listError: string | null

  currentEvent: EventItem | null
  detailStatus: FetchStatus
  detailError: string | null

  isMutating: boolean
  mutationError: string | null

  filters: {
    search: string
    status: EventStatus | 'all' // admin only, public listing ignores this
    page: number
    limit: number
  }
}

const DEFAULT_LIMIT = 6

export const useEventsStore = defineStore('events', {
  state: (): EventsState => ({
    events: [],
    meta: { page: 1, limit: DEFAULT_LIMIT, totalItems: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
    listStatus: 'idle',
    listError: null,

    currentEvent: null,
    detailStatus: 'idle',
    detailError: null,

    isMutating: false,
    mutationError: null,

    filters: {
      search: '',
      status: 'all',
      page: 1,
      limit: DEFAULT_LIMIT,
    },
  }),

  getters: {
    isListLoading: (state) => state.listStatus === 'loading',
    isListError: (state) => state.listStatus === 'error',
    isListEmpty: (state) => state.listStatus === 'success' && state.events.length === 0,
  },

  actions: {
    buildParams(overrideParams: Partial<EventListParams>): EventListParams {
      return {
        page: this.filters.page,
        limit: this.filters.limit,
        search: this.filters.search || undefined,
        ...overrideParams,
      }
    },

    // home page — always published events
    async fetchPublicEvents(overrideParams: Partial<EventListParams> = {}): Promise<void> {
      this.listStatus = 'loading'
      this.listError = null
      try {
        const response = await eventsApi.listPublic(this.buildParams(overrideParams))
        this.events = response.items
        this.meta = response.pagination
        this.listStatus = 'success'
      } catch (err) {
        const apiError = err as NormalizedApiError
        this.listStatus = 'error'
        this.listError = apiError.message
      }
    },

    // dashboard — includes the status filter
    async fetchAdminEvents(overrideParams: Partial<EventListParams> = {}): Promise<void> {
      this.listStatus = 'loading'
      this.listError = null
      try {
        const params = this.buildParams({
          status: this.filters.status === 'all' ? undefined : this.filters.status,
          ...overrideParams,
        })
        const response = await eventsApi.listAdmin(params)
        this.events = response.items
        this.meta = response.pagination
        this.listStatus = 'success'
      } catch (err) {
        const apiError = err as NormalizedApiError
        this.listStatus = 'error'
        this.listError = apiError.message
      }
    },

    // public event details page
    async fetchEventBySlug(slug: string): Promise<void> {
      this.detailStatus = 'loading'
      this.detailError = null
      this.currentEvent = null
      try {
        this.currentEvent = await eventsApi.getPublicBySlug(slug)
        this.detailStatus = 'success'
      } catch (err) {
        const apiError = err as NormalizedApiError
        this.detailStatus = 'error'
        this.detailError = apiError.message
      }
    },

    // prefills the edit form
    async fetchEventById(id: number | string): Promise<void> {
      this.detailStatus = 'loading'
      this.detailError = null
      this.currentEvent = null
      try {
        this.currentEvent = await eventsApi.getById(id)
        this.detailStatus = 'success'
      } catch (err) {
        const apiError = err as NormalizedApiError
        this.detailStatus = 'error'
        this.detailError = apiError.message
      }
    },

    async createEvent(payload: EventFormPayload): Promise<EventItem> {
      this.isMutating = true
      this.mutationError = null
      try {
        const created = await eventsApi.create(payload)
        return created
      } catch (err) {
        this.mutationError = (err as NormalizedApiError).message
        throw err
      } finally {
        this.isMutating = false
      }
    },

    async updateEvent(id: number | string, payload: EventFormPayload): Promise<EventItem> {
      this.isMutating = true
      this.mutationError = null
      try {
        const updated = await eventsApi.update(id, payload)
        return updated
      } catch (err) {
        this.mutationError = (err as NormalizedApiError).message
        throw err
      } finally {
        this.isMutating = false
      }
    },

    async deleteEvent(id: number | string): Promise<void> {
      this.isMutating = true
      this.mutationError = null
      try {
        await eventsApi.remove(id)
        // drop it locally so the table updates instantly instead of refetching
        this.events = this.events.filter((event) => event.id !== id)
      } catch (err) {
        this.mutationError = (err as NormalizedApiError).message
        throw err
      } finally {
        this.isMutating = false
      }
    },

    setSearch(value: string): void {
      this.filters.search = value
      this.filters.page = 1
    },

    setStatusFilter(value: EventStatus | 'all'): void {
      this.filters.status = value
      this.filters.page = 1
    },

    setPage(page: number): void {
      this.filters.page = page
    },

    resetFilters(): void {
      this.filters = { search: '', status: 'all', page: 1, limit: DEFAULT_LIMIT }
    },
  },
})