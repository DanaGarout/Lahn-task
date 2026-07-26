<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import { useNotify } from '@/composables/useNotify'
import type { EventItem, EventStatus } from '@/types/event'
import EventsTable from '@/components/dashboard/EventsTable.vue'
import SearchFilterBar from '@/components/dashboard/SearchFilterBar.vue'
import EventCardSkeleton from '@/components/events/EventCardSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import Pagination from '@/components/common/Pagination.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const eventsStore = useEventsStore()
const notify = useNotify()
const router = useRouter()

const eventPendingDeletion = ref<EventItem | null>(null)
const isDeleting = ref(false)

function load() {
  eventsStore.fetchAdminEvents()
}

onMounted(load)

function handleSearchChange(value: string) {
  eventsStore.setSearch(value)
  load()
}

function handleStatusChange(value: EventStatus | 'all') {
  eventsStore.setStatusFilter(value)
  load()
}

function handlePageChange(page: number) {
  eventsStore.setPage(page)
  load()
}

function goToEdit(event: EventItem) {
  router.push({ name: 'dashboard-event-edit', params: { id: event.id } })
}

function goToView(event: EventItem) {
  window.open(`/events/${event.slug}`, '_blank', 'noopener')
}

function requestDelete(event: EventItem) {
  eventPendingDeletion.value = event
}

async function confirmDelete() {
  if (!eventPendingDeletion.value) return
  isDeleting.value = true
  try {
    await eventsStore.deleteEvent(eventPendingDeletion.value.id)
    notify.success(`"${eventPendingDeletion.value.title}" was deleted.`)
    eventPendingDeletion.value = null
    if (eventsStore.events.length === 0 && eventsStore.filters.page > 1) {
      eventsStore.setPage(eventsStore.filters.page - 1)
      load()
    }
  } catch {
    notify.error(eventsStore.mutationError ?? 'Could not delete this event. Please try again.')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Manage events</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Create, edit, and remove events shown on the public site.</p>
      </div>
      <RouterLink :to="{ name: 'dashboard-event-create' }" class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add event
      </RouterLink>
    </div>

    <div class="card mb-6 p-4">
      <SearchFilterBar
        :search="eventsStore.filters.search"
        :status="eventsStore.filters.status"
        @update:search="handleSearchChange"
        @update:status="handleStatusChange"
      />
    </div>

    <div v-if="eventsStore.isListLoading" class="grid grid-cols-1 gap-4">
      <EventCardSkeleton v-for="n in 3" :key="n" />
    </div>

    <ErrorState v-else-if="eventsStore.isListError" :message="eventsStore.listError ?? undefined" @retry="load" />

    <EmptyState
      v-else-if="eventsStore.isListEmpty"
      title="No events match your filters"
      message="Try a different search term, or clear the status filter."
    >
      <template #action>
        <RouterLink :to="{ name: 'dashboard-event-create' }" class="btn-primary">Create your first event</RouterLink>
      </template>
    </EmptyState>

    <template v-else>
      <EventsTable :events="eventsStore.events" @edit="goToEdit" @delete="requestDelete" @view="goToView" />

      <Pagination
        class="mt-6"
        :page="eventsStore.meta.page"
        :total-pages="eventsStore.meta.totalPages"
        :total="eventsStore.meta.totalItems"
        :page-size="eventsStore.meta.limit"
        @change="handlePageChange"
      />
    </template>

    <ConfirmDialog
      :open="Boolean(eventPendingDeletion)"
      title="Delete this event?"
      :message="`This will remove &quot;${eventPendingDeletion?.title}&quot; from the public site. You can ask an admin to restore it later if needed.`"
      confirm-label="Delete"
      danger
      :loading="isDeleting"
      @confirm="confirmDelete"
      @cancel="eventPendingDeletion = null"
    />
  </div>
</template>