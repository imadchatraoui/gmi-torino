import { CONTACTS, SECTIONS } from '../data/site'
import { t, usePrefs } from './prefs'

// Footer di tutte le pagine, sulla struttura di gmitalia.org con i colori di GMI Torino:
// presentazione, link rapidi, contatti, social; in fondo copyright e sito nazionale.

const Icon = {
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  ),
}

export default function SiteFooter() {
  const { lang } = usePrefs()
  const tr = (v) => t(v, lang)
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__col site-footer__about">
          <span className="site-footer__logo" aria-hidden="true" />
          <p>
            {tr({
              it: 'GMI Torino è la sezione torinese di Giovani Musulmani d’Italia: incontri, talk ed eventi per i giovani della città.',
              en: 'GMI Torino is the Turin chapter of Giovani Musulmani d’Italia: meetups, talks and events for young people in the city.',
            })}
          </p>
        </div>

        <nav className="site-footer__col" aria-labelledby="ft-links">
          <h2 id="ft-links" className="site-footer__title">
            {tr({ it: 'Link rapidi', en: 'Quick links' })}
          </h2>
          <ul className="site-footer__list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`/#${s.id}`}>{tr(s.label)}</a>
              </li>
            ))}
            <li>
              <a href="/menu/">{tr({ it: 'Il menu', en: 'The menu' })}</a>
            </li>
          </ul>
        </nav>

        <div className="site-footer__col">
          <h2 className="site-footer__title">{tr({ it: 'Contatti', en: 'Contact' })}</h2>
          <ul className="site-footer__list site-footer__contacts">
            <li>
              {Icon.pin}
              <span>{t({ it: 'Torino, Italia', en: 'Torino, Italy' }, lang)}</span>
            </li>
            <li>
              {Icon.mail}
              <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
            </li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__title">{tr({ it: 'Seguici', en: 'Follow us' })}</h2>
          <a className="site-footer__social" href={CONTACTS.instagram.url} target="_blank" rel="noopener noreferrer">
            {Icon.instagram}
            <span>@gmi.torino</span>
          </a>
          <p className="site-footer__note">
            {tr({ it: 'Resta aggiornato sui nostri eventi.', en: 'Stay up to date with our events.' })}
          </p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 GMI Torino · Giovani Musulmani d’Italia APS</p>
        <a href={CONTACTS.national.url} target="_blank" rel="noopener noreferrer">
          {CONTACTS.national.label}
        </a>
      </div>
    </footer>
  )
}
