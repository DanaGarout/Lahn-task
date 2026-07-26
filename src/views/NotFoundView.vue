<script setup lang="ts">
import PublicLayout from '@/layouts/PublicLayout.vue'
</script>

<template>
  <PublicLayout>
    <div class="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p class="text-6xl font-black text-brand-500">404</p>
      <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page not found</h1>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <RouterLink to="/" class="btn-primary mt-6">Back to home</RouterLink>
    </div>
  </PublicLayout>
</template>
