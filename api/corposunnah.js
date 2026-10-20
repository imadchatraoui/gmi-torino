// Link da aprire una volta sola (gmitorino.org/corposunnah): il menu per Oumaima di Corpo e Sunnah prima dell'evento.
//   GET  -> { used, left }              il link è ancora valido? quante aperture restano?
//   POST -> { options, left } per le prime OPENS aperture, poi 410 { used: true }
// Si riattiva da gmitorino.org/admin (Collaborazione · Corpo e Sunnah).
import { POKES } from '../server/menu-data.js'
import { getMenu, redis, redisConfig, send } from '../server/store.js'

export const ONCE_KEY = 'gmi:corposunnah'
export const OPENS = 3 // Imad, il responsabile, poi Oumaima

export default async function handler(req, res) {
  const cfg = redisConfig()
  if (!cfg) return send(res, 503, { error: 'storage not configured' })
  try {
    if (req.method === 'GET') {
      const n = Number(await redis(cfg, ['GET', ONCE_KEY])) || 0
      return send(res, 200, { used: n >= OPENS, left: Math.max(0, OPENS - n) })
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST')
      return send(res, 405, { error: 'method not allowed' })
    }
    // INCR è atomico: anche con due richieste insieme non si supera il numero di aperture
    const n = Number(await redis(cfg, ['INCR', ONCE_KEY]))
    if (n > OPENS) return send(res, 410, { used: true })
    return send(res, 200, { options: await getMenu(POKES), left: OPENS - n })
  } catch {
    return send(res, 502, { error: 'storage unreachable' })
  }
}
