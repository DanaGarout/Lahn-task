// Tests for the navigation guard that protects /dashboard/* routes
// (bonus test coverage item: "Protected routes").
import { describe, expect, it, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import router from '@/router'
import { tokenStorage } from '@/utils/tokenStorage'

describe('router navigation guards', () => {
  beforeEach(() => {
    sessionStorage.clear()
    setActivePinia(createPinia())
  })

  it('redirects an unauthenticated user away from a protected dashboard route', async () => {
    await router.push('/')
    await router.push('/dashboard')
    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.redirect).toBe('/dashboard')
  })

  it('allows an authenticated user to reach a protected dashboard route', async () => {
    tokenStorage.setToken('fake-token', 3600)
    tokenStorage.setUser({ id: 1, name: 'Admin', email: 'admin@eventify.dev', role: 'admin' })

    await router.push('/')
    await router.push('/dashboard')
    expect(router.currentRoute.value.name).toBe('dashboard-events')
  })

  it('sends an already-authenticated user away from the login page', async () => {
    tokenStorage.setToken('fake-token', 3600)
    tokenStorage.setUser({ id: 1, name: 'Admin', email: 'admin@eventify.dev', role: 'admin' })

    await router.push('/')
    await router.push('/login')
    expect(router.currentRoute.value.name).toBe('dashboard-events')
  })

  it('treats an expired token the same as being logged out', async () => {
    // expiresIn of -10 seconds => already expired
    tokenStorage.setToken('fake-token', -10)
    tokenStorage.setUser({ id: 1, name: 'Admin', email: 'admin@eventify.dev', role: 'admin' })

    await router.push('/')
    await router.push('/dashboard')
    expect(router.currentRoute.value.name).toBe('login')
  })
})