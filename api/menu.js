// Menu segreto (Vercel Function).
//   GET /api/menu            -> { revealed: false, revealAt, now }          prima dell'ora
//                            -> { revealed: true, revealAt, now, options }  dall'ora in poi
//   GET /api/menu?chiave=... -> menu subito, per chi organizza
// I piatti stanno in server/menu-data.js, fuori dal codice del sito.
// L'ora e lo stato (automatico / sempre visibile / nascosto) si cambiano da gmitorino.org/admin
// (server/store.js); MENU_REVEAL su Vercel ("open"/"closed") resta come interruttore d'emergenza.
import { POKES } from '../server/menu-data.js'
import { getMenu, getSettings, menuRevealed, send, sha256 } from '../server/store.js'

const PREVIEW_HASH = 'b133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return send(res, 405, { error: 'method not allowed' })
  }
  const url = new URL(req.url, 'http://x')
  const key = url.searchParams.get('chiave') || ''
  const now = Date.now()
  const settings = await getSettings()
  const env = (process.env.MENU_REVEAL || '').toLowerCase()
  const byKey = (key && sha256(key) === PREVIEW_HASH) || (process.env.MENU_PREVIEW_KEY && key === process.env.MENU_PREVIEW_KEY)
  const revealed = byKey || env === 'open' || (env !== 'closed' && menuRevealed(settings, now))
  const revealAt = settings.menuMode === 'closed' ? null : settings.revealAt
  return send(res, 200, revealed ? { revealed, revealAt, now, options: await getMenu(POKES) } : { revealed, revealAt, now })
}
