// built this myself instead of installing a toast library — small enough
// that it wasn't worth the extra dependency

import { defineStore } from 'pinia'

export type ToastVariant = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  variant: ToastVariant
  message: string
}

let nextId = 1

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[],
  }),

  actions: {
    push(variant: ToastVariant, message: string, durationMs = 4000): void {
      const id = nextId++
      this.toasts.push({ id, variant, message })
      window.setTimeout(() => this.dismiss(id), durationMs)
    },

    dismiss(id: number): void {
      this.toasts = this.toasts.filter((toast) => toast.id !== id)
    },
  },
})