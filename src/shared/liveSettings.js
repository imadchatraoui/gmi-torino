import { useEffect, useState } from 'react'

// Impostazioni dal vivo (/api/settings, cambiate da /admin): avviso in home, iscrizioni, ora del pranzo.
// Si rileggono ogni 5 secondi (solo con la pagina in vista) finché la pagina è aperta; con il sito statico
// (da /admin) ogni 60 secondi. Senza rete: valori di src/data/events.js.
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
      const next = () => {
        timer = setTimeout(async () => {
          if (!document.hidden) await load()
          next()
        }, cache?.static ? 60000 : 5000)
      }
      load()
      next()
    }
    return () => listeners.delete(setS)
  }, [])
  return s
}

// l'evento con i testi cambiati da /admin (data, orari, luogo, quota, iscrizioni)
export function useLiveEvent(ev) {
  const s = useLiveSettings()
  const e = s?.event
  if (!ev || !e || !Object.keys(e).length) return ev
  return {
    ...ev,
    ...(e.date && { date: e.date }),
    ...(e.time && { time: e.time }),
    ...(e.venue && { venue: e.venue }),
    ...(e.city && { city: e.city }),
    ...(e.price && { price: e.price }),
    ...(e.dayMonth && { dayMonth: e.dayMonth }),
    signup: ev.signup && {
      ...ev.signup,
      ...(e.signupUrl && { url: e.signupUrl }),
      ...(e.signupNote && { note: e.signupNote }),
    },
  }
}
