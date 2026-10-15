// Service worker di GMI Torino: il sito (soprattutto /menu/) resta consultabile anche senza rete,
// per esempio con il segnale scarso il giorno dell'evento.
//  - pagine: prima la rete (sempre aggiornate), se non c'è la copia salvata
//  - file con hash, font, immagini, video: copia salvata, aggiornata in background
//  - /api/ (like): mai salvata
const CACHE = 'gmi-torino-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/menu/'])).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

// la pagina manda l'elenco dei file che ha usato: così anche il primo caricamento finisce in cache
self.addEventListener('message', (event) => {
  if (event.data?.type !== 'cache-urls') return
  const urls = event.data.urls.filter((u) => new URL(u).origin === self.location.origin && !u.includes('/api/'))
  event.waitUntil(caches.open(CACHE).then((c) => Promise.all(urls.map((u) => c.add(u).catch(() => {})))))
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return
  // i video si leggono a pezzi (Range): li lascia al browser
  if (req.headers.has('range')) return

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(url.pathname, copy))
          }
          return res
        })
        .catch(() => caches.match(url.pathname).then((r) => r || caches.match('/menu/'))),
    )
    return
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const fresh = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || fresh
    }),
  )
})
