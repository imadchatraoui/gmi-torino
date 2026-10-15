import { CONTACTS, SECTIONS } from '../data/site'
import Mark from './Mark'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Mark white />
          <p>
            GMI Torino
            <small>Giovani Musulmani d’Italia APS · Sezione di Torino</small>
          </p>
        </div>
        <ul className="site-footer__links">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`/#${s.id}`}>{s.label}</a>
            </li>
          ))}
        </ul>
        <p className="site-footer__small">
          <span>© 2026 GMI Torino</span>
          <span>
            <a href={CONTACTS.instagram.url} target="_blank" rel="noopener noreferrer">
              {CONTACTS.instagram.handle}
            </a>
            {' · '}
            <a href={CONTACTS.national.url} target="_blank" rel="noopener noreferrer">
              {CONTACTS.national.label}
            </a>
            {' · '}
            <a href="/identita/">Identità visiva</a>
          </span>
        </p>
      </div>
    </footer>
  )
}
