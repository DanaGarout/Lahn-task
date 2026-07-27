// Component test for the create/edit event form (bonus test coverage item:
// "Create event form"). Heavy child components and cross-cutting concerns
// (router, toast notifications, the Pinia store) are mocked/stubbed so this
// test focuses purely on the form's own validation + submission behavior.
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import EventFormView from '@/views/dashboard/EventFormView.vue'

const pushMock = vi.fn()
const createEventMock = vi.fn().mockResolvedValue({ id: 99 })
const fetchEventByIdMock = vi.fn()
const notifySuccess = vi.fn()
const notifyError = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: {} }), // no :id => create mode
  useRouter: () => ({ push: pushMock }),
}))

vi.mock('@/stores/events', () => ({
  useEventsStore: () => ({
    createEvent: createEventMock,
    updateEvent: vi.fn(),
    fetchEventById: fetchEventByIdMock,
    currentEvent: null,
  }),
}))

vi.mock('@/composables/useNotify', () => ({
  useNotify: () => ({ success: notifySuccess, error: notifyError, info: vi.fn() }),
}))

function mountForm() {
  return mount(EventFormView, {
    global: {
      stubs: {
        RouterLink: true,
        ImageUploader: true,
        LoadingSpinner: true,
      },
    },
  })
}

describe('EventFormView (create mode)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows validation errors and does not call the store when required fields are empty', async () => {
    const wrapper = mountForm()
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(createEventMock).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Event title is required.')
  })

  it('submits successfully and navigates back to the events list when all required fields are valid', async () => {
    const wrapper = mountForm()
    await flushPromises()

    await wrapper.find('#title').setValue('Vue Conf 2026')
    await wrapper.find('#short_description').setValue('A great conference')
    await wrapper.find('#description').setValue('All the details attendees need to know.')
    await wrapper.find('#event_date').setValue('2026-09-01')
    await wrapper.find('#start_time').setValue('10:00')
    await wrapper.find('#location').setValue('Riyadh')

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(createEventMock).toHaveBeenCalledTimes(1)
    const submittedPayload = createEventMock.mock.calls[0][0]
    expect(submittedPayload).toMatchObject({
      title: 'Vue Conf 2026',
      short_description: 'A great conference',
      location: 'Riyadh',
      status: 'draft',
      is_featured: false,
    })
    expect(notifySuccess).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith({ name: 'dashboard-events' })
  })

  it('prevents a double submit while a save is already in flight', async () => {
    let resolveCreate: (value: unknown) => void = () => {}
    createEventMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveCreate = resolve
        }),
    )

    const wrapper = mountForm()
    await flushPromises()

    await wrapper.find('#title').setValue('Vue Conf 2026')
    await wrapper.find('#short_description').setValue('A great conference')
    await wrapper.find('#description').setValue('All the details attendees need to know.')
    await wrapper.find('#event_date').setValue('2026-09-01')
    await wrapper.find('#start_time').setValue('10:00')
    await wrapper.find('#location').setValue('Riyadh')

    // Fire two submits back-to-back before the first request resolves.
    await wrapper.find('form').trigger('submit')
    await wrapper.find('form').trigger('submit')

    expect(createEventMock).toHaveBeenCalledTimes(1)

    resolveCreate({ id: 99 })
    await flushPromises()
  })
})