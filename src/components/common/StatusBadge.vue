<script setup lang="ts">
import { computed } from 'vue'
import type { EventStatus } from '@/types/event'
import { formatStatus } from '@/utils/formatters'

const props = defineProps<{ status: EventStatus }>()

const styles = computed<Record<EventStatus, string>>(() => ({
  draft: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  published: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200',
  completed: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300',
  cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
}))

const dotStyles = computed<Record<EventStatus, string>>(() => ({
  draft: 'bg-amber-500',
  published: 'bg-brand-500',
  completed: 'bg-gray-400',
  cancelled: 'bg-rose-500',
}))
</script>

<template>
  <span class="badge" :class="styles[props.status]">
    <span class="h-1.5 w-1.5 rounded-full" :class="dotStyles[props.status]" />
    {{ formatStatus(props.status) }}
  </span>
</template>