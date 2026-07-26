import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite configuration
// - Resolves the "@" alias to /src so imports read cleanly across the app.
// - Dev server proxy is intentionally NOT used here: the API base URL is
//   fully configurable via VITE_API_BASE_URL (see .env.example) so the app
//   can point at the local mock server or the real backend without code changes.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
})
