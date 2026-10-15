import { useEffect, useRef } from 'react'

// Titolo principale con tre esperimenti di animazione, scelti con ?titolo= nell'indirizzo:
//   luna      una luna d'oro passa dietro la scritta; dove passa, le lettere cambiano colore (eclissi)
//   parallax  scorrendo, le lettere si staccano e volano via a velocità diverse
//   finestra  le lettere sono una finestra su un arabesco d'oro che scorre dietro
//   tutto     luna + parallax insieme
// Tutto con transform/opacity tranne il clip della luna e lo scorrimento della finestra (aree piccole).

export const TITLE_VARIANTS = ['luna', 'parallax', 'finestra', 'tutto']

export function titleVariant() {
  try {
    const v = new URLSearchParams(location.search).get('titolo')
    return TITLE_VARIANTS.includes(v) ? v : 'luna'
  } catch {
    return 'luna'
  }
}

// profondità finta ma stabile per ogni lettera (parallax)
const depth = (n) => 0.35 + (((n * 37) % 11) / 10) * 0.9

function Letters({ text, wave = true }) {
  let n = 0
  return text.split(' ').map((word, w) => (
    <span key={w} className="hero__word" aria-hidden="true">
      {[...word].map((ch, i) => {
        const k = n++
        return (
          <span key={i} className={`hero__ch${wave ? '' : ' hero__ch--still'}`} style={{ '--n': k, '--z': depth(k).toFixed(2) }}>
            {ch}
          </span>
        )
      })}
    </span>
  ))
}

// Scrive --p (0 → 1 mentre l'apertura esce dallo schermo) sull'elemento indicato.
export function useScrollProgress(ref, enabled) {
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const h = el.offsetHeight || 1
      const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.8)))
      el.style.setProperty('--p', p.toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [ref, enabled])
}

export default function HeroTitle({ text, variant }) {
  const wrap = useRef(null)

  if (variant === 'luna' || variant === 'tutto') {
    return (
      <div className="tw tw--luna" ref={wrap}>
        <span className="tw__track" aria-hidden="true">
          <span className="tw__moon" />
        </span>
        <h1 id="hero-title" className="hero__title" aria-label={text}>
          <Letters text={text} />
        </h1>
        {/* la stessa scritta, chiara, visibile solo dentro la luna */}
        <p className="hero__title tw__eclipse" aria-hidden="true">
          <Letters text={text} />
        </p>
      </div>
    )
  }

  if (variant === 'finestra') {
    return (
      <div className="tw tw--finestra">
        <h1 id="hero-title" className="hero__title tw__window" aria-label={text}>
          <Letters text={text} wave={false} />
        </h1>
      </div>
    )
  }

  return (
    <div className="tw tw--parallax">
      <h1 id="hero-title" className="hero__title" aria-label={text}>
        <Letters text={text} />
      </h1>
    </div>
  )
}
