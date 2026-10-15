import { useEffect, useMemo, useRef } from 'react'
import { t, usePrefs } from '../shared/prefs'
import FrameSequence from './FrameSequence'
import PokeIllustration from './PokeIllustration'
import VideoScrub from './VideoScrub'
import { buildTimeline, clamp01 } from './timeline'

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Sezione "scroll che apre il poke".
 * La sezione è alta N schermate; dentro, uno stage sticky alto 100svh.
 * Il progresso p (0..1) guida il renderer (SVG in codice, frame o video)
 * e la lista degli ingredienti. Niente re-render React durante lo scroll:
 * solo transform/opacity scritti direttamente sugli elementi.
 */
export default function PokeScroll({ poke, skipTo }) {
  const { lang } = usePrefs()
  const { id, label, title, items, media } = poke
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const rendererRef = useRef(null)
  const barRef = useRef(null)
  const hintRef = useRef(null)
  const itemRefs = useRef([])
  const tl = useMemo(() => buildTimeline(items.length, media?.cues), [items.length, media?.cues])

  useEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    let active = -2
    let lastP = -1

    const render = (p) => {
      rendererRef.current?.update(p, tl)
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp01(p * 10))
      let current = -1
      items.forEach((_, i) => {
        const t = tl.local(p, i)
        const el = itemRefs.current[i]
        if (!el) return
        const r = clamp01(t * 2)
        el.style.opacity = String(0.24 + 0.76 * r)
        el.style.transform = `translate3d(${(1 - r) * 10}px, 0, 0)`
        if (t > 0) current = i
      })
      if (p >= 0.999) current = -1
      if (current !== active) {
        itemRefs.current.forEach((el, i) => el?.classList.toggle('is-active', i === current))
        active = current
      }
    }

    if (reducedMotion()) {
      section.classList.add('poke--static')
      render(1)
      return
    }

    // Gli eventi scroll arrivano già una volta per frame (sono allineati al rendering),
    // quindi si aggiorna direttamente: una lettura di layout, poi solo scritture.
    const update = () => {
      const rect = section.getBoundingClientRect()
      const range = rect.height - sticky.offsetHeight
      const p = range > 0 ? clamp01(-rect.top / range) : 0
      if (Math.abs(p - lastP) < 0.0005) return
      lastP = p
      render(p)
    }
    const onResize = () => {
      lastP = -1
      update()
    }

    // Ascolta lo scroll solo quando la sezione è vicina allo schermo.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', update, { passive: true })
          update()
        } else {
          window.removeEventListener('scroll', update)
          onResize()
        }
      },
      { rootMargin: '20% 0px' },
    )
    io.observe(section)
    window.addEventListener('resize', onResize)
    render(0)
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', onResize)
    }
  }, [items, tl])

  const renderer =
    media?.type === 'frames' ? (
      <FrameSequence ref={rendererRef} frames={media.frames} />
    ) : media?.type === 'video' ? (
      <VideoScrub ref={rendererRef} src={media.src} poster={media.poster} />
    ) : (
      <PokeIllustration ref={rendererRef} items={items} label={t(label, lang)} />
    )

  return (
    <section
      id={id}
      ref={sectionRef}
      className="poke"
      style={{ '--poke-screens': tl.total }}
      aria-labelledby={`${id}-title`}
    >
      <div className="poke__sticky" ref={stickyRef}>
        <div className="poke__bar" aria-hidden="true">
          <span ref={barRef} />
        </div>
        <header className="poke__head">
          <p className="poke__label">
            {t(label, lang)}
            {skipTo && (
              <a className="poke__skip" href={skipTo}>
                {t({ it: 'Salta', en: 'Skip' }, lang)}
              </a>
            )}
          </p>
          <h2 id={`${id}-title`} className="poke__title display">
            {t(title, lang)}
          </h2>
        </header>
        <div className="poke__stage">
          {renderer}
          <p className="poke__hint" ref={hintRef} aria-hidden="true">
            {t({ it: 'Scorri per aprire', en: 'Scroll to open' }, lang)}
          </p>
        </div>
        <ol className="poke__list">
          {items.map((item, i) => (
            <li
              key={`${item.art}-${i}`}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
            >
              <span className="poke__badge" aria-hidden="true">
                {i + 1}
              </span>
              <span className="poke__name">{t(item.name, lang)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
