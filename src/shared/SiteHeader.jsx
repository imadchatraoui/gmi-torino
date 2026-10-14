import { EVENT } from '../data/event'

export default function SiteHeader({ page }) {
  return (
    <header className="site-header">
      <a className="site-header__brand" href="/" aria-label="GMI Torino, home">
        <img src="/brand/gmi-logo.webp" alt="" width="34" height="39" />
        <span>GMI Torino</span>
      </a>
      <nav className="site-header__nav" aria-label="Principale">
        {page === 'menu' ? <a href="/">Summit</a> : <a href="/menu/">Menu</a>}
        <a href={EVENT.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </nav>
    </header>
  )
}
