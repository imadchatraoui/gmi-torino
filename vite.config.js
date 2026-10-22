import { resolve } from 'node:path'
import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import likesHandler from './api/likes.js'
import menuHandler from './api/menu.js'
import settingsHandler from './api/settings.js'
import adminHandler from './api/admin.js'
import corpoHandler from './api/corposunnah.js'
import { EVENTS } from './src/data/events.js'
import { eventIcs } from './src/data/ics.js'
import { eventJsonLd, organizationJsonLd, robotsTxt, sitemapXml } from './src/data/seo.js'

// In locale (npm run dev / preview) /api/menu e /api/likes girano come su Vercel; /api/likes usa la stessa funzione di Vercel con un finto Redis
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
    if (op === 'GET') return store.has(command[1]) ? String(store.get(command[1])) : null
    if (op === 'SET') {
      if (command.includes('NX') && store.has(command[1])) return null
      store.set(command[1], command[2])
      return 'OK'
    }
    if (op === 'DEL') {
      // gmi:likes è un hash: in memoria i campi stanno al primo livello
      if (command[1] === 'gmi:likes') for (const k of [...store.keys()]) if (k.startsWith('poke-')) store.delete(k)
      store.delete(command[1])
      return 1
    }
    if (op === 'HSET') {
      store.set(args[0], Number(args[1]))
      return 1
    }
    return null
  }
  const handlers = { '/api/likes': likesHandler, '/api/menu': menuHandler, '/api/settings': settingsHandler, '/api/admin': adminHandler, '/api/corposunnah': corpoHandler }
  const middleware = (req, res, next) => {
    const route = Object.keys(handlers).find((r) => req.url === r || req.url.startsWith(`${r}?`))
    if (!route) return next()
    // in locale la chiave d'anteprima è "prova" (/menu/?chiave=prova)
    process.env.MENU_PREVIEW_KEY ||= 'prova'
    const realFetch = globalThis.fetch
    process.env.UPSTASH_REDIS_REST_URL ||= 'http://dev.local/redis'
    process.env.UPSTASH_REDIS_REST_TOKEN ||= 'dev'
    globalThis.fetch = async (url, init) =>
      String(url).startsWith('http://dev.local/')
        ? new Response(JSON.stringify({ result: await fakeRedis(JSON.parse(init.body)) }))
        : realFetch(url, init)
    Promise.resolve(handlers[route](req, res)).finally(() => {
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
        const json = JSON.stringify([organizationJsonLd(), ...upcoming.map(eventJsonLd)]).replace(/</g, '\\u003c')
        return html.replace('</head>', `    <script type="application/ld+json">${json}</script>\n  </head>`)
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt() })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(['/', '/menu/', '/programma/', '/reading/', '/privacy/']) })
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
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        admin: resolve(import.meta.dirname, 'admin/index.html'),
        corposunnah: resolve(import.meta.dirname, 'corposunnah/index.html'),
        reading: resolve(import.meta.dirname, 'reading/index.html'),
        programma: resolve(import.meta.dirname, 'programma/index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
})
