import { useEffect, useState } from 'react'

// Menu segreto: i piatti arrivano da /api/menu (Vercel) solo dall'ora di pranzo,
// o prima con /menu/?chiave=... (chiave impostata da chi organizza). Vedi api/menu.js.
// Una volta svelato, il menu resta salvato sul telefono: si apre anche senza rete.

const CACHE_KEY = 'gmi-menu-svelato'

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY))
  } catch {
    return null
  }
}

function writeCache(options) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(options))
  } catch {
    /* modalità privata */
  }
}

// stato: { status: 'loading' | 'locked' | 'open' | 'error', options, revealAt, offset }
// offset = ora del server − ora del telefono, così il conto alla rovescia non dipende dall'orologio del telefono
export function useMenu(fallbackRevealAt) {
  const [state, setState] = useState({ status: 'loading', revealAt: fallbackRevealAt, offset: 0 })

  useEffect(() => {
    let timer = 0
    let alive = true
    const key = new URLSearchParams(location.search).get('chiave')

    const check = async () => {
      clearTimeout(timer)
      try {
        const r = await fetch(`/api/menu${key ? `?chiave=${encodeURIComponent(key)}` : ''}`, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        })
        if (!r.ok) throw new Error(String(r.status))
        const data = await r.json()
        if (!alive) return
        const offset = (data.now ?? Date.now()) - Date.now()
        const revealAt = 'revealAt' in data ? data.revealAt : fallbackRevealAt
        if (data.revealed && data.options) {
          writeCache(data.options)
          setState((prev) =>
            prev.status === 'open' && JSON.stringify(prev.options) === JSON.stringify(data.options)
              ? prev
              : { status: 'open', options: data.options, revealAt, offset },
          )
          // anche dopo lo svelamento: le correzioni fatte da /admin arrivano da sole (sito statico: ogni 60 s)
          timer = setTimeout(check, data.static ? 60 * 1000 : 15 * 1000)
          return
        }
        setState({ status: 'locked', revealAt, offset })
        // si ricontrolla un attimo dopo l'ora (e comunque ogni 10 minuti, se l'ora cambia sul server)
        // si ricontrolla all'ora prevista, e comunque ogni 20 secondi: l'ora può cambiare da /admin
        const wait = revealAt ? new Date(revealAt).getTime() - (Date.now() + offset) : Infinity
        timer = setTimeout(check, Math.min(Math.max(wait + 1500, 5000), data.static ? 60 * 1000 : 10 * 1000))
      } catch {
        if (!alive) return
        const cached = readCache()
        if (cached) setState({ status: 'open', options: cached, revealAt: fallbackRevealAt, offset: 0 })
        else setState({ status: 'error', revealAt: fallbackRevealAt, offset: 0 })
      }
    }

    check()
    const onVisible = () => document.visibilityState === 'visible' && check()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      alive = false
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
