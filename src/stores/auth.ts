// single source of truth for "is someone logged in" — router guards,
// sidebar, header all read from here

import { defineStore } from 'pinia'
import { authApi } from '@/api/authApi'
import { tokenStorage } from '@/utils/tokenStorage'
import type { AuthUser, LoginPayload } from '@/types/auth'
import type { NormalizedApiError } from '@/types/api'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    // read from sessionStorage right away so a refresh doesn't flash "logged out"
    user: tokenStorage.getUser(),
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => {
      return Boolean(state.user) && Boolean(tokenStorage.getToken()) && !tokenStorage.isExpired()
    },
  },

  actions: {
    async login(payload: LoginPayload): Promise<boolean> {
      this.isLoading = true
      this.error = null
      try {
        const response = await authApi.login(payload)
        // expiresAt is an exact timestamp, more reliable than expiresIn seconds
        const expiresInSeconds = response.expiresAt
          ? Math.max(0, Math.round((new Date(response.expiresAt).getTime() - Date.now()) / 1000))
          : response.expiresIn
        tokenStorage.setToken(response.accessToken, expiresInSeconds)
        tokenStorage.setUser(response.user)
        this.user = response.user
        return true
      } catch (err) {
        const apiError = err as NormalizedApiError
        this.error = apiError.message || 'Invalid email or password.'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async logout(serverSide = true): Promise<void> {
      if (serverSide) {
        await authApi.logout()
      }
      tokenStorage.clear()
      this.user = null
      this.error = null
    },

    // called from App.vue's session-expired listener, no network call needed here
    forceLogoutFromExpiredSession(): void {
      tokenStorage.clear()
      this.user = null
    },

    clearError(): void {
      this.error = null
    },
  },
})