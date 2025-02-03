/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string,
    NODE_ENV:string
    // Add more env variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }