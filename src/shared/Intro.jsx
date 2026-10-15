import { useEffect, useRef, useState } from 'react'
import { getTheme, t } from './prefs'

// Intro: il logo di GMI Torino che si costruisce (la Mole disegnata, poi il logo).
// Una volta per visita; si salta con un tocco; niente intro con "riduci movimento".
const KEY = 'gmi-intro'

function shouldShow() {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (new URLSearchParams(location.search).has('nointro')) return false
    return !sessionStorage.getItem(KEY)
  } catch {
    return true
  }
}

export default function Intro() {
  const [show] = useState(shouldShow)
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)
  const video = useRef(null)

  useEffect(() => {
    if (!show) return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* niente */
    }
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.classList.add('intro-on')
    const finish = () => setDone(true)
    const v = video.current
    // se il telefono blocca l'autoplay (es. risparmio energetico) si chiude dopo un attimo
    const p = v?.play()
    if (p?.catch) p.catch(() => setTimeout(finish, 900))
    const safety = setTimeout(finish, 5200)
    return () => clearTimeout(safety)
  }, [show])

  useEffect(() => {
    if (!done) return
    document.documentElement.style.overflow = ''
    document.documentElement.classList.remove('intro-on')
    const id = setTimeout(() => setGone(true), 700)
    return () => clearTimeout(id)
  }, [done])

  if (!show || gone) return null
  return (
    <div className={`intro${done ? ' is-done' : ''}`} onClick={() => setDone(true)} aria-hidden="true" style={done ? { pointerEvents: 'none' } : undefined}>
      <div className="intro__logo">
        <video
          ref={video}
          src={getTheme() === 'dark' ? '/brand/gmi-torino-intro-d.mp4' : '/brand/gmi-torino-intro-l.mp4'}
          muted
          playsInline
          preload="auto"
          width="400"
          height="456"
          onEnded={() => setTimeout(() => setDone(true), 350)}
        />
      </div>
      <button type="button" className="intro__skip" tabIndex={-1}>
        {t({ it: 'Tocca per entrare', en: 'Tap to enter' })}
      </button>
    </div>
  )
}
