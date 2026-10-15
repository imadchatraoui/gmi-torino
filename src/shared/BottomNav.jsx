import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from '../data/site'
import { observeSections } from './reveal'

// Barra di navigazione flottante per il telefono: compare dopo l'hero,
// l'indicatore scivola sotto la sezione in vista.
export default function BottomNav() {
  const [active, setActive] = useState(null)
  const [shown, setShown] = useState(false)
  const nav = useRef(null)
  const pill = useRef(null)

  useEffect(() => {
    const stop = observeSections(SECTIONS.map((s) => s.id), setActive)
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
        <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
          {s.label}
        </a>
      ))}
    </nav>
  )
}
