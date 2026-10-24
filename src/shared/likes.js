import { useEffect, useState } from 'react'

// Like condivisi: numeri da /api/likes (Vercel + Upstash), "mi piace" di questo telefono in localStorage.
// Se l'API non c'è (sito statico senza chiavi, rete assente) si passa al ripiego locale:
// i numeri valgono solo su questo dispositivo, finché l'API non torna disponibile.

const LIKED_KEY = 'gmi-liked'
const LOCAL_COUNTS_KEY = 'gmi-likes-local'

// t: ora del server dell'ultima risposta usata; wrote: ora del server dell'ultimo tocco di questo telefono per poke.
// Le risposte possono arrivare dalla cache della CDN (1 s): una più vecchia del proprio tocco non sovrascrive il numero.
const state = { counts: {}, liked: readJSON(LIKED_KEY, {}), mode: 'loading', t: 0, wrote: {} }
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* modalità privata: vale solo per questa visita */
  }
}

function useLocal(ids) {
  const local = readJSON(LOCAL_COUNTS_KEY, {})
  state.mode = 'local'
  ids.forEach((id) => {
    state.counts[id] = local[id] ?? (state.liked[id] ? 1 : 0)
  })
}

let loaded = null
export function loadLikes(ids) {
  if (loaded) return loaded
  loaded = fetch(`/api/likes?ids=${ids.join(',')}`, { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((data) => {
      state.mode = 'online'
      state.t = data.t || 0
      ids.forEach((id) => {
        state.counts[id] = data.counts?.[id] ?? 0
      })
    })
    .catch(() => useLocal(ids))
    .finally(emit)
  return loaded
}

export async function toggleLike(id, liked) {
  // aggiornamento immediato, poi conferma dal server
  state.liked = { ...state.liked, [id]: liked || undefined }
  writeJSON(LIKED_KEY, state.liked)
  state.counts = { ...state.counts, [id]: Math.max(0, (state.counts[id] ?? 0) + (liked ? 1 : -1)) }
  emit()

  if (state.mode === 'online') {
    try {
      const r = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delta: liked ? 1 : -1 }),
      })
      if (r.status === 429) {
        // troppi tocchi in poco tempo: si torna a com'era prima del tocco
        state.liked = { ...state.liked, [id]: liked ? undefined : true }
        writeJSON(LIKED_KEY, state.liked)
        state.counts = { ...state.counts, [id]: Math.max(0, (state.counts[id] ?? 0) + (liked ? -1 : 1)) }
        emit()
        return
      }
      if (!r.ok) throw new Error(String(r.status))
      const data = await r.json()
      state.counts = { ...state.counts, [id]: data.count }
      if (data.t) state.wrote = { ...state.wrote, [id]: data.t }
      emit()
      return
    } catch {
      state.mode = 'local'
    }
  }
  const local = readJSON(LOCAL_COUNTS_KEY, {})
  local[id] = state.counts[id]
  writeJSON(LOCAL_COUNTS_KEY, local)
}

// numeri quasi in tempo reale: ogni 10 secondi, solo con la pagina in vista e l'API attiva
let polling = 0
let pausedUntil = 0
function startPolling(ids) {
  if (polling) return
  polling = setInterval(async () => {
    if (document.hidden || state.mode !== 'online' || Date.now() < pausedUntil) return
    try {
      const r = await fetch(`/api/likes?ids=${ids.join(',')}`, { cache: 'no-store' })
      if (r.status === 503) {
        // cuori spenti (o sito statico) dal pannello: si richiede solo fra un minuto, nel caso tornino
        pausedUntil = Date.now() + 60000
        return
      }
      if (!r.ok) return
      const data = await r.json()
      // risposta più vecchia di una già usata (cache CDN): si ignora
      if (data.t && data.t < state.t) return
      if (data.t) state.t = data.t
      let changed = false
      ids.forEach((id) => {
        // numero calcolato prima del mio ultimo tocco su questo poke: vale già quello del mio tocco
        if (data.t && state.wrote[id] && data.t < state.wrote[id]) return
        const n = data.counts?.[id] ?? 0
        if (state.counts[id] !== n) {
          // qualcun altro ha messo "mi piace": il cuore fa un piccolo battito
          if (n > (state.counts[id] ?? 0)) state.bumps = { ...state.bumps, [id]: Date.now() }
          state.counts = { ...state.counts, [id]: n }
          changed = true
        }
      })
      if (changed) emit()
    } catch {
      /* rete assente: si riprova al giro dopo */
    }
  }, 10000)
}

export function useLikes(ids) {
  const [, force] = useState(0)
  useEffect(() => {
    const fn = () => force((n) => n + 1)
    listeners.add(fn)
    loadLikes(ids).then(() => startPolling(ids))
    return () => listeners.delete(fn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return {
    mode: state.mode,
    count: (id) => state.counts[id] ?? 0,
    liked: (id) => !!state.liked[id],
    bump: (id) => state.bumps?.[id] ?? 0,
  }
}
