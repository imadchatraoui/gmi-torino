import { useEffect, useState } from 'react'

// Preferenze del visitatore: tema (chiaro/scuro) e lingua (it/en).
// Lo script inline nell'<head> di ogni pagina applica entrambe prima del primo disegno;
// qui si leggono, si cambiano e si ricordano.

const KEY_THEME = 'gmi-theme'
const KEY_LANG = 'gmi-lang'
const listeners = new Set()

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* modalità privata: la scelta vale solo per questa visita */
  }
}

const systemDark = () => typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches

export function getTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function getLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'it'
}

function notify() {
  listeners.forEach((fn) => fn())
}

// colore della barra di Safari/Chrome = fondo della pagina (crema, bordeaux notte, o carta/blu notte nel menu)
function setThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]')
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
  if (meta && bg) meta.setAttribute('content', bg)
}

export function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = next
  setThemeColor()
  write(KEY_THEME, next)
  notify()
}

export function toggleLang() {
  const next = getLang() === 'it' ? 'en' : 'it'
  document.documentElement.lang = next
  write(KEY_LANG, next)
  notify()
}

// Senza una scelta salvata il tema segue il telefono, anche se cambia mentre la pagina è aperta.
if (typeof window !== 'undefined' && typeof matchMedia === 'function') {
  setThemeColor()
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
    if (read(KEY_THEME)) return
    document.documentElement.dataset.theme = systemDark() ? 'dark' : 'light'
    setThemeColor()
    notify()
  })
}

export function usePrefs() {
  const [, force] = useState(0)
  useEffect(() => {
    const fn = () => force((n) => n + 1)
    listeners.add(fn)
    return () => listeners.delete(fn)
  }, [])
  return { theme: getTheme(), lang: getLang() }
}

// Testo nella lingua corrente: t({ it: '...', en: '...' }) oppure una stringa.
export function t(value, lang = getLang()) {
  if (value == null || typeof value === 'string') return value
  return value[lang] ?? value.it
}
