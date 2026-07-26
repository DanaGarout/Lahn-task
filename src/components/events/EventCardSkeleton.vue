<script setup lang="ts">
// Card-shaped skeleton shown while the events list is loading (bonus:
// Skeleton loading + explicit Loading State from the spec).
import Skeleton from '@/components/common/Skeleton.vue'
</script>

<template>
  <div class="card overflow-hidden" aria-hidden="true">
    <Skeleton rounded="rounded-none" class="h-44 w-full" />
    <div class="space-y-3 p-5">
      <Skeleton class="h-4 w-20" />
      <Skeleton class="h-5 w-3/4" />
      <Skeleton class="h-3.5 w-full" />
      <Skeleton class="h-3.5 w-2/3" />
      <div class="flex items-center justify-between pt-2">
        <Skeleton class="h-3.5 w-24" />
        <Skeleton class="h-9 w-24" rounded="rounded-xl" />
      </div>
    </div>
  </div>
</template>
