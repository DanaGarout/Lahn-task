<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { EventItem } from '@/types/event'
import { formatDate, formatTime } from '@/utils/formatters'
import StatusBadge from '@/components/common/StatusBadge.vue'

defineProps<{ event: EventItem }>()

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360"><rect width="600" height="360" fill="#ece9ff"/><text x="50%" y="50%" font-family="sans-serif" font-size="22" fill="#8a7bff" text-anchor="middle" dominant-baseline="middle">Eventify</text></svg>`,
  )
</script>

<template>
  <article
    class="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-soft animate-fade-in"
  >
    <div class="relative h-44 overflow-hidden">
      <img
        :src="event.image_url || FALLBACK_IMAGE"
        :alt="event.title"
        loading="lazy"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        @error="($event.target as HTMLImageElement).src = FALLBACK_IMAGE"
      />
      <div class="absolute left-3 top-3">
        <StatusBadge :status="event.status" />
      </div>
      <div v-if="event.is_featured" class="absolute right-3 top-3">
        <span class="badge bg-amber-400/95 text-amber-950 shadow-soft">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.62 1-5.8-4.21-4.1 5.82-.85L10 1.5Z" />
          </svg>
          Featured
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-5">
      <div class="flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <span>{{ formatDate(event.event_date) }} · {{ formatTime(event.start_time) }}</span>
      </div>

      <h3 class="text-lg font-bold leading-snug text-gray-900 dark:text-gray-50 line-clamp-2">
        {{ event.title }}
      </h3>

      <p class="line-clamp-2 flex-1 text-sm text-gray-500 dark:text-gray-400">
        {{ event.short_description }}
      </p>

      <div class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <span class="truncate">{{ event.location }}</span>
      </div>

      <RouterLink
        :to="{ name: 'event-details', params: { slug: event.slug } }"
        class="btn-primary mt-1 w-full justify-center"
      >
        View details
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </svg>
      </RouterLink>
    </div>
  </article>
</template>