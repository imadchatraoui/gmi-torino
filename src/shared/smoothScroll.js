// Scroll morbido per tutto il sito.
// - Lo scorrimento col dito, il trackpad e la rotella restano quelli nativi (i più fluidi e affidabili).
// - Telefono e computer: i salti dentro la pagina (barra in basso, "Salta", le due proposte, i link #sezione)
//   diventano una scivolata con accelerazione e frenata, uguale su iPhone, Android e computer.
// Con "riduci movimento" tutto è istantaneo.

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const maxY = () => document.documentElement.scrollHeight - innerHeight
const clamp = (v) => Math.max(0, Math.min(maxY(), v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

const easeInQuad = (t) => t * t
const easeOutCubic = (t) => 1 - (1 - t) ** 3

let jumpFrame = 0

function stopJump() {
  cancelAnimationFrame(jumpFrame)
  jumpFrame = 0
}

// un tratto di scivolata da `from` a `to`, poi `next`
function glide(from, to, dur, ease, next) {
  const t0 = performance.now()
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / dur)
    scrollTo({ top: from + (to - from) * ease(k), behavior: 'instant' })
    if (k < 1) jumpFrame = requestAnimationFrame(tick)
    else {
      jumpFrame = 0
      next()
    }
  }
  jumpFrame = requestAnimationFrame(tick)
}

// scivolata verso una posizione; si interrompe se chi legge tocca o usa la rotella
export function scrollToY(y, { onDone } = {}) {
  stopJump()
  const to = clamp(y)
  const from = scrollY
  const dist = to - from
  const done = () => onDone?.()
  if (reduced() || Math.abs(dist) < 2) {
    scrollTo({ top: to, behavior: 'instant' })
    done()
    return
  }
  const seg = innerHeight * 0.75
  if (Math.abs(dist) <= seg * 2.5) {
    // salto corto: una sola scivolata con accelerazione e frenata
    glide(from, to, Math.min(900, 380 + Math.sqrt(Math.abs(dist)) * 8), easeInOut, done)
    return
  }
  // salto lungo (es. da un'opzione all'altra del menu, "Torna su"): parte, prende velocità,
  // salta il tratto in mezzo mentre va forte (a quella velocità non si nota) e frena sull'arrivo.
  // Le velocità dei due tratti combaciano, così sembra uno scroll unico e veloce; la ciotola
  // si anima normalmente lungo l'ultimo tratto invece di comparire già pronta.
  const dir = Math.sign(dist)
  glide(from, from + dir * seg, 260, easeInQuad, () => {
    const start = to - dir * seg
    scrollTo({ top: start, behavior: 'instant' })
    glide(start, to, 390, easeOutCubic, done)
  })
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
