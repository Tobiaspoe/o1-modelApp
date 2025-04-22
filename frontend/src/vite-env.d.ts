/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_SOME_OTHER_ENV?: string // Optional if you have more env vars
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
