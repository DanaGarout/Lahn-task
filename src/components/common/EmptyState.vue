<script setup lang="ts">
// Generic "nothing here" state — reused for empty events lists, empty
// search results, etc. (bonus: distinct Empty State per the spec).
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'No events available right now',
    message: 'Please check back later — new events are added regularly.',
  },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center dark:border-white/10 dark:bg-white/[0.03]">
    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-white/5 dark:text-brand-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
      </svg>
    </div>
    <div>
      <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ title }}</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
    </div>
    <slot name="action" />
  </div>
</template>
