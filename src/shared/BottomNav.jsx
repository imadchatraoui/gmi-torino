import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from '../data/site'
import { t, usePrefs } from './prefs'
import { scrollToEl, scrollToY } from './smoothScroll'

// Barra di navigazione flottante per il telefono: compare dopo l'hero,
// l'indicatore scivola sotto la sezione in vista.
export default function BottomNav({ items = SECTIONS, heroId = 'top', label = 'Sezioni' }) {
  usePrefs()
  const [active, setActive] = useState(null)
  const [shown, setShown] = useState(false)
  const nav = useRef(null)
  const pill = useRef(null)

  const lockUntil = useRef(0)

  useEffect(() => {
    // sezione attiva = l'ultima il cui titolo ha superato un terzo dello schermo;
    // in fondo alla pagina vale l'ultima (le sezioni corte non arrivano mai a metà schermo)
    let frame = 0
    const compute = () => {
      frame = 0
      if (performance.now() < lockUntil.current) return
      const line = window.innerHeight * 0.35
      let cur = null
      for (const s of items) {
        if (s.top) continue
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) cur = s.id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = items.filter((s) => !s.top).at(-1).id
      setActive(cur)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    const stop = () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
    const hero = document.getElementById(heroId)
    let io
    if (hero && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), { rootMargin: '-35% 0px 0px 0px' })
      io.observe(hero)
    } else {
      setShown(true)
    }
    return () => {
      stop()
      io?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = nav.current?.querySelector(`a[href="#${active}"]`)
    const p = pill.current
    if (!p) return
    if (!el) {
      p.style.opacity = '0'
      return
    }
    p.style.opacity = '1'
    p.style.width = `${el.offsetWidth}px`
    p.style.transform = `translate3d(${el.offsetLeft}px,0,0)`
  }, [active, shown])

  return (
    <nav ref={nav} className={`bottom-nav${shown ? ' is-shown' : ''}`} aria-label={label}>
      <span ref={pill} className="bottom-nav__pill" aria-hidden="true" />
      {items.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={active === s.id ? 'true' : undefined}
          onClick={(e) => {
            if (s.top) {
              e.preventDefault()
              scrollToY(0)
              history.replaceState(null, '', location.pathname + location.search)
              return
            }
            const el = document.getElementById(s.id)
            if (!el) return
            e.preventDefault()
            // il tocco vince subito: l'indicatore va sulla sezione scelta e resta lì durante lo scorrimento
            setActive(s.id)
            lockUntil.current = performance.now() + 1400
            scrollToEl(el, { onDone: () => (lockUntil.current = performance.now() + 150) })
            history.replaceState(null, '', `#${s.id}`)
          }}
        >
          {t(s.label)}
        </a>
      ))}
    </nav>
  )
}
