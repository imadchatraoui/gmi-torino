import { CONTACTS } from '../data/site'
import { t } from './prefs'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="logo" />
          <p>
            GMI Torino
            <small>{t({ it: 'La sezione torinese dei Giovani Musulmani d’Italia', en: 'The Turin chapter of Young Muslims of Italy' })}</small>
          </p>
        </div>
        <ul className="site-footer__links">
          <li>
            <a href="/">{t({ it: 'Pagina iniziale', en: 'Home' })}</a>
          </li>
          <li>
            <a href={CONTACTS.instagram.url} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href={`mailto:${CONTACTS.email}`}>Email</a>
          </li>
        </ul>
        <p className="site-footer__small">© 2026 GMI Torino</p>
      </div>
    </footer>
  )
}
