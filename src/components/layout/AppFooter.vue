<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-100 bg-white dark:border-white/10 dark:bg-surface-dark">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div class="flex items-center gap-2 text-base font-extrabold text-gray-900 dark:text-white">
          <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </span>
          Eventify
        </div>
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {{ year }} Eventify. Built as a full-stack developer technical task with Vue 3 &amp; Tailwind CSS.
        </p>
        <div class="flex items-center gap-4 text-gray-400">
          <span class="text-xs">Made with 💜 and Vue</span>
        </div>
      </div>
    </div>
  </footer>
</template>
