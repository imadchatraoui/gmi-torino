import { useEffect, useRef } from 'react'

// Parola che si trasforma nella successiva (inshallah → إن شاء الله → se Dio vuole → …).
// Due strati sovrapposti: uno si sfoca e sparisce mentre l'altro arriva a fuoco; durante il passaggio
// un filtro "soglia" li fonde in un'unica forma liquida (il morph), poi si spegne e il testo resta nitido.
// Solo filtro e opacità su una parola sola, una volta ogni pochi secondi: leggero anche su telefono.
const HOLD = 2600 // ms di pausa su ogni parola
const MORPH = 1100 // ms di trasformazione

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function show(el, word) {
  el.textContent = word.text
  el.lang = word.lang || ''
  el.dir = word.dir || 'ltr'
  el.className = `morph__word${word.ar ? ' morph__word--ar' : ''}`
}

export default function MorphWord({ words, className = '' }) {
  const boxRef = useRef(null)
  const aRef = useRef(null)
  const bRef = useRef(null)
  const key = words.map((w) => w.text).join('|')

  useEffect(() => {
    const box = boxRef.current
    const a = aRef.current
    const b = bRef.current
    let i = 0
    show(a, words[0])
    a.style.cssText = ''
    b.style.cssText = 'opacity:0'
    if (reducedMotion() || words.length < 2) return

    let raf = 0
    let last = performance.now()
    let t0 = last
    let morphing = false

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = now - last
      last = now
      // fuori schermo o con la scheda nascosta il tempo si ferma
      if (document.hidden || box.closest('.is-off')) {
        t0 += dt
        return
      }
      const e = now - t0
      if (!morphing) {
        if (e < HOLD) return
        morphing = true
        t0 = now
        show(b, words[(i + 1) % words.length])
        box.classList.add('is-morphing')
        return
      }
      const f = Math.min(1, e / MORPH)
      const g = 1 - f
      b.style.filter = `blur(${Math.min(8 / Math.max(f, 0.001) - 8, 100)}px)`
      b.style.opacity = String(f ** 0.4)
      a.style.filter = `blur(${Math.min(8 / Math.max(g, 0.001) - 8, 100)}px)`
      a.style.opacity = String(g ** 0.4)
      if (f >= 1) {
        i = (i + 1) % words.length
        show(a, words[i])
        a.style.cssText = ''
        b.style.cssText = 'opacity:0'
        box.classList.remove('is-morphing')
        morphing = false
        t0 = now
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return (
    <span ref={boxRef} className={`morph ${className}`} aria-hidden="true">
      <span ref={aRef} className="morph__word" />
      <span ref={bRef} className="morph__word" />
      <svg className="morph__defs" width="0" height="0" focusable="false">
        <defs>
          <filter id="morph-threshold">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140" />
          </filter>
        </defs>
      </svg>
    </span>
  )
}
