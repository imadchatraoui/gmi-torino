import { EVENT } from '../data/event'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <img src="/brand/gmi-logo.webp" alt="" width="56" height="64" loading="lazy" />
      <p className="site-footer__org">Giovani Musulmani d'Italia APS · Sezione di Torino</p>
      <p className="site-footer__links">
        <a href={EVENT.instagram} target="_blank" rel="noopener noreferrer">
          @gmi.torino
        </a>
        <span aria-hidden="true">·</span>
        <a href="mailto:gmitorino@gmail.com">gmitorino@gmail.com</a>
      </p>
      <p className="site-footer__small">© 2026 GMI Torino</p>
    </footer>
  )
}
