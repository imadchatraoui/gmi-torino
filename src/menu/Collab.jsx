import { useEffect, useRef } from 'react'
import { useLiveSettings } from '../shared/liveSettings'
import { tornClip } from '../shared/Paper'
import { t } from '../shared/prefs'

const CLIP = tornClip(41, { depth: 3, points: 30 })

// "Ideato in collaborazione con": chi ha pensato il menu con noi, con logo e link al suo Instagram.
// Testo e visibilità si cambiano da /admin; senza modifiche vale il testo di src/data/events.js.
// Entrando nello schermo (una volta sola): le righe dell'etichetta si allungano, il logo compare
// dall'alto come inchiostro, poi testo e link salgono. Con "riduci movimento" è tutto subito visibile.
export default function Collab({ collab, lang }) {
  const live = useLiveSettings()
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return el.classList.add('is-in')
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        el.classList.add('is-in')
        io.disconnect()
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  })
  if (!collab || live?.collab?.on === false) return null
  const custom = live?.collab
  const text = custom?.it ? t({ it: custom.it, en: custom.en || custom.it }, lang) : t(collab.text, lang)
  return (
    <section ref={ref} className="collab" aria-labelledby="collab-title" style={{ clipPath: CLIP }}>
      <p id="collab-title" className="collab__label">
        {t({ it: 'Ideato in collaborazione con', en: 'Created in collaboration with' }, lang)}
      </p>
      <a className="collab__logo" href={collab.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${collab.name} su Instagram`}>
        <span style={{ '--r': collab.ratio, WebkitMaskImage: `url(${collab.logo})`, maskImage: `url(${collab.logo})` }} />
      </a>
      <span className="collab__rule" aria-hidden="true" />
      <p className="collab__text">{text}</p>
      <a
        className="collab__ig"
        href={collab.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t({ it: `Segui ${collab.name} su Instagram`, en: `Follow ${collab.name} on Instagram` }, lang)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17.5 6.5h.01" />
        </svg>
        <span>{collab.handle}</span>
      </a>
    </section>
  )
}
