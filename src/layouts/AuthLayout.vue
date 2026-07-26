<script setup lang="ts">
// Centered, focused layout used only by the login page.
import { RouterLink } from 'vue-router'
import DarkModeToggle from '@/components/common/DarkModeToggle.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-hero-gradient">
    <header class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <RouterLink to="/" class="flex items-center gap-2 text-lg font-extrabold text-white">
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        </span>
        Eventify
      </RouterLink>
      <div class="rounded-full bg-white/10">
        <DarkModeToggle />
      </div>
    </header>

    <main class="flex flex-1 items-center justify-center px-4 py-10">
      <slot />
    </main>
  </div>
</template>
