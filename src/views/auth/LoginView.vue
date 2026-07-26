<script setup lang="ts">
// Admin login page. Covers every requirement in the spec:
// email/password fields, client-side validation, a loading state on submit,
// a friendly error message for bad credentials, and redirecting to the
// originally-requested page (or the dashboard) after a successful login.
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/auth'
import { useNotify } from '@/composables/useNotify'
import { validateEmail, validatePassword } from '@/utils/validators'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const notify = useNotify()

const form = reactive({ email: '', password: '' })
const fieldErrors = reactive({ email: '', password: '' })
const showPassword = ref(false)

function validate(): boolean {
  fieldErrors.email = validateEmail(form.email)
  fieldErrors.password = validatePassword(form.password)
  return !fieldErrors.email && !fieldErrors.password
}

async function handleSubmit() {
  auth.clearError()
  if (!validate()) return

  const success = await auth.login({ email: form.email, password: form.password })
  if (success) {
    notify.success(`Welcome back, ${auth.user?.name ?? 'admin'}!`)
    const redirectTo = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.push(redirectTo)
  }
}
</script>

<template>
  <AuthLayout>
    <div class="w-full max-w-md animate-slide-up rounded-3xl bg-white p-8 shadow-2xl dark:bg-[#181430] sm:p-10">
      <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">Admin sign in</h1>
      <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
        Log in to manage events from the dashboard.
      </p>

      <form class="mt-8 space-y-5" novalidate @submit.prevent="handleSubmit">
        <div>
          <label class="label" for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="input"
            :class="{ 'input-error': fieldErrors.email }"
            placeholder="you@company.com"
            :aria-invalid="Boolean(fieldErrors.email)"
            aria-describedby="email-error"
            @blur="fieldErrors.email = validateEmail(form.email)"
          />
          <p v-if="fieldErrors.email" id="email-error" class="mt-1.5 text-sm text-rose-600 dark:text-rose-400" role="alert">
            {{ fieldErrors.email }}
          </p>
        </div>

        <div>
          <label class="label" for="password">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              class="input pr-11"
              :class="{ 'input-error': fieldErrors.password }"
              placeholder="••••••••"
              :aria-invalid="Boolean(fieldErrors.password)"
              aria-describedby="password-error"
              @blur="fieldErrors.password = validatePassword(form.password)"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
          </div>
          <p v-if="fieldErrors.password" id="password-error" class="mt-1.5 text-sm text-rose-600 dark:text-rose-400" role="alert">
            {{ fieldErrors.password }}
          </p>
        </div>

        <p v-if="auth.error" class="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" role="alert">
          {{ auth.error }}
        </p>

        <button type="submit" class="btn-primary w-full justify-center" :disabled="auth.isLoading">
          <LoadingSpinner v-if="auth.isLoading" size="sm" label="Signing in" />
          {{ auth.isLoading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <p class="mt-6 rounded-xl bg-brand-50 px-4 py-3 text-center text-xs text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
        Demo credentials: <strong>admin&#64;eventify.dev</strong> / <strong>password123</strong>
      </p>
    </div>
  </AuthLayout>
</template>
