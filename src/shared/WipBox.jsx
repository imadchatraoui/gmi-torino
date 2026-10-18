import { t, usePrefs } from './prefs'

// "Lavori in corso": una bozza fatta solo di forme sfocate (niente testi inventati),
// attraversata da due strisce di nastro da cantiere giallo e nero. Usata in home e in /design.
const TAPE = { it: 'Lavori in corso', en: 'Work in progress' }

function Tape({ lang, className }) {
  const word = t(TAPE, lang)
  return (
    <div className={`tape ${className}`} aria-hidden="true">
      <span>{Array.from({ length: 8 }, () => word).join('   ·   ')}</span>
    </div>
  )
}

export default function WipBox({ kind = 'about', className = '' }) {
  const { lang } = usePrefs()
  const tr = (v) => t(v, lang)
  return (
    <div
      className={`wip-box ${className}`}
      data-reveal
      role="img"
      aria-label={tr({ it: 'Lavori in corso: sezione in costruzione.', en: 'Work in progress: section under construction.' })}
    >
      <div className={`wip-box__ghost wip-box__ghost--${kind}`} aria-hidden="true">
        {kind === 'archive' ? (
          <>
            <div className="ghost-photos">
              <span />
              <span />
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="ghost-row">
                <span className="ghost-date" />
                <span className="ghost-lines">
                  <i />
                  <i />
                </span>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="ghost-lines ghost-lines--lede">
              <i />
              <i />
              <i />
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="ghost-row">
                <span className="ghost-lines">
                  <i />
                  <i />
                </span>
              </div>
            ))}
          </>
        )}
      </div>
      <Tape lang={lang} className="tape--a" />
      <Tape lang={lang} className="tape--b" />
    </div>
  )
}
