import { useEffect, useState } from 'react'

// Impostazioni dal vivo (/api/settings, cambiate da /admin): avviso in home, iscrizioni, ora del pranzo.
// Si rileggono ogni minuto finché la pagina è aperta. Senza rete: valori di src/data/events.js.
let cache = null
const listeners = new Set()

async function load() {
  try {
    const r = await fetch('/api/settings', { cache: 'no-store' })
    if (!r.ok) return
    cache = await r.json()
    cache.offset = (cache.now ?? Date.now()) - Date.now()
    listeners.forEach((fn) => fn(cache))
  } catch {
    /* niente rete: restano i valori di prima */
  }
}

let timer = 0
export function useLiveSettings() {
  const [s, setS] = useState(cache)
  useEffect(() => {
    listeners.add(setS)
    if (!timer) {
      load()
      timer = setInterval(() => !document.hidden && load(), 60000)
    }
    return () => listeners.delete(setS)
  }, [])
  return s
}
