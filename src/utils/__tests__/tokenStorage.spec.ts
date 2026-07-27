// Unit tests for the access-token storage helper (bonus test coverage item:
// "Expired token handling"). See tokenStorage.ts for the rationale behind
// storing the token in sessionStorage in the first place.
import { describe, expect, it, beforeEach } from 'vitest'
import { tokenStorage } from '@/utils/tokenStorage'

describe('tokenStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('has no token and reports expired when nothing has been stored', () => {
    expect(tokenStorage.getToken()).toBeNull()
    expect(tokenStorage.isExpired()).toBe(true)
  })

  it('stores and retrieves a token', () => {
    tokenStorage.setToken('abc123', 3600)
    expect(tokenStorage.getToken()).toBe('abc123')
  })

  it('is NOT expired immediately after being set with a 1-hour TTL', () => {
    tokenStorage.setToken('abc123', 3600)
    expect(tokenStorage.isExpired()).toBe(false)
  })

  it('IS expired when the TTL has already elapsed', () => {
    tokenStorage.setToken('abc123', -1) // expired one second ago
    expect(tokenStorage.isExpired()).toBe(true)
  })

  it('stores and retrieves the current user', () => {
    const user = { id: 'usr_1', name: 'Admin', email: 'admin@eventify.dev' }
    tokenStorage.setUser(user)
    expect(tokenStorage.getUser()).toEqual(user)
  })

  it('clear() wipes the token, expiry, and user together', () => {
    tokenStorage.setToken('abc123', 3600)
    tokenStorage.setUser({ id: 'usr_1', name: 'Admin', email: 'admin@eventify.dev' })

    tokenStorage.clear()

    expect(tokenStorage.getToken()).toBeNull()
    expect(tokenStorage.getUser()).toBeNull()
    expect(tokenStorage.isExpired()).toBe(true)
  })
})
