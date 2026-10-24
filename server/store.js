// Impostazioni "dal vivo" del sito, salvate su Upstash Redis (lo stesso database dei like).
// Si cambiano da gmitorino.org/admin e valgono subito, senza toccare GitHub né rifare il deploy.
// Senza database (es. in sviluppo senza chiavi) valgono i valori di src/data/events.js.
import { createHash } from 'node:crypto'
import { EVENTS } from '../src/data/events.js'

const SETTINGS_KEY = 'gmi:settings'
export const event = EVENTS.find((e) => e.menu?.revealAt)

export const DEFAULTS = {
  menuMode: 'auto', // auto = svela all'ora revealAt; open = sempre visibile; closed = sempre nascosto
  revealAt: event?.menu?.revealAt ?? null,
  signup: 'auto', // auto = chiude alla data di events.js; open; closed
  notice: { on: false, it: '', en: '', tone: 'brand' }, // striscia in alto su tutte le pagine
  likesOn: true, // cuori dei mi piace nel menu
  staticMode: false, // sito statico d'emergenza (da /admin): telefoni che chiedono aggiornamenti ogni 60 s, niente like
  party: { at: 0, emoji: '🎉' }, // pioggia di emoji su tutti i telefoni aperti
  collab: { on: true, it: '', en: '' }, // sezione "ideato in collaborazione con" nel menu (testo vuoto = quello di events.js)
  event: {}, // testi dell'evento cambiati da /admin (data, orari, luogo, quota, iscrizioni)
}

const TONES = new Set(['brand', 'gold', 'sage', 'tape'])
const PARTY = new Set(['🎉', '❤️', '🥗', '🌙', '✨', '🤲'])

export function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  return url && token ? { url, token } : null
}

