import { t, usePrefs } from './prefs'

// Chi organizza l'evento insieme a GMI Torino (solo per gli eventi che lo indicano in src/data/events.js).
// Logo GMI Torino com'è (PNG); gli altri sono SVG a un colore, tinti con il colore del testo del tema.
export default function Partners({ ev, className = '' }) {
  const { lang } = usePrefs()
  if (!ev.partners?.length) return null
  const names = ['GMI Torino', ...ev.partners.map((p) => p.name)].join(', ')
  return (
    <div className={`partners ${className}`} aria-label={`${t({ it: 'Con', en: 'With' }, lang)} ${names}`} role="group">
      <a className="partners__link" href="https://www.instagram.com/gmi.torino/" target="_blank" rel="noopener noreferrer" aria-label="GMI Torino su Instagram">
        <span className="logo partners__gmi" />
      </a>
      {ev.partners.map((p) => (
        <span key={p.name} className="partners__item">
          <span className="partners__sep" />
          <a className="partners__link" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} su Instagram`}>
          <span className="partners__mark" style={{ '--r': p.ratio, '--h': `${p.height}px` }}>
            <span className="partners__layer" style={{ WebkitMaskImage: `url(${p.logo})`, maskImage: `url(${p.logo})` }} />
            {p.dot && (
              <span
                className="partners__layer partners__layer--dot"
                style={{ WebkitMaskImage: `url(${p.dot})`, maskImage: `url(${p.dot})` }}
              />
            )}
          </span>
          </a>
        </span>
      ))}
    </div>
  )
}
