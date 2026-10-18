import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLiveSettings } from './liveSettings'
import { t, usePrefs } from './prefs'

// Striscia d'avviso in alto su tutte le pagine (scritta da /admin). Se il testo non entra nello schermo
// scorre come le notizie in tv (solo transform: niente scatti); se entra resta ferma.
export function NoticeBar() {
  const live = useLiveSettings()
  const { lang } = usePrefs()
  const box = useRef(null)
  const txt = useRef(null)
  const [run, setRun] = useState(0)
  const n = live?.notice
  const text = n && t({ it: n.it || n.en, en: n.en || n.it }, lang)

  useEffect(() => {
    document.documentElement.classList.toggle('has-notice', !!text)
    return () => document.documentElement.classList.remove('has-notice')
  }, [text])

  useLayoutEffect(() => {
    if (!text || !box.current || !txt.current) return
    const measure = () => {
      const over = txt.current.scrollWidth - box.current.clientWidth
      setRun(over > 4 ? txt.current.scrollWidth : 0)
    }
    measure()
    addEventListener('resize', measure)
    return () => removeEventListener('resize', measure)
  }, [text])

  if (!text) return null
  return (
    <div className={`noticebar noticebar--${n.tone || 'brand'}`} role="status" ref={box}>
      <div
        className={`noticebar__track${run ? ' is-running' : ''}`}
        style={run ? { '--dist': `${run + 48}px`, '--dur': `${Math.max(8, (run + 48) / 45)}s` } : undefined}
      >
        <span ref={txt}>{text}</span>
        {run > 0 && <span aria-hidden="true">{text}</span>}
      </div>
    </div>
  )
}

// pioggia di emoji lanciata da /admin: arriva su tutti i telefoni con il sito aperto
export function PartyRain() {
  const live = useLiveSettings()
  const [drops, setDrops] = useState(null)
  const seen = useRef(Date.now() - 15000)
  const at = live?.party?.at || 0
  const emoji = live?.party?.emoji || '🎉'

  useEffect(() => {
    const now = Date.now() + (live?.offset || 0)
    if (!at || at <= seen.current || now - at > 15000) return
    seen.current = at
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setDrops(
      Array.from({ length: 22 }, (_, i) => ({
        x: Math.random() * 96,
        d: Math.random() * 0.9,
        s: 0.8 + Math.random() * 0.9,
        r: (Math.random() - 0.5) * 80,
        k: i,
      })),
    )
    const id = setTimeout(() => setDrops(null), 3600)
    return () => clearTimeout(id)
  }, [at, live?.offset])

  if (!drops) return null
  return (
    <div className="party" aria-hidden="true">
      {drops.map((p) => (
        <span key={p.k} style={{ left: `${p.x}%`, animationDelay: `${p.d}s`, fontSize: `${p.s * 28}px`, '--r': `${p.r}deg` }}>
          {emoji}
        </span>
      ))}
    </div>
  )
}
