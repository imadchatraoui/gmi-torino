import { useEffect, useState } from 'react'

// Like condivisi: numeri da /api/likes (Vercel + Upstash), "mi piace" di questo telefono in localStorage.
// Se l'API non c'è (sito statico senza chiavi, rete assente) si passa al ripiego locale:
// i numeri valgono solo su questo dispositivo, finché l'API non torna disponibile.

const LIKED_KEY = 'gmi-liked'
const LOCAL_COUNTS_KEY = 'gmi-likes-local'

const state = { counts: {}, liked: readJSON(LIKED_KEY, {}), mode: 'loading' }
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
      if (!r.ok) throw new Error(String(r.status))
      const data = await r.json()
      state.counts = { ...state.counts, [id]: data.count }
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

export function useLikes(ids) {
  const [, force] = useState(0)
  useEffect(() => {
    const fn = () => force((n) => n + 1)
    listeners.add(fn)
    loadLikes(ids)
    return () => listeners.delete(fn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return {
    mode: state.mode,
    count: (id) => state.counts[id] ?? 0,
    liked: (id) => !!state.liked[id],
  }
}
