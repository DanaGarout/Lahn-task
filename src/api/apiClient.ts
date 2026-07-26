// the only file that's allowed to touch axios directly — every component
// and store goes through the *Api.ts wrappers, which go through this

import axios, { AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from '@/utils/tokenStorage'
import { getFriendlyStatusMessage, NETWORK_ERROR_MESSAGE } from '@/utils/errorMessages'
import type { NormalizedApiError, ValidationErrors } from '@/types/api'

// App.vue listens for this so this file never has to import the router
// or the auth store directly (that would be a circular import)
export const SESSION_EXPIRED_EVENT = 'eventify:session-expired'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getToken()

  if (token) {
    // catch an already-expired token before even hitting the network
    if (tokenStorage.isExpired()) {
      tokenStorage.clear()
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
      const expiredError: NormalizedApiError = {
        message: 'Your session has expired. Please log in again.',
        status: 401,
      }
      return Promise.reject(expiredError) as unknown as Promise<InternalAxiosRequestConfig>
    }
    config.headers.Authorization = `Bearer ${token}`
  }

  // let the browser set its own multipart boundary for file uploads
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    // backend wraps everything as { success, message, data } — unwrap it
    // here once so the rest of the app just deals with the real payload
    const body = response.data as { success?: boolean; data?: unknown } | undefined
    if (body && typeof body === 'object' && body.success !== undefined && 'data' in body) {
      return { ...response, data: body.data }
    }
    return response
  },
  (error: AxiosError<{ message?: string; errors?: ValidationErrors; code?: string }>) => {
    const normalized: NormalizedApiError = normalizeError(error)

    if (normalized.status === 401) {
      tokenStorage.clear()
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
    }

    return Promise.reject(normalized)
  },
)

function normalizeError(
  error: AxiosError<{ message?: string; errors?: ValidationErrors; code?: string }>,
): NormalizedApiError {
  // no response at all = offline / DNS / CORS / server down
  if (!error.response) {
    return {
      message: NETWORK_ERROR_MESSAGE,
      isNetworkError: true,
    }
  }

  const { status, data } = error.response

  // 422s carry per-field errors so the form can highlight the right inputs
  if (status === 422 && data?.errors) {
    return {
      message: data.message ?? getFriendlyStatusMessage(status),
      status,
      fieldErrors: data.errors,
    }
  }

  return {
    message: data?.message ?? getFriendlyStatusMessage(status),
    status,
  }
}

export default apiClient