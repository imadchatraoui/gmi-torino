import { useEffect, useState } from 'react'
import { SECTIONS } from '../data/site'
import { observeSections } from './reveal'
import Mark from './Mark'

export default function SiteHeader({ page = 'home' }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const stop = page === 'home' ? observeSections(SECTIONS.map((s) => s.id), setActive) : () => {}
    return () => {
      window.removeEventListener('scroll', onScroll)
      stop()
    }
  }, [page])

  const base = page === 'home' ? '' : '/'
  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <a className="site-header__brand" href="/" aria-label="GMI Torino, home">
        <Mark />
        <span className="site-header__name">
          GMI Torino
          <small>Giovani Musulmani d’Italia</small>
        </span>
      </a>
      {page === 'home' ? (
        <nav className="site-header__nav" aria-label="Sezioni">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`${base}#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
              {s.label}
            </a>
          ))}
        </nav>
      ) : (
        <a className="site-header__back" href={page === 'menu' ? '/#eventi' : '/'}>
          <span aria-hidden="true">←</span> GMI Torino
        </a>
      )}
    </header>
  )
}
