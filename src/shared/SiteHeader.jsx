import { useEffect, useState } from 'react'
import { SECTIONS } from '../data/site'
import { t, toggleLang, toggleTheme, usePrefs } from './prefs'
import { observeSections } from './reveal'

function ThemeIcons() {
  return (
    <>
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
      </svg>
    </>
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
          <small>{t({ it: 'Giovani Musulmani d’Italia', en: 'Young Muslims of Italy' })}</small>
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
          {lang === 'it' ? 'EN' : 'IT'}
        </button>
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
          <ThemeIcons />
        </button>
      </div>
    </header>
  )
}
