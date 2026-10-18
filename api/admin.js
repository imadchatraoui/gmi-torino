// Pannello di gestione (gmitorino.org/admin). Ogni richiesta porta la password nell'intestazione
// x-admin-password. La password è ADMIN_PASSWORD su Vercel, se impostata; altrimenti quella scelta da Imad
// (nel codice c'è solo la sua impronta). Dopo 10 tentativi sbagliati lo stesso indirizzo aspetta 15 minuti.
//   GET  -> impostazioni + mi piace
//   POST { settings }            -> salva le impostazioni
//   POST { action: 'resetLikes' } -> azzera i mi piace
import { POKES } from '../server/menu-data.js'
import { clientIp, getSettings, readBody, redis, redisConfig, saveSettings, send, sha256 } from '../server/store.js'

const PASSWORD_HASH = 'a1dd395c19f3a1f7ff0e6bfe3ee6028e4373b41085a6da776ab02a8baf129abb'

async function counts(cfg) {
  const ids = POKES.map((p) => p.id)
  const values = await redis(cfg, ['HMGET', 'gmi:likes', ...ids])
  return Object.fromEntries(POKES.map((p, i) => [p.id, { title: p.title, label: p.label, count: Math.max(0, Number(values[i]) || 0) }]))
}

export default async function handler(req, res) {
  const cfg = redisConfig()
  if (!cfg) return send(res, 503, { error: 'Database non collegato: collega Upstash su Vercel.' })

  const fail = `gmi:adm:fail:${sha256(`adm:${clientIp(req)}`).slice(0, 20)}`
  const fails = Number((await redis(cfg, ['GET', fail])) || 0)
  if (fails >= 10) return send(res, 429, { error: 'Troppi tentativi. Riprova tra 15 minuti.' })

  const pass = String(req.headers['x-admin-password'] || '')
  const ok = process.env.ADMIN_PASSWORD ? pass === process.env.ADMIN_PASSWORD : sha256(pass) === PASSWORD_HASH
  if (!ok) {
    await redis(cfg, ['INCR', fail])
    await redis(cfg, ['EXPIRE', fail, '900'])
    return send(res, 401, { error: 'Password sbagliata.' })
  }

  try {
    if (req.method === 'POST') {
      const body = await readBody(req)
      if (body.action === 'resetLikes') await redis(cfg, ['DEL', 'gmi:likes'])
      else if (body.settings) await saveSettings(body.settings)
      else return send(res, 400, { error: 'Richiesta non valida.' })
    } else if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET, POST')
      return send(res, 405, { error: 'method not allowed' })
    }
    return send(res, 200, { settings: await getSettings(), likes: await counts(cfg), now: Date.now() })
  } catch {
    return send(res, 502, { error: 'Database non raggiungibile, riprova.' })
  }
}
