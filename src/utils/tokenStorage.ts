// storing the access token in sessionStorage instead of localStorage —
// survives a refresh but clears when the tab closes, and isn't shared
// across tabs. an HttpOnly cookie would be safer against XSS but that
// needs backend support we don't have here, so this is the middle ground.

import type { AuthUser } from '@/types/auth'

const ACCESS_TOKEN_KEY = 'eventify.accessToken'
const TOKEN_EXPIRES_AT_KEY = 'eventify.tokenExpiresAt'
const USER_KEY = 'eventify.user'

export const tokenStorage = {
  getToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
  },

  setToken(token: string, expiresInSeconds: number): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
    const expiresAt = Date.now() + expiresInSeconds * 1000
    sessionStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(expiresAt))
  },

  getExpiresAt(): number | null {
    const raw = sessionStorage.getItem(TOKEN_EXPIRES_AT_KEY)
    return raw ? Number(raw) : null
  },

  isExpired(): boolean {
    const expiresAt = tokenStorage.getExpiresAt()
    if (!expiresAt) return true
    return Date.now() >= expiresAt
  },

  getUser(): AuthUser | null {
    const raw = sessionStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  },

  setUser(user: AuthUser): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  // used on logout and whenever a session turns out to be expired/invalid
  clear(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_EXPIRES_AT_KEY)
    sessionStorage.removeItem(USER_KEY)
  },
}