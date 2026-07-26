// wraps the three auth endpoints from the Swagger docs

import apiClient from '@/api/apiClient'
import type { AuthUser, LoginPayload, LoginResponse } from '@/types/auth'

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload)
    return data
  },

  // not called on every page load right now, but here if we need to verify a stored token
  async me(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>('/auth/me')
    return data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // api is stateless per the docs, so logout is best-effort —
      // local session gets cleared either way
    }
  },
}