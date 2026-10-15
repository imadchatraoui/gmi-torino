import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from '../data/site'
import { t, usePrefs } from './prefs'

// Barra di navigazione flottante per il telefono: compare dopo l'hero,
// l'indicatore scivola sotto la sezione in vista.
export default function BottomNav() {
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
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) cur = s.id
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = SECTIONS.at(-1).id
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
    const hero = document.getElementById('top')
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
    <nav ref={nav} className={`bottom-nav${shown ? ' is-shown' : ''}`} aria-label="Sezioni">
      <span ref={pill} className="bottom-nav__pill" aria-hidden="true" />
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={active === s.id ? 'true' : undefined}
          onClick={(e) => {
            const el = document.getElementById(s.id)
            if (!el) return
            e.preventDefault()
            // il tocco vince subito: l'indicatore va sulla sezione scelta e resta lì durante lo scorrimento
            setActive(s.id)
            lockUntil.current = performance.now() + 1200
            const header = document.querySelector('.site-header')?.offsetHeight ?? 0
            window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - header - 8, behavior: 'smooth' })
            history.replaceState(null, '', `#${s.id}`)
          }}
        >
          {t(s.label)}
        </a>
      ))}
    </nav>
  )
}
