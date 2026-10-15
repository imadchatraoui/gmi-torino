import { t, usePrefs } from './prefs'

// Navigazione a "linea della metro" (come il pannello sotto le fermate della metro di Torino):
// una linea con le fermate, i nomi inclinati, la fermata in cui ti trovi vuota.
export default function MetroLine({ stops, current }) {
  const { lang } = usePrefs()
  return (
    <nav className="metro" aria-label={t({ it: 'Sezioni del sito', en: 'Site sections' }, lang)}>
      <ol className="metro__line">
        {stops.map((s) => (
          <li key={s.id} className={`metro__stop${s.id === current ? ' is-here' : ''}`}>
            <a href={`#${s.id}`} aria-current={s.id === current ? 'location' : undefined}>
              <span className="metro__dot" aria-hidden="true" />
              <span className="metro__name">{t(s.label, lang)}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
