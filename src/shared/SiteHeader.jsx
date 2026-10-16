import { useEffect, useState } from 'react'
import { SECTIONS } from '../data/site'
import { t, toggleLang, toggleTheme, usePrefs } from './prefs'
import { observeSections } from './reveal'

// tema: un cerchio sottile metà pieno, che gira di mezzo giro a ogni cambio
function ThemeIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5Z" fill="currentColor" />
    </svg>
  )
}

export default function SiteHeader({ page = 'home' }) {
  const { theme, lang } = usePrefs()
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

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <a className="site-header__brand" href="/" aria-label={t({ it: 'GMI Torino, pagina iniziale', en: 'GMI Torino, home page' })}>
        <span className="logo" />
        <span className="site-header__name">
          GMI Torino
          <small>Giovani Musulmani d’Italia</small>
        </span>
      </a>
      {page === 'home' && (
        <nav className="site-header__nav" aria-label={t({ it: 'Sezioni', en: 'Sections' })}>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
              {t(s.label)}
            </a>
          ))}
        </nav>
      )}
      <div className="site-header__tools">
        <button
          type="button"
          className="tool tool--lang"
          onClick={toggleLang}
          aria-label={lang === 'it' ? 'Switch to English' : 'Passa all’italiano'}
        >
          <span className={lang === 'it' ? 'is-on' : undefined}>IT</span>
          <span className="tool__sep" aria-hidden="true">/</span>
          <span className={lang === 'en' ? 'is-on' : undefined}>EN</span>
        </button>
        <span className="tool__rule" aria-hidden="true" />
        <button
          type="button"
          className="tool tool--theme"
          onClick={toggleTheme}
          aria-label={
            theme === 'dark'
              ? t({ it: 'Passa al tema chiaro', en: 'Switch to light theme' })
              : t({ it: 'Passa al tema scuro', en: 'Switch to dark theme' })
          }
        >
          <ThemeIcon />
        </button>
      </div>
    </header>
  )
}
