// Scroll morbido per tutto il sito.
// - Computer con rotella del mouse: ogni scatto della rotella diventa una scivolata breve (la pagina scorre
//   davvero, quindi le sezioni sticky e l'animazione del poke funzionano come sempre). Trackpad e telefono
//   restano nativi: il loro scorrimento con inerzia è già il più fluido possibile e imitarlo lo peggiorerebbe.
// - Telefono e computer: i salti dentro la pagina (barra in basso, "Salta", le due proposte, i link #sezione)
//   diventano una scivolata con accelerazione e frenata, uguale su iPhone, Android e computer.
// Con "riduci movimento" tutto è istantaneo.

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const maxY = () => document.documentElement.scrollHeight - innerHeight
const clamp = (v) => Math.max(0, Math.min(maxY(), v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

let jumpFrame = 0
let wheelFrame = 0

function stopJump() {
  cancelAnimationFrame(jumpFrame)
  jumpFrame = 0
}

// scivolata verso una posizione; si interrompe se chi legge tocca o usa la rotella
export function scrollToY(y, { onDone } = {}) {
  stopJump()
  cancelAnimationFrame(wheelFrame)
  wheelFrame = 0
  const to = clamp(y)
  const from = scrollY
  const dist = to - from
  if (reduced() || Math.abs(dist) < 2) {
    scrollTo({ top: to, behavior: 'instant' })
    onDone?.()
    return
  }
  // salto lungo (es. da un'opzione all'altra del menu): niente corsa attraverso tutte le animazioni,
  // la pagina sfuma, salta e riappare già al punto giusto
  if (Math.abs(dist) > innerHeight * 1.5) {
    const main = document.querySelector('main') || document.body
    main.style.transition = 'opacity 0.18s ease'
    main.style.opacity = '0'
    setTimeout(() => {
      scrollTo({ top: to, behavior: 'instant' })
      requestAnimationFrame(() => {
        main.style.transition = 'opacity 0.35s ease'
        main.style.opacity = ''
        setTimeout(() => {
          main.style.transition = ''
          onDone?.()
        }, 360)
      })
    }, 190)
    return
  }
  // più lontano = un po' più lungo, ma mai lento
  const dur = Math.min(1100, 420 + Math.sqrt(Math.abs(dist)) * 9)
  const t0 = performance.now()
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / dur)
    scrollTo({ top: from + dist * easeInOut(k), behavior: 'instant' })
    if (k < 1) jumpFrame = requestAnimationFrame(tick)
    else {
      jumpFrame = 0
      onDone?.()
    }
  }
  jumpFrame = requestAnimationFrame(tick)
}

const headerOffset = () => document.querySelector('.site-header')?.offsetHeight ?? 0

export function scrollToEl(el, opts) {
  if (!el) return
  scrollToY(el.getBoundingClientRect().top + scrollY - headerOffset(), opts)
}

// link interni (#sezione o /pagina-corrente#sezione): scivolata invece del salto
function onClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = e.target.closest?.('a[href*="#"]')
  if (!a || a.target === '_blank') return
  const url = new URL(a.href, location.href)
  if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash.length < 2) return
  const el = document.getElementById(decodeURIComponent(url.hash.slice(1)))
  if (!el) return
  e.preventDefault()
  history.replaceState(null, '', url.hash)
  scrollToEl(el, {
    onDone: () => {
      // per chi usa la tastiera o un lettore di schermo: il punto di lettura va dove si è saltati
      if (a.classList.contains('skip-link') || el.tabIndex >= 0 || el.matches('main')) {
        el.focus({ preventScroll: true })
      }
    },
  })
}

// rotella del mouse (scatti da 120) o rotella "a righe" di Firefox; i trackpad danno valori piccoli e irregolari
const isMouseWheel = (e) => e.deltaMode === 1 || (e.wheelDeltaY !== undefined && e.wheelDeltaY !== 0 && e.wheelDeltaY % 120 === 0)

function scrollableParent(el) {
  for (let n = el; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
    const s = getComputedStyle(n)
    if (/(auto|scroll)/.test(s.overflowY) && n.scrollHeight > n.clientHeight) return n
  }
  return null
}

let target = 0
function onWheel(e) {
  if (e.defaultPrevented || e.ctrlKey || reduced() || !isMouseWheel(e)) return
  if (document.documentElement.classList.contains('scroll-lock') || scrollableParent(e.target)) return
  e.preventDefault()
  stopJump()
  const lines = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1
  if (!wheelFrame) target = scrollY
  target = clamp(target + e.deltaY * lines)
  if (wheelFrame) return
  const tick = () => {
    const y = scrollY
    const step = (target - y) * 0.16
    if (Math.abs(target - y) < 0.6) {
      scrollTo({ top: target, behavior: 'instant' })
      wheelFrame = 0
      return
    }
    scrollTo({ top: y + step, behavior: 'instant' })
    wheelFrame = requestAnimationFrame(tick)
  }
  wheelFrame = requestAnimationFrame(tick)
}

export function initSmoothScroll() {
  if (typeof window === 'undefined' || window.__gmiSmooth) return
  window.__gmiSmooth = true
  // lo scorrimento lo guidiamo noi: il CSS "smooth" resta solo come ripiego senza JavaScript
  document.documentElement.classList.add('js-scroll')
  document.addEventListener('click', onClick)
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    addEventListener('wheel', onWheel, { passive: false })
  }
  // un dito sullo schermo ferma subito una scivolata in corso
  addEventListener('touchstart', stopJump, { passive: true })
  addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) stopJump()
  })
}
