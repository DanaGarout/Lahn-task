<script setup lang="ts">
// Accessible confirmation modal — used for "Delete event" (bonus: delete
// with confirmation) so a stray click can never destroy data by accident.
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
    loading?: boolean
  }>(),
  {
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    danger: false,
    loading: false,
  },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const dialogRef = ref<HTMLElement | null>(null)

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('cancel')
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Move focus into the dialog for keyboard/screen-reader users.
      requestAnimationFrame(() => dialogRef.value?.focus())
    } else {
      document.body.style.overflow = ''
    }
  },
)

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm"
        @click.self="emit('cancel')"
      >
        <div
          ref="dialogRef"
          class="w-full max-w-sm animate-slide-up rounded-2xl bg-white p-6 shadow-2xl outline-none dark:bg-[#1b1730]"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="'confirm-dialog-title'"
          tabindex="-1"
        >
          <h2 id="confirm-dialog-title" class="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {{ title }}
          </h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>

          <div class="mt-6 flex justify-end gap-3">
            <button type="button" class="btn-secondary" :disabled="loading" @click="emit('cancel')">
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              :class="danger ? 'btn-danger' : 'btn-primary'"
              :disabled="loading"
              @click="emit('confirm')"
            >
              <span
                v-if="loading"
                class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white inline-block"
                aria-hidden="true"
              />
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
