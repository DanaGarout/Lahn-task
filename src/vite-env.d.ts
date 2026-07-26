/// <reference types="vite/client" />

// Strongly-type the custom env variables we rely on (see .env.example)
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
