<script setup lang="ts">
// Simple animated spinner used for inline/button loading states.
// Larger "page-level" loading uses the Skeleton components instead (bonus).
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg'; label?: string }>(), {
  size: 'md',
  label: 'Loading',
})

const sizeClasses: Record<string, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}
</script>

<template>
  <span class="inline-flex items-center gap-2" role="status" :aria-label="label">
    <span
      class="animate-spin rounded-full border-brand-200 border-t-brand-600 dark:border-white/20 dark:border-t-brand-400"
      :class="sizeClasses[size]"
    />
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
