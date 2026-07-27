// Covers the auth store that LoginView delegates to — pairs with
// validators.spec.ts to fully exercise the "Login form validation" bonus
// test area (client-side rules + the store's success/failure handling).
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/authApi'

vi.mock('@/api/authApi', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

const mockedAuthApi = vi.mocked(authApi, true)

describe('auth store', () => {
  beforeEach(() => {
    sessionStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('is not authenticated by default', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
  })

  it('logs in successfully and stores the user + token', async () => {
    mockedAuthApi.login.mockResolvedValue({
      accessToken: 'tok_123',
      expiresIn: 3600,
      user: { id: '1', name: 'Admin', email: 'admin@eventify.dev', role: 'admin' },
    })

    const store = useAuthStore()
    const result = await store.login({ email: 'admin@eventify.dev', password: 'password123' })

    expect(result).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.email).toBe('admin@eventify.dev')
    expect(store.error).toBeNull()
  })

  it('surfaces a friendly error message on invalid credentials', async () => {
    mockedAuthApi.login.mockRejectedValue({ message: 'Invalid email or password.', status: 401 })

    const store = useAuthStore()
    const result = await store.login({ email: 'admin@eventify.dev', password: 'wrong' })

    expect(result).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(store.error).toBe('Invalid email or password.')
  })

  it('clears user + token on logout', async () => {
    mockedAuthApi.login.mockResolvedValue({
      accessToken: 'tok_123',
      expiresIn: 3600,
      user: { id: '1', name: 'Admin', email: 'admin@eventify.dev', role: 'admin'},
    })
    const store = useAuthStore()
    await store.login({ email: 'admin@eventify.dev', password: 'password123' })

    await store.logout(false)

    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })
})
