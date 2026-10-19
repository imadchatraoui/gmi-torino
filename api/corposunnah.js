// Link da aprire una volta sola (gmitorino.org/corposunnah): il menu per Umaima di Corpo e Sunnah prima dell'evento.
//   GET  -> { used }                    il link è ancora valido?
//   POST -> { options } la prima volta, poi 410 { used: true }
// Si riattiva da gmitorino.org/admin (Collaborazione · Corpo e Sunnah).
import { POKES } from '../server/menu-data.js'
import { getMenu, redis, redisConfig, send } from '../server/store.js'

export const ONCE_KEY = 'gmi:corposunnah'

export default async function handler(req, res) {
  const cfg = redisConfig()
  if (!cfg) return send(res, 503, { error: 'storage not configured' })
  try {
    if (req.method === 'GET') return send(res, 200, { used: Boolean(await redis(cfg, ['GET', ONCE_KEY])) })
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST')
      return send(res, 405, { error: 'method not allowed' })
    }
    // SET ... NX: vince solo la prima richiesta, anche se ne arrivano due insieme
    const first = await redis(cfg, ['SET', ONCE_KEY, String(Date.now()), 'NX'])
    if (first !== 'OK') return send(res, 410, { used: true })
    return send(res, 200, { options: await getMenu(POKES) })
  } catch {
    return send(res, 502, { error: 'storage unreachable' })
  }
}
