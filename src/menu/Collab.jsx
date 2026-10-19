import { useLiveSettings } from '../shared/liveSettings'
import { t } from '../shared/prefs'

// "Ideato in collaborazione con": chi ha pensato il menu con noi, con logo e link al suo Instagram.
// Testo e visibilità si cambiano da /admin; senza modifiche vale il testo di src/data/events.js.
export default function Collab({ collab, lang }) {
  const live = useLiveSettings()
  if (!collab || live?.collab?.on === false) return null
  const custom = live?.collab
  const text = custom?.it ? t({ it: custom.it, en: custom.en || custom.it }, lang) : t(collab.text, lang)
  return (
    <section className="collab" aria-labelledby="collab-title">
      <p id="collab-title" className="collab__label">
        {t({ it: 'Ideato in collaborazione con', en: 'Created in collaboration with' }, lang)}
      </p>
      <a className="collab__logo" href={collab.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${collab.name} su Instagram`}>
        <span style={{ '--r': collab.ratio, WebkitMaskImage: `url(${collab.logo})`, maskImage: `url(${collab.logo})` }} />
      </a>
      <p className="collab__text">{text}</p>
      <a className="collab__ig" href={collab.instagram} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5h.01" />
        </svg>
        <span>
          {t({ it: 'Seguila su Instagram', en: 'Follow her on Instagram' }, lang)} <strong>{collab.handle}</strong>
        </span>
      </a>
    </section>
  )
}