// risposta del database entro 4 s, altrimenti si va avanti con i valori di riserva (niente funzioni appese)
export async function redis(cfg, command) {
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(4000),
  })
  if (!res.ok) throw new Error(`upstash ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

// piccola cache in memoria: con molti telefoni insieme il database riceve al massimo una lettura ogni 3 s
let memo = { at: 0, value: null }

// ultimo momento in cui il database non ha risposto: per 60 s il sito passa da solo in modalità statica
let dbDownAt = 0

// Sito statico: niente like e telefoni che chiedono aggiornamenti ogni 60 s invece che ogni 5.
// Si accende da /admin, da solo se il database non risponde, oppure con SITE_STATIC=1 su Vercel (serve un redeploy).
export function staticState(settings) {
  if (process.env.SITE_STATIC === '1') return { on: true, why: 'env' }
  if (settings?.staticMode === true) return { on: true, why: 'admin' }
  if (Date.now() - dbDownAt < 60000) return { on: true, why: 'db' }
  return { on: false, why: '' }
}

export async function getSettings({ fresh = false } = {}) {
  if (!fresh && memo.value && Date.now() - memo.at < 3000) return memo.value
  const v = await readSettings()
  memo = { at: Date.now(), value: v }
  return v
}

async function readSettings() {
  const cfg = redisConfig()
  if (!cfg) return { ...DEFAULTS }
  // database appena andato giù: per 10 s non si riprova, si risponde subito con le ultime impostazioni
  if (Date.now() - dbDownAt < 10000) return memo.value || { ...DEFAULTS }
  try {
    const raw = await redis(cfg, ['GET', SETTINGS_KEY])
    const saved = raw ? JSON.parse(raw) : {}
    return { ...DEFAULTS, ...saved, notice: { ...DEFAULTS.notice, ...(saved.notice || {}) }, party: { ...DEFAULTS.party, ...(saved.party || {}) }, collab: { ...DEFAULTS.collab, ...(saved.collab || {}) } }
  } catch {
    // database irraggiungibile: restano le ultime impostazioni lette (non si torna ai valori di partenza)
    dbDownAt = Date.now()
    return memo.value || { ...DEFAULTS }
  }
}

const text = (v) => String(v ?? '').slice(0, 220)

// accetta solo campi noti e valori sensati
export async function saveSettings(patch) {
  const cfg = redisConfig()
  if (!cfg) throw new Error('storage not configured')
  const cur = await getSettings({ fresh: true })
  const next = { ...cur }
  if (['auto', 'open', 'closed'].includes(patch.menuMode)) next.menuMode = patch.menuMode
  if (patch.revealAt && !Number.isNaN(new Date(patch.revealAt).getTime())) next.revealAt = new Date(patch.revealAt).toISOString()
  if (['auto', 'open', 'closed'].includes(patch.signup)) next.signup = patch.signup
  if (patch.notice && typeof patch.notice === 'object') {
    next.notice = {
      on: !!patch.notice.on,
      it: text(patch.notice.it),
      en: text(patch.notice.en),
      tone: TONES.has(patch.notice.tone) ? patch.notice.tone : 'brand',
    }
  }
  if (typeof patch.likesOn === 'boolean') next.likesOn = patch.likesOn
  if (typeof patch.staticMode === 'boolean') next.staticMode = patch.staticMode
  if (patch.collab && typeof patch.collab === 'object') {
    next.collab = { on: patch.collab.on !== false, it: text(patch.collab.it), en: text(patch.collab.en) }
  }
  if (patch.party && PARTY.has(patch.party.emoji)) next.party = { at: Date.now(), emoji: patch.party.emoji }
  if (patch.event && typeof patch.event === 'object') {
    const e = patch.event
    const ev = {}
    for (const k of ['time', 'venue', 'city', 'price', 'dayMonth']) if (e[k]) ev[k] = text(e[k])
    if (e.signupUrl && /^https:\/\//.test(e.signupUrl)) ev.signupUrl = text(e.signupUrl)
    for (const k of ['date', 'signupNote']) if (e[k]?.it) ev[k] = { it: text(e[k].it), en: text(e[k].en) || text(e[k].it) }
    next.event = ev
  }
  next.updatedAt = new Date().toISOString()
  await redis(cfg, ['SET', SETTINGS_KEY, JSON.stringify(next)])
  memo = { at: Date.now(), value: next }
  return next
}

// il menu modificato da /admin (stessa forma di server/menu-data.js); senza modifiche vale il file
const MENU_KEY = 'gmi:menu'
const ARTS = new Set(['rice', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9'])
const pair = (v) => ({ it: text(v?.it), en: text(v?.en) || text(v?.it) })

// come per le impostazioni: al massimo una lettura ogni 3 s; se il database non risponde resta l'ultimo menu letto
let menuMemo = { at: 0, value: null }

export async function getMenu(fallback, { fresh = false } = {}) {
  const cfg = redisConfig()
  if (!cfg) return fallback
  if (!fresh && menuMemo.value && Date.now() - menuMemo.at < 3000) return menuMemo.value
  if (Date.now() - dbDownAt < 10000) return menuMemo.value || fallback
  try {
    const raw = await redis(cfg, ['GET', MENU_KEY])
    const value = raw ? JSON.parse(raw) : fallback
    menuMemo = { at: Date.now(), value }
    return value
  } catch {
    dbDownAt = Date.now()
    return menuMemo.value || fallback
  }
}

// tiene gli id del file (servono ai mi piace), cambia nome, titolo e ingredienti
export async function saveMenu(options, fallback) {
  const cfg = redisConfig()
  if (!cfg) throw new Error('storage not configured')
  const clean = fallback.map((base, i) => {
    const o = options?.[i] || {}
    const items = (Array.isArray(o.items) ? o.items : base.items)
      .slice(0, 5)
      .map((it) => ({ name: pair(it.name), art: ARTS.has(it.art) ? it.art : 'rice' }))
      .filter((it) => it.name.it)
    return { ...base, label: o.label?.it ? pair(o.label) : base.label, title: o.title ? pair(o.title) : base.title, items: items.length ? items : base.items }
  })
  await redis(cfg, ['SET', MENU_KEY, JSON.stringify(clean)])
  menuMemo = { at: Date.now(), value: clean }
  return clean
}

export async function resetMenu() {
  const cfg = redisConfig()
  if (cfg) await redis(cfg, ['DEL', MENU_KEY])
  menuMemo = { at: 0, value: null }
}

export function menuRevealed(settings, now = Date.now()) {
  if (settings.menuMode === 'open') return true
  if (settings.menuMode === 'closed') return false
  return now >= new Date(settings.revealAt ?? 0).getTime()
}

export function clientIp(req) {
  const fwd = req.headers?.['x-forwarded-for']
  return (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
}

export const sha256 = (s) => createHash('sha256').update(String(s)).digest('hex')

// cache: di norma no-store; per i dati uguali per tutti (impostazioni, menu) la CDN di Vercel
// tiene la risposta pochi secondi, così le richieste della sala non arrivano tutte alla funzione
export function send(res, status, body, cache = 'no-store') {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', cache)
  res.end(JSON.stringify(body))
}

export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  let raw = ''
  for await (const chunk of req) raw += chunk
  try {
    return JSON.parse(raw || '{}')
  } catch {
    return {}
  }
}
