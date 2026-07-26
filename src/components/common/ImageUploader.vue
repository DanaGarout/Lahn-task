<script setup lang="ts">
// Drag-and-drop / click-to-browse image uploader with a live preview
// (bonus: Image preview) and client-side type/size validation before the
// file is ever attached to the form submission (spec: "التحقق من نوع
// وحجم الملف" + "منع إرسال صورة أكثر من مرة بسبب الضغط المتكرر").
import { computed, ref, watch } from 'vue'
import { validateImageFile } from '@/utils/validators'
import { formatFileSize } from '@/utils/formatters'

const props = withDefaults(
  defineProps<{
    modelValue: File | null
    /** Existing image URL to show when editing an event and no new file has been picked yet. */
    existingImageUrl?: string | null
    disabled?: boolean
  }>(),
  { existingImageUrl: null, disabled: false },
)

const emit = defineEmits<{ 'update:modelValue': [file: File | null] }>()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const error = ref('')
const previewUrl = ref<string | null>(null)

const displayUrl = computed(() => previewUrl.value ?? props.existingImageUrl ?? null)

function revokePreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}

function handleFile(file: File | undefined | null) {
  error.value = ''
  if (!file) return

  const validationMessage = validateImageFile(file)
  if (validationMessage) {
    error.value = validationMessage
    emit('update:modelValue', null)
    return
  }

  revokePreview()
  previewUrl.value = URL.createObjectURL(file)
  emit('update:modelValue', file)
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  handleFile(target.files?.[0])
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  if (props.disabled) return
  handleFile(event.dataTransfer?.files?.[0])
}

function clearImage() {
  revokePreview()
  error.value = ''
  emit('update:modelValue', null)
  if (inputRef.value) inputRef.value.value = ''
}

watch(
  () => props.modelValue,
  (file) => {
    if (!file) revokePreview()
  },
)
</script>

<template>
  <div>
    <label class="label" for="event-image-input">Event image</label>

    <div
      class="relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition"
      :class="[
        isDragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-gray-200 dark:border-white/10',
        disabled ? 'opacity-60' : 'cursor-pointer hover:border-brand-400',
      ]"
      @dragover.prevent="!disabled && (isDragging = true)"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="!disabled && inputRef?.click()"
    >
      <template v-if="displayUrl">
        <img
          :src="displayUrl"
          alt="Event image preview"
          class="mx-auto h-40 w-full max-w-sm rounded-xl object-cover shadow-card"
        />
        <button
          type="button"
          class="btn-ghost mt-2 !py-1.5 text-rose-600 dark:text-rose-300"
          :disabled="disabled"
          @click.stop="clearImage"
        >
          Remove image
        </button>
      </template>
      <template v-else>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3.75 3.75 0 0 1 4.377 4.377 4.5 4.5 0 0 1-1.35 8.727H6.75Z" />
        </svg>
        <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
          Drag & drop an image, or <span class="text-brand-600 dark:text-brand-300">browse</span>
        </p>
        <p class="text-xs text-gray-400">JPG, PNG or WEBP — up to 5MB</p>
      </template>

      <input
        id="event-image-input"
        ref="inputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="sr-only"
        :disabled="disabled"
        @change="onInputChange"
      />
    </div>

    <p v-if="error" class="mt-1.5 text-sm text-rose-600 dark:text-rose-400" role="alert">{{ error }}</p>
    <p v-else-if="modelValue" class="mt-1.5 text-xs text-gray-400">
      {{ modelValue.name }} · {{ formatFileSize(modelValue.size) }}
    </p>
  </div>
</template>
