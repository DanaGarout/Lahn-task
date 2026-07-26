<script setup lang="ts">
// Public home page: Header (from PublicLayout) + Hero + events list + Footer.
import { onMounted } from 'vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import EventCard from '@/components/events/EventCard.vue'
import EventCardSkeleton from '@/components/events/EventCardSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import Pagination from '@/components/common/Pagination.vue'
import { useEventsStore } from '@/stores/events'

const eventsStore = useEventsStore()

function load() {
  eventsStore.fetchPublicEvents()
}

onMounted(load)

function handlePageChange(page: number) {
  eventsStore.setPage(page)
  load()
  document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <PublicLayout>
    <HeroSection :event-count="eventsStore.meta.totalItems" />

    <section id="events" class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div class="mb-8 flex items-end justify-between">
        <div>
          <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">Discover events</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Browse what's happening — click any event for full details.
          </p>
        </div>
      </div>

      <!-- Loading state: skeleton grid -->
      <div v-if="eventsStore.isListLoading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <EventCardSkeleton v-for="n in 6" :key="n" />
      </div>

      <!-- Error state -->
      <ErrorState v-else-if="eventsStore.isListError" :message="eventsStore.listError ?? undefined" @retry="load" />

      <!-- Empty state -->
      <EmptyState
        v-else-if="eventsStore.isListEmpty"
        title="No events available currently."
        message="There are no events published right now — please check back soon."
      />

      <!-- Success -->
      <template v-else>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <EventCard v-for="event in eventsStore.events" :key="event.id" :event="event" />
        </div>

        <Pagination
          class="mt-10"
          :page="eventsStore.meta.page"
          :total-pages="eventsStore.meta.totalPages"
          :total="eventsStore.meta.totalItems"
          :page-size="eventsStore.meta.limit"
          @change="handlePageChange"
        />
      </template>
    </section>
  </PublicLayout>
</template>