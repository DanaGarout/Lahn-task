<script setup lang="ts">
// Generic shimmering placeholder block (bonus: Skeleton loading).
// Composed into feature-specific skeletons like EventCardSkeleton.vue.
withDefaults(defineProps<{ rounded?: string }>(), { rounded: 'rounded-lg' })
</script>

<template>
  <div
    class="animate-shimmer bg-gray-200/80 bg-[length:1000px_100%] dark:bg-white/10"
    :class="rounded"
    style="background-image: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)"
    aria-hidden="true"
  />
</template>
