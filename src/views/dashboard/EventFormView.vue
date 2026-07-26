<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import { useNotify } from '@/composables/useNotify'
import type { EventFormPayload, EventStatus } from '@/types/event'
import type { NormalizedApiError } from '@/types/api'
import {
  validateDate,
  validateMaxLength,
  validateRequired,
  validateTime,
  validateTimeRange,
} from '@/utils/validators'
import ImageUploader from '@/components/common/ImageUploader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const notify = useNotify()

const eventId = computed(() => route.params.id as string | undefined)
const isEditMode = computed(() => Boolean(eventId.value))
const isPageLoading = ref(isEditMode.value)
const isSubmitting = ref(false)
const existingImageUrl = ref<string | null>(null)

const form = reactive<EventFormPayload>({
  title: '',
  short_description: '',
  description: '',
  event_date: '',
  start_time: '',
  end_time: '',
  location: '',
  status: 'draft',
  is_featured: false,
  image: null,
})

const clientErrors = reactive<Record<string, string>>({})
const serverErrors = reactive<Record<string, string>>({})
const hasAttemptedSubmit = ref(false)

const statusOptions: { value: EventStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

async function loadExistingEvent() {
  if (!eventId.value) return
  isPageLoading.value = true
  await eventsStore.fetchEventById(eventId.value)
  const existing = eventsStore.currentEvent
  if (existing) {
    form.title = existing.title
    form.short_description = existing.short_description
    form.description = existing.description
    form.event_date = existing.event_date
    form.start_time = existing.start_time
    form.end_time = existing.end_time ?? ''
    form.location = existing.location
    form.status = existing.status
    form.is_featured = existing.is_featured
    existingImageUrl.value = existing.image_url ?? null
  }
  isPageLoading.value = false
}

onMounted(loadExistingEvent)

function runClientValidation(): boolean {
  clientErrors.title = validateRequired(form.title, 'Event title') || validateMaxLength(form.title, 120, 'Event title')
  clientErrors.short_description =
    validateRequired(form.short_description, 'Short description') ||
    validateMaxLength(form.short_description, 160, 'Short description')
  clientErrors.description = validateRequired(form.description, 'Full description')
  clientErrors.event_date = validateDate(form.event_date)
  clientErrors.start_time = validateTime(form.start_time)
  clientErrors.end_time = form.end_time ? validateTimeRange(form.start_time, form.end_time) : ''
  clientErrors.location = validateRequired(form.location, 'Location')

  return Object.values(clientErrors).every((message) => !message)
}

function fieldError(field: string): string {
  return serverErrors[field] || (hasAttemptedSubmit.value ? clientErrors[field] : '') || ''
}

async function handleSubmit() {
  if (isSubmitting.value) return

  hasAttemptedSubmit.value = true
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key])

  if (!runClientValidation()) {
    notify.error('Please fix the highlighted fields.')
    return
  }

  isSubmitting.value = true
  try {
    if (isEditMode.value && eventId.value) {
      await eventsStore.updateEvent(eventId.value, form)
      notify.success('Event updated successfully.')
    } else {
      await eventsStore.createEvent(form)
      notify.success('Event created successfully.')
    }
    router.push({ name: 'dashboard-events' })
  } catch (err) {
    const apiError = err as NormalizedApiError
    if (apiError.fieldErrors) {
      Object.entries(apiError.fieldErrors).forEach(([field, messages]) => {
        serverErrors[field] = messages[0]
      })
      notify.error('The server rejected some fields — please review and try again.')
    } else {
      notify.error(apiError.message || 'Could not save this event. Please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <RouterLink :to="{ name: 'dashboard-events' }" class="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
      </svg>
      Back to events
    </RouterLink>

    <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">
      {{ isEditMode ? 'Edit event' : 'Add a new event' }}
    </h1>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ isEditMode ? 'Update the details below and save your changes.' : 'Fill in the details to publish a new event.' }}
    </p>

    <div v-if="isPageLoading" class="mt-10 flex justify-center py-16">
      <LoadingSpinner size="lg" label="Loading event" />
    </div>

    <form v-else class="card mt-6 space-y-6 p-6 sm:p-8" novalidate @submit.prevent="handleSubmit">
      <div>
        <label class="label" for="title">Event title</label>
        <input id="title" v-model="form.title" type="text" class="input" :class="{ 'input-error': fieldError('title') }" placeholder="Vue.js Riyadh Meetup #12" />
        <p v-if="fieldError('title')" class="mt-1.5 text-sm text-rose-600 dark:text-rose-400" role="alert">{{ fieldError('title') }}</p>
      </div>

      <div>
        <label class="label" for="short_description">Short description</label>
        <input
          id="short_description"
          v-model="form.short_description"
          type="text"
          maxlength="160"
          class="input"
          :class="{ 'input-error': fieldError('short_description') }"
          placeholder="A one-line teaser shown on the event card"
        />
        <p v-if="fieldError('short_description')" class="mt-1.5 text-sm text-rose-600 dark:text-rose-400" role="alert">
          {{ fieldError('short_description') }}
        </p>
      </div>

      <div>
        <label class="label" for="description">Full description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="5"
          class="input resize-y"
          :class="{ 'input-error': fieldError('description') }"
          placeholder="Everything attendees should know before joining"
        />
        <p v-if="fieldError('description')" class="mt-1.5 text-sm text-rose-600 dark:text-rose-400" role="alert">
          {{ fieldError('description') }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label class="label" for="event_date">Date</label>
          <input id="event_date" v-model="form.event_date" type="date" class="input" :class="{ 'input-error': fieldError('event_date') }" />
          <p v-if="fieldError('event_date')" class="mt-1.5 text-sm text-rose-600 dark:text-rose-400" role="alert">{{ fieldError('event_date') }}</p>
        </div>
        <div>
          <label class="label" for="start_time">Start time</label>
          <input id="start_time" v-model="form.start_time" type="time" class="input" :class="{ 'input-error': fieldError('start_time') }" />
          <p v-if="fieldError('start_time')" class="mt-1.5 text-sm text-rose-600 dark:text-rose-400" role="alert">{{ fieldError('start_time') }}</p>
        </div>
        <div>
          <label class="label" for="end_time">End time <span class="font-normal text-gray-400">(optional)</span></label>
          <input id="end_time" v-model="form.end_time" type="time" class="input" :class="{ 'input-error': fieldError('end_time') }" />
          <p v-if="fieldError('end_time')" class="mt-1.5 text-sm text-rose-600 dark:text-rose-400" role="alert">{{ fieldError('end_time') }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label class="label" for="location">Location</label>
          <input id="location" v-model="form.location" type="text" class="input" :class="{ 'input-error': fieldError('location') }" placeholder="Riyadh Tech Hub, Hall B" />
          <p v-if="fieldError('location')" class="mt-1.5 text-sm text-rose-600 dark:text-rose-400" role="alert">{{ fieldError('location') }}</p>
        </div>
        <div>
          <label class="label" for="status">Status</label>
          <select id="status" v-model="form.status" class="input">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </div>
      </div>

      <label class="flex cursor-pointer items-center gap-2.5 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 dark:border-white/10 dark:text-gray-200">
        <input v-model="form.is_featured" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
        Feature this event on the home page
      </label>

      <ImageUploader v-model="form.image" :existing-image-url="existingImageUrl" :disabled="isSubmitting" />

      <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-6 dark:border-white/10">
        <RouterLink :to="{ name: 'dashboard-events' }" class="btn-secondary">Cancel</RouterLink>
        <button type="submit" class="btn-primary min-w-[9rem] justify-center" :disabled="isSubmitting">
          <LoadingSpinner v-if="isSubmitting" size="sm" label="Saving" />
          {{ isSubmitting ? 'Saving…' : isEditMode ? 'Save changes' : 'Create event' }}
        </button>
      </div>
    </form>
  </div>
</template>