// so components can just call notify.success('...') instead of touching
// the toast store directly

import { useToastStore } from '@/stores/toast'

export function useNotify() {
  const toastStore = useToastStore()

  return {
    success(message: string) {
      toastStore.push('success', message)
    },
    error(message: string) {
      toastStore.push('error', message, 5500)
    },
    info(message: string) {
      toastStore.push('info', message)
    },
  }
}