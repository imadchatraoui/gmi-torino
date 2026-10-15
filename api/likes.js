// Like condivisi del menu (Vercel Function).
//   GET  /api/likes?ids=poke-1,poke-2   -> { counts: { "poke-1": 12, "poke-2": 7 } }
//   POST /api/likes  { id, delta: 1|-1 } -> { id, count }
// I numeri stanno in un hash Redis su Upstash (REST API, nessuna dipendenza).
// Chiavi: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN, oppure KV_REST_API_URL + KV_REST_API_TOKEN
// (i nomi che Vercel crea collegando Upstash dal Marketplace). Senza chiavi risponde 503
// e il sito usa il ripiego locale (src/shared/likes.js).

import { POKES } from '../src/data/menu.js'

const KEY = 'gmi:likes'
const ID = /^[a-z0-9-]{1,40}$/
// solo i poke del menu: nessuno può riempire il database con chiavi inventate
const ALLOWED = new Set(POKES.map((p) => p.id))
// al massimo 20 tocchi al minuto dallo stesso indirizzo
const LIMIT = 20

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  return url && token ? { url, token } : null
}

async function redis(cfg, command) {
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

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

function clientIp(req) {
  const fwd = req.headers?.['x-forwarded-for']
  return (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
}

async function tooMany(cfg, req) {
  const key = `gmi:rl:${clientIp(req)}:${Math.floor(Date.now() / 60000)}`
  const n = Number(await redis(cfg, ['INCR', key]))
  if (n === 1) await redis(cfg, ['EXPIRE', key, '70'])
  return n > LIMIT
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  let raw = ''
  for await (const chunk of req) raw += chunk
  try {
    return JSON.parse(raw || '{}')
  } catch {
    return {}
  }
}

export default async function handler(req, res) {
  const cfg = redisConfig()
  if (!cfg) return send(res, 503, { error: 'likes storage not configured' })

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://x')
      const ids = (url.searchParams.get('ids') || '').split(',').filter((id) => ALLOWED.has(id)).slice(0, 20)
      if (!ids.length) return send(res, 400, { error: 'ids required' })
      const values = await redis(cfg, ['HMGET', KEY, ...ids])
      const counts = Object.fromEntries(ids.map((id, i) => [id, Math.max(0, Number(values[i]) || 0)]))
      return send(res, 200, { counts })
    }

    if (req.method === 'POST') {
      const { id, delta } = await readBody(req)
      if (!ID.test(String(id)) || !ALLOWED.has(id) || (delta !== 1 && delta !== -1)) return send(res, 400, { error: 'bad request' })
      if (await tooMany(cfg, req)) return send(res, 429, { error: 'too many requests' })
      let count = Number(await redis(cfg, ['HINCRBY', KEY, id, String(delta)]))
      if (count < 0) {
        await redis(cfg, ['HSET', KEY, id, '0'])
        count = 0
      }
      return send(res, 200, { id, count })
    }

    res.setHeader('Allow', 'GET, POST')
    return send(res, 405, { error: 'method not allowed' })
  } catch {
    return send(res, 502, { error: 'likes storage unavailable' })
  }
}
