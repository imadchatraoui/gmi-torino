import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Due pagine statiche (multi-page build):
//   /        -> index.html       (home "coming soon")
//   /menu/   -> menu/index.html  (menu poke interattivo)
// Funziona su qualsiasi hosting statico senza regole di rewrite.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        menu: resolve(import.meta.dirname, 'menu/index.html'),
      },
    },
  },
})
