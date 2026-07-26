<script setup lang="ts">
// Public site header/navigation. Sticky, responsive, with a mobile menu
// and the dark-mode toggle (bonus).
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DarkModeToggle from '@/components/common/DarkModeToggle.vue'

const auth = useAuthStore()
const isMenuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-surface-dark/80">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
      <RouterLink to="/" class="flex items-center gap-2 text-lg font-extrabold text-gray-900 dark:text-white">
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white shadow-soft">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
        </span>
        Eventify
      </RouterLink>

      <nav class="hidden items-center gap-1 sm:flex" aria-label="Primary">
        <RouterLink
          to="/"
          class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
          active-class="!text-brand-600 dark:!text-brand-300"
        >
          Events
        </RouterLink>
        <RouterLink
          v-if="auth.isAuthenticated"
          to="/dashboard"
          class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          Dashboard
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <DarkModeToggle />
        <RouterLink v-if="!auth.isAuthenticated" to="/login" class="btn-primary !py-2 hidden sm:inline-flex">
          Admin login
        </RouterLink>
        <RouterLink v-else to="/dashboard" class="btn-secondary !py-2 hidden sm:inline-flex">
          {{ auth.user?.name ?? 'Dashboard' }}
        </RouterLink>

        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 sm:hidden"
          aria-label="Toggle navigation menu"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <Transition name="slide">
      <nav v-if="isMenuOpen" class="border-t border-gray-100 px-4 py-3 sm:hidden dark:border-white/10" aria-label="Mobile">
        <RouterLink to="/" class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10" @click="isMenuOpen = false">
          Events
        </RouterLink>
        <RouterLink
          :to="auth.isAuthenticated ? '/dashboard' : '/login'"
          class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
          @click="isMenuOpen = false"
        >
          {{ auth.isAuthenticated ? 'Dashboard' : 'Admin login' }}
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
