<script setup lang="ts">
import { ref, watch } from 'vue'
import { debounce } from '@/utils/debounce'
import type { EventStatus } from '@/types/event'

const props = defineProps<{
  search: string
  status: EventStatus | 'all'
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: EventStatus | 'all']
}>()

const localSearch = ref(props.search)
const emitSearch = debounce((value: string) => emit('update:search', value), 350)

watch(localSearch, (value) => emitSearch(value))
watch(
  () => props.search,
  (value) => {
    if (value !== localSearch.value) localSearch.value = value
  },
)

const statusOptions: { value: EventStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
    <div class="relative flex-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        v-model="localSearch"
        type="search"
        class="input pl-10"
        placeholder="Search events by name…"
        aria-label="Search events by name"
      />
    </div>

    <select
      class="input sm:w-48"
      aria-label="Filter by status"
      :value="status"
      @change="emit('update:status', ($event.target as HTMLSelectElement).value as EventStatus | 'all')"
    >
      <option v-for="option in statusOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>