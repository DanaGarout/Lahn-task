<script setup lang="ts">
import type { EventItem } from '@/types/event'
import { formatDate, formatDateTimeRange } from '@/utils/formatters'
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps<{ events: EventItem[] }>()
const emit = defineEmits<{ edit: [event: EventItem]; delete: [event: EventItem]; view: [event: EventItem] }>()

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="#ece9ff"/><text x="50%" y="50%" font-family="sans-serif" font-size="12" fill="#8a7bff" text-anchor="middle" dominant-baseline="middle">Eventify</text></svg>`,
  )
</script>

<template>
  <div>
    <!-- Table layout (md and up) -->
    <div class="hidden overflow-hidden rounded-2xl border border-gray-100 dark:border-white/10 md:block">
      <table class="min-w-full divide-y divide-gray-100 dark:divide-white/10">
        <thead class="bg-gray-50 dark:bg-white/5">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Event</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Date</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Location</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</th>
            <th scope="col" class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white dark:divide-white/10 dark:bg-transparent">
          <tr v-for="event in events" :key="event.id" class="transition hover:bg-gray-50 dark:hover:bg-white/[0.03]">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img
                  :src="event.image_url || FALLBACK_IMAGE"
                  :alt="event.title"
                  class="h-11 w-11 shrink-0 rounded-lg object-cover"
                  @error="($event.target as HTMLImageElement).src = FALLBACK_IMAGE"
                />
                <span class="flex max-w-[16rem] items-center gap-1.5 truncate font-medium text-gray-800 dark:text-gray-100">
                  {{ event.title }}
                  <svg
                    v-if="event.is_featured"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5 shrink-0 text-amber-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-label="Featured"
                  >
                    <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.62 1-5.8-4.21-4.1 5.82-.85L10 1.5Z" />
                  </svg>
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{{ formatDate(event.event_date) }}</td>
            <td class="px-4 py-3 max-w-[12rem] truncate text-sm text-gray-500 dark:text-gray-400">{{ event.location }}</td>
            <td class="px-4 py-3"><StatusBadge :status="event.status" /></td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-1.5">
                <button type="button" class="btn-ghost !px-2.5 !py-1.5" aria-label="View event" @click="emit('view', event)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
                <button type="button" class="btn-ghost !px-2.5 !py-1.5" aria-label="Edit event" @click="emit('edit', event)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="btn-ghost !px-2.5 !py-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  aria-label="Delete event"
                  @click="emit('delete', event)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9M19.228 5.79c.542.09.983.481 1.183.982m-1.183-.982L18.16 19.673A2.25 2.25 0 0 1 15.916 21H8.084a2.25 2.25 0 0 1-2.244-2.327L4.96 5.79m14.268 0a48.108 48.108 0 0 0-3.478-.397m-12 .397a48.11 48.11 0 0 1 3.478-.397m0 0V4.62c0-1.153.94-2.11 2.09-2.226a48.294 48.294 0 0 1 3.802 0c1.15.116 2.09 1.072 2.09 2.226v.982" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card layout (below md) -->
    <ul class="space-y-3 md:hidden">
      <li v-for="event in events" :key="event.id" class="card p-4">
        <div class="flex items-start gap-3">
          <img
            :src="event.image_url || FALLBACK_IMAGE"
            :alt="event.title"
            class="h-14 w-14 shrink-0 rounded-lg object-cover"
            @error="($event.target as HTMLImageElement).src = FALLBACK_IMAGE"
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <p class="truncate font-semibold text-gray-800 dark:text-gray-100">{{ event.title }}</p>
              <StatusBadge :status="event.status" />
            </div>
            <p class="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
              {{ formatDateTimeRange(event.event_date, event.start_time, event.end_time) }}
            </p>
            <p class="truncate text-sm text-gray-400">{{ event.location }}</p>
          </div>
        </div>
        <div class="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-white/10">
          <button type="button" class="btn-ghost !px-3 !py-1.5 text-sm" @click="emit('view', event)">View</button>
          <button type="button" class="btn-ghost !px-3 !py-1.5 text-sm" @click="emit('edit', event)">Edit</button>
          <button type="button" class="btn-ghost !px-3 !py-1.5 text-sm text-rose-500" @click="emit('delete', event)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>