// Registra il service worker (public/sw.js) solo nel sito pubblicato, non in sviluppo.
export function registerOffline() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => navigator.serviceWorker.ready)
      .then((reg) => {
        const urls = [location.href.split('#')[0], ...performance.getEntriesByType('resource').map((e) => e.name)]
        reg.active?.postMessage({ type: 'cache-urls', urls })
      })
      .catch(() => {})
  })
}
