// dark mode, saved in localStorage since it's just a preference, not a secret

import { defineStore } from 'pinia'

const THEME_KEY = 'eventify.theme'
type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: getInitialTheme() as Theme,
  }),

  getters: {
    isDark: (state) => state.theme === 'dark',
  },

  actions: {
    applyToDocument(): void {
      document.documentElement.classList.toggle('dark', this.theme === 'dark')
    },

    toggle(): void {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem(THEME_KEY, this.theme)
      this.applyToDocument()
    },

    init(): void {
      this.applyToDocument()
    },
  },
})