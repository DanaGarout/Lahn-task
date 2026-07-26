<script setup lang="ts">
// Layout wrapper for every /dashboard/* route (protected by the router guard
// in src/router/index.ts — this component only ever renders once the user
// is confirmed authenticated).
import { ref } from 'vue'
import SidebarNav from '@/components/dashboard/SidebarNav.vue'

const isSidebarOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-surface-dark">
    <SidebarNav :open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#161129] lg:hidden">
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
          aria-label="Open menu"
          @click="isSidebarOpen = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <span class="font-bold text-gray-900 dark:text-white">Dashboard</span>
      </header>

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
