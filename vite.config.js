import { resolve } from 'node:path'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import likesHandler from './api/likes.js'
import { EVENTS } from './src/data/events.js'
import { eventIcs } from './src/data/ics.js'
import { eventJsonLd, robotsTxt, sitemapXml } from './src/data/seo.js'

// In locale (npm run dev / preview) /api/likes usa la stessa funzione di Vercel con un finto Redis
// in memoria: i like si condividono tra i dispositivi collegati al Mac finché il server resta acceso.
function devLikes() {
  const store = new Map()
  const fakeRedis = async (command) => {
    const [op, , ...args] = command
    if (op === 'HMGET') return args.map((id) => (store.has(id) ? String(store.get(id)) : null))
    if (op === 'HINCRBY') {
      store.set(args[0], (store.get(args[0]) ?? 0) + Number(args[1]))
      return store.get(args[0])
    }
    if (op === 'INCR') {
      const key = command[1]
      store.set(key, (store.get(key) ?? 0) + 1)
      return store.get(key)
    }
    if (op === 'EXPIRE') return 1
    if (op === 'HSET') {
      store.set(args[0], Number(args[1]))
      return 1
    }
    return null
  }
  const middleware = (req, res, next) => {
    if (!req.url.startsWith('/api/likes')) return next()
    const realFetch = globalThis.fetch
    process.env.UPSTASH_REDIS_REST_URL ||= 'http://dev.local/redis'
    process.env.UPSTASH_REDIS_REST_TOKEN ||= 'dev'
    globalThis.fetch = async (url, init) =>
      String(url).startsWith('http://dev.local/')
        ? new Response(JSON.stringify({ result: await fakeRedis(JSON.parse(init.body)) }))
        : realFetch(url, init)
    Promise.resolve(likesHandler(req, res)).finally(() => {
      globalThis.fetch = realFetch
    })
  }
  return {
    name: 'gmi-dev-likes',
    // registrato prima dei middleware di Vite, così /api/likes non viene servito come file JS
    configureServer: (server) => {
      server.middlewares.stack.unshift({ route: '', handle: middleware })
    },
    configurePreviewServer: (server) => {
      server.middlewares.stack.unshift({ route: '', handle: middleware })
    },
  }
}

// "Aggiungi al calendario": un file /eventi/<id>.ics per ogni evento, sempre allineato a src/data/events.js.
function eventCalendars() {
  const serve = (server) => {
    server.middlewares.use((req, res, next) => {
      const m = req.url.match(/^\/eventi\/([a-z0-9-]+)\.ics$/)
      const ev = m && EVENTS.find((e) => e.id === m[1])
      if (!ev) return next()
      res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
      res.end(eventIcs(ev))
    })
  }
  return {
    name: 'gmi-event-calendars',
    configureServer: serve,
    configurePreviewServer: serve,
    generateBundle() {
      for (const ev of EVENTS) {
        if (ev.start && ev.end) this.emitFile({ type: 'asset', fileName: `eventi/${ev.id}.ics`, source: eventIcs(ev) })
      }
    },
  }
}

// Motori di ricerca: eventi futuri come dati schema.org nella home, robots.txt e sitemap.xml nel build.
function searchData() {
  return {
    name: 'gmi-search-data',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (ctx.path !== '/index.html') return html
        const upcoming = EVENTS.filter((e) => e.end && new Date(e.end) > new Date())
        if (!upcoming.length) return html
        const json = JSON.stringify(upcoming.map(eventJsonLd)).replace(/</g, '\\u003c')
        return html.replace('</head>', `    <script type="application/ld+json">${json}</script>\n  </head>`)
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt() })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(['/', '/menu/', '/design/']) })
    },
  }
}

// Pagine statiche (multi-page build):
//   /           -> index.html           (home: Chi siamo, Eventi, Archivio, Contatti)
//   /menu/      -> menu/index.html      (menu poke interattivo del YMHS)
//   /design/    -> design/index.html    (guida all'identità visiva di GMI Torino)
//   404.html -> pagina di errore (servita in automatico dalla maggior parte degli hosting statici)
// Funziona su qualsiasi hosting statico senza regole di rewrite.
// Preact (via preact/compat) al posto di React: stesso codice, ~60 KB gzip in meno.
export default defineConfig({
  plugins: [preact({ prerender: { enabled: false } }), devLikes(), eventCalendars(), searchData()],
  // anteprima raggiungibile da fuori casa con un tunnel Cloudflare temporaneo (*.trycloudflare.com)
  preview: { allowedHosts: ['.trycloudflare.com'] },
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        menu: resolve(import.meta.dirname, 'menu/index.html'),
        design: resolve(import.meta.dirname, 'design/index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
})
