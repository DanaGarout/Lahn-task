<script setup lang="ts">
// Generic error state with a Retry button (bonus: "Retry" is explicitly
// requested in the spec for the events list, and reused for event details too).
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'We could not connect to the server. Please try again.',
  },
)

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-rose-100 bg-rose-50/60 px-6 py-16 text-center dark:border-rose-500/20 dark:bg-rose-500/[0.06]"
    role="alert"
  >
    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
    </div>
    <div>
      <p class="text-lg font-semibold text-gray-800 dark:text-gray-100">Something went wrong</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
    </div>
    <button type="button" class="btn-primary" @click="emit('retry')">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      Retry
    </button>
  </div>
</template>
