// Menu segreto (Vercel Function).
//   GET /api/menu            -> { revealed: false, revealAt, now }          prima dell'ora
//                            -> { revealed: true, revealAt, now, options }  dall'ora in poi
//   GET /api/menu?chiave=... -> menu subito, se la chiave è MENU_PREVIEW_KEY (per chi organizza)
// I piatti stanno in server/menu-data.js, fuori dal codice del sito: prima dell'ora non escono da qui.
// MENU_REVEAL (variabile d'ambiente su Vercel): "open" = sempre visibile, "closed" = sempre nascosto,
// non impostata = automatico, dall'ora `menu.revealAt` di src/data/events.js.
import { EVENTS } from '../src/data/events.js'
import { POKES } from '../server/menu-data.js'

const event = EVENTS.find((e) => e.menu?.revealAt)

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

export function isRevealed({ now = Date.now(), key = '' } = {}) {
  const mode = (process.env.MENU_REVEAL || 'auto').toLowerCase()
  const preview = process.env.MENU_PREVIEW_KEY
  if (preview && key && key === preview) return true
  if (mode === 'open') return true
  if (mode === 'closed') return false
  return now >= new Date(event?.menu?.revealAt ?? 0).getTime()
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return send(res, 405, { error: 'method not allowed' })
  }
  const url = new URL(req.url, 'http://x')
  const now = Date.now()
  const revealAt = event?.menu?.revealAt ?? null
  const revealed = isRevealed({ now, key: url.searchParams.get('chiave') || '' })
  return send(res, 200, revealed ? { revealed, revealAt, now, options: POKES } : { revealed, revealAt, now })
}
