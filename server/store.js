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
  notice: { on: false, it: '', en: '' }, // avviso in cima alla home
}

export function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  return url && token ? { url, token } : null
}

export async function redis(cfg, command) {
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  })
  if (!res.ok) throw new Error(`upstash ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data.result
}

export async function getSettings() {
  const cfg = redisConfig()
  if (!cfg) return { ...DEFAULTS }
  try {
    const raw = await redis(cfg, ['GET', SETTINGS_KEY])
    const saved = raw ? JSON.parse(raw) : {}
    return { ...DEFAULTS, ...saved, notice: { ...DEFAULTS.notice, ...(saved.notice || {}) } }
  } catch {
    return { ...DEFAULTS }
  }
}

const text = (v) => String(v ?? '').slice(0, 220)

// accetta solo campi noti e valori sensati
export async function saveSettings(patch) {
  const cfg = redisConfig()
  if (!cfg) throw new Error('storage not configured')
  const cur = await getSettings()
  const next = { ...cur }
  if (['auto', 'open', 'closed'].includes(patch.menuMode)) next.menuMode = patch.menuMode
  if (patch.revealAt && !Number.isNaN(new Date(patch.revealAt).getTime())) next.revealAt = new Date(patch.revealAt).toISOString()
  if (['auto', 'open', 'closed'].includes(patch.signup)) next.signup = patch.signup
  if (patch.notice && typeof patch.notice === 'object') {
    next.notice = { on: !!patch.notice.on, it: text(patch.notice.it), en: text(patch.notice.en) }
  }
  next.updatedAt = new Date().toISOString()
  await redis(cfg, ['SET', SETTINGS_KEY, JSON.stringify(next)])
  return next
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

export function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
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
