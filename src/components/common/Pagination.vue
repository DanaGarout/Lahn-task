<script setup lang="ts">
// Reusable pagination control (bonus feature). Purely presentational —
// the parent owns the current page and reacts to the `change` event.
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
  total: number
  pageSize: number
}>()

const emit = defineEmits<{ change: [page: number] }>()

const rangeStart = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1))
const rangeEnd = computed(() => Math.min(props.page * props.pageSize, props.total))

// Builds a compact page list like [1, '…', 4, 5, 6, '…', 12] for larger sets.
const pages = computed<(number | string)[]>(() => {
  const total = props.totalPages
  const current = props.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const items: (number | string)[] = [1]
  if (current > 3) items.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) {
    items.push(p)
  }
  if (current < total - 2) items.push('…')
  items.push(total)
  return items
})

function goTo(page: number | string) {
  if (typeof page !== 'number' || page === props.page) return
  emit('change', page)
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row"
    aria-label="Pagination"
  >
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Showing <span class="font-medium text-gray-700 dark:text-gray-200">{{ rangeStart }}–{{ rangeEnd }}</span>
      of <span class="font-medium text-gray-700 dark:text-gray-200">{{ total }}</span>
    </p>
    <ul class="flex items-center gap-1">
      <li>
        <button
          type="button"
          class="btn-ghost !px-3 !py-2"
          :disabled="page <= 1"
          aria-label="Previous page"
          @click="goTo(page - 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </li>
      <li v-for="(p, idx) in pages" :key="`${p}-${idx}`">
        <span v-if="p === '…'" class="px-2 text-gray-400 select-none">…</span>
        <button
          v-else
          type="button"
          class="min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition"
          :class="p === page
            ? 'bg-brand-600 text-white shadow-soft dark:bg-brand-500'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'"
          :aria-current="p === page ? 'page' : undefined"
          @click="goTo(p)"
        >
          {{ p }}
        </button>
      </li>
      <li>
        <button
          type="button"
          class="btn-ghost !px-3 !py-2"
          :disabled="page >= totalPages"
          aria-label="Next page"
          @click="goTo(page + 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>
