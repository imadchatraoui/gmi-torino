import { resolve } from 'node:path'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// Due pagine statiche (multi-page build):
//   /        -> index.html       (home "coming soon")
//   /menu/   -> menu/index.html  (menu poke interattivo)
// Funziona su qualsiasi hosting statico senza regole di rewrite.
// Preact (via preact/compat) al posto di React: stesso codice, ~60 KB gzip in meno.
export default defineConfig({
  plugins: [preact({ prerender: { enabled: false } })],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        menu: resolve(import.meta.dirname, 'menu/index.html'),
      },
    },
  },
})
