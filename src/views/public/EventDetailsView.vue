<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import PublicLayout from '@/layouts/PublicLayout.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useEventsStore } from '@/stores/events'
import { formatDate, formatTime } from '@/utils/formatters'

const props = defineProps<{ slug: string }>()
const route = useRoute()
const eventsStore = useEventsStore()

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="500" viewBox="0 0 1200 500"><rect width="1200" height="500" fill="#ece9ff"/><text x="50%" y="50%" font-family="sans-serif" font-size="32" fill="#8a7bff" text-anchor="middle" dominant-baseline="middle">Eventify</text></svg>`,
  )

const eventSlug = computed(() => props.slug ?? (route.params.slug as string))

function load() {
  eventsStore.fetchEventBySlug(eventSlug.value)
}

onMounted(load)
watch(eventSlug, load)
</script>

<template>
  <PublicLayout>
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <RouterLink to="/" class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to events
      </RouterLink>

      <div v-if="eventsStore.detailStatus === 'loading'" class="flex justify-center py-24">
        <LoadingSpinner size="lg" label="Loading event details" />
      </div>

      <ErrorState
        v-else-if="eventsStore.detailStatus === 'error'"
        :message="eventsStore.detailError ?? undefined"
        @retry="load"
      />

      <article v-else-if="eventsStore.currentEvent" class="animate-fade-in overflow-hidden rounded-3xl bg-white shadow-card dark:bg-white/[0.04]">
        <img
          :src="eventsStore.currentEvent.image_url || FALLBACK_IMAGE"
          :alt="eventsStore.currentEvent.title"
          class="h-64 w-full object-cover sm:h-80"
          @error="($event.target as HTMLImageElement).src = FALLBACK_IMAGE"
        />

        <div class="p-6 sm:p-10">
          <div class="mb-4 flex flex-wrap items-center gap-3">
            <StatusBadge :status="eventsStore.currentEvent.status" />
            <span
              v-if="eventsStore.currentEvent.is_featured"
              class="badge bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.62 1-5.8-4.21-4.1 5.82-.85L10 1.5Z" />
              </svg>
              Featured
            </span>
            <span class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              {{ formatDate(eventsStore.currentEvent.event_date) }}
            </span>
            <span class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="9" stroke-width="2" />
              </svg>
              {{ formatTime(eventsStore.currentEvent.start_time) }}
              <template v-if="eventsStore.currentEvent.end_time"> – {{ formatTime(eventsStore.currentEvent.end_time) }}</template>
            </span>
          </div>

          <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            {{ eventsStore.currentEvent.title }}
          </h1>

          <p class="mt-2 flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {{ eventsStore.currentEvent.location }}
          </p>

          <div class="prose prose-sm mt-6 max-w-none text-gray-600 dark:prose-invert dark:text-gray-300">
            <p class="whitespace-pre-line leading-relaxed">{{ eventsStore.currentEvent.description }}</p>
          </div>

          <RouterLink to="/" class="btn-secondary mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to all events
          </RouterLink>
        </div>
      </article>
    </div>
  </PublicLayout>
</template>