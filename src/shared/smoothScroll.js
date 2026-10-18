// Scroll morbido per tutto il sito.
// - Lo scorrimento col dito, il trackpad e la rotella restano quelli nativi (i più fluidi e affidabili).
// - Telefono e computer: i salti dentro la pagina (barra in basso, "Salta", le due proposte, i link #sezione)
//   diventano una scivolata con accelerazione e frenata, uguale su iPhone, Android e computer.
// Con "riduci movimento" tutto è istantaneo.

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const maxY = () => document.documentElement.scrollHeight - innerHeight
const clamp = (v) => Math.max(0, Math.min(maxY(), v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

let jumpFrame = 0

function stopJump() {
  if (jumpFrame) {
    document.documentElement.classList.remove('is-jumping')
    dispatchEvent(new Event('scroll'))
  }
  cancelAnimationFrame(jumpFrame)
  jumpFrame = 0
}

// scivolata verso una posizione; si interrompe se chi legge tocca o usa la rotella
export function scrollToY(y, { onDone } = {}) {
  stopJump()
  const to = clamp(y)
  const from = scrollY
  const dist = to - from
  if (reduced() || Math.abs(dist) < 2) {
    scrollTo({ top: to, behavior: 'instant' })
    onDone?.()
    return
  }
  // salto lungo (es. da un'opzione all'altra del menu): la pagina scorre davvero, ma le animazioni legate
  // allo scroll (la ciotola) restano ferme durante il viaggio, così non si vedono andare a velocità folle
  const long = Math.abs(dist) > innerHeight * 1.5
  if (long) document.documentElement.classList.add('is-jumping')
  // più lontano = un po' più lungo, ma mai lento
  const dur = long ? Math.min(1500, 700 + Math.sqrt(Math.abs(dist)) * 8) : Math.min(1100, 420 + Math.sqrt(Math.abs(dist)) * 9)
  const t0 = performance.now()
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / dur)
    scrollTo({ top: from + dist * easeInOut(k), behavior: 'instant' })
    if (k < 1) jumpFrame = requestAnimationFrame(tick)
    else {
      jumpFrame = 0
      document.documentElement.classList.remove('is-jumping')
      dispatchEvent(new Event('scroll'))
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

export function initSmoothScroll() {
  if (typeof window === 'undefined' || window.__gmiSmooth) return
  window.__gmiSmooth = true
  // lo scorrimento lo guidiamo noi: il CSS "smooth" resta solo come ripiego senza JavaScript
  document.documentElement.classList.add('js-scroll')
  document.addEventListener('click', onClick)
  // un dito sullo schermo ferma subito una scivolata in corso
  addEventListener('touchstart', stopJump, { passive: true })
  addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) stopJump()
  })
}
