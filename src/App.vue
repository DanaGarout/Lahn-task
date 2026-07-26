<script setup lang="ts">
// Root component. Its only real job (besides <RouterView>) is listening for
// the app-wide "session expired" signal dispatched by apiClient.ts, so a
// 401 anywhere in the app cleanly logs the user out and bounces them to
// /login — without apiClient needing to import the store or router directly.
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SESSION_EXPIRED_EVENT } from '@/api/apiClient'
import { useAuthStore } from '@/stores/auth'
import { useNotify } from '@/composables/useNotify'
import ToastContainer from '@/components/common/ToastContainer.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const notify = useNotify()

function handleSessionExpired() {
  const wasAuthenticated = Boolean(auth.user)
  auth.forceLogoutFromExpiredSession()

  if (wasAuthenticated && route.meta.requiresAuth) {
    notify.error('Your session has expired. Please log in again.')
    router.push({ name: 'login', query: { redirect: route.fullPath } })
  }
}

onMounted(() => window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired))
onUnmounted(() => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired))
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>
