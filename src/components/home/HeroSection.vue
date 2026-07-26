<script setup lang="ts">
// A simple, high-impact hero for the home page (spec: "Hero Section بسيطة").
defineProps<{ eventCount: number }>()
</script>

<template>
  <section class="relative overflow-hidden bg-hero-gradient">
    <!-- Decorative floating blobs — purely visual, aria-hidden -->
    <div class="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" aria-hidden="true" />
    <div class="pointer-events-none absolute -right-10 top-24 h-64 w-64 rounded-full bg-brand-400/20 blur-3xl" aria-hidden="true" />

    <div class="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
      <span class="animate-fade-in inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-inset ring-white/20">
        ✨ {{ eventCount > 0 ? `${eventCount}+ events live right now` : 'Fresh events, every week' }}
      </span>

      <h1 class="mx-auto mt-6 max-w-2xl animate-slide-up text-4xl font-extrabold leading-tight text-white sm:text-5xl">
        Find your next favorite
        <span class="bg-gradient-to-r from-fuchsia-300 to-brand-200 bg-clip-text text-transparent">experience</span>
      </h1>

      <p class="mx-auto mt-4 max-w-xl animate-slide-up text-base text-white/70 sm:text-lg">
        Discover meetups, workshops, and conferences happening near you — all in one clean, simple place.
      </p>

      <div class="mt-8 flex animate-slide-up items-center justify-center gap-3">
        <a href="#events" class="btn-primary !bg-white !text-brand-700 hover:!bg-brand-50">
          Browse events
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>
