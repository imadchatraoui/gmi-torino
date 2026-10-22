import { useEffect, useRef, useState } from 'react'
import { eventById } from '../data/events'
import { tornClip } from '../shared/Paper'
import BottomNav from '../shared/BottomNav'
import ShareButton from '../shared/ShareButton'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'
import { READING as R } from './content'

// gmitorino.org/reading (e /test per le prove): il testo del reading su Al-Ghazali, da leggere sul telefono
// durante l'evento. Stile YMHS come /menu; i testi sono in content.js, così come li ha scritti chi lo cura.
const EV = eventById('ymhs')
const QUOTE_CLIP = tornClip(61, { depth: 3, points: 30 })
const BOOK_CLIP = tornClip(73, { depth: 3, points: 30 })

// _parola_ nel testo → corsivo
const rich = (s) => s.split(/_(.+?)_/g).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))

const NAV = [
  { id: 'estratto', label: { it: 'Estratto', en: 'Excerpt' } },
  { id: 'domande', label: { it: 'Domande', en: 'Questions' } },
  { id: 'libro', label: { it: 'Libro', en: 'Book' } },
  { id: 'rd-top', top: true, label: { it: 'Torna su', en: 'Top' } },
]

// filo sottile sotto l'header: quanto manca alla fine del testo (solo transform, niente re-render)
function Progress() {
  const bar = useRef(null)
  useEffect(() => {
    let frame = 0
    const draw = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`
    }
    const on = () => frame || (frame = requestAnimationFrame(draw))
    draw()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
      cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <div className="rd-progress" aria-hidden="true">
      <span ref={bar} />
    </div>
  )
}

// le sezioni salgono piano quando arrivano sullo schermo (una volta sola)
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.rd-reveal') ?? []
    if (!('IntersectionObserver' in window)) return els.forEach((el) => el.classList.add('is-in'))
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))),
      { rootMargin: '0px 0px -12% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

// il logo di chi cura il reading (contiene già il nome); se il file manca resta il nome scritto
function PartnerLogo({ className, children }) {
  const [ok, setOk] = useState(true)
  if (!ok) return children
  return <img className={className} src={R.partnerLogo} alt={R.partner} onError={() => setOk(false)} />
}

// preferenze di lettura ricordate su questo telefono (vedi Privacy e cookie)
function useStored(key, initial, allowed) {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key)
      return allowed.includes(s) ? s : initial
    } catch {
      return initial
    }
  })
  const set = (next) => {
    setV(next)
    try {
      localStorage.setItem(key, next)
    } catch {
      /* modalità privata */
    }
  }
  return [v, set]
}

const VIEWS = [
  ['both', 'EN | IT', 'Inglese a sinistra, italiano a destra'],
  ['it', 'Italiano', 'Solo italiano'],
  ['en', 'English', 'Only English'],
]
const SIZES = ['s', 'm', 'l', 'xl', 'xxl']
const SIZE_PCT = { s: 90, m: 100, l: 115, xl: 130, xxl: 150 }
const FIELDS = ['before', 'lead', 'strong', 'after']

// schermo sempre acceso mentre si legge ad alta voce (Wake Lock: Safari 16.4+, Chrome); si riattiva tornando sulla pagina
function useAwake() {
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!on || !supported) return
    let lock = null
    let alive = true
    const take = () =>
      navigator.wakeLock
        .request('screen')
        .then((l) => (alive ? (lock = l) : l.release()))
        .catch(() => setOn(false))
    const back = () => document.visibilityState === 'visible' && take()
    take()
    document.addEventListener('visibilitychange', back)
    return () => {
      alive = false
      document.removeEventListener('visibilitychange', back)
      lock?.release().catch(() => {})
    }
  }, [on, supported])
  return { supported, on, setOn }
}

// barra di lettura: lingua dell'estratto e, nel pannello Aa, grandezza, carattere e spaziatura
function ReaderBar({ view, setView, prefs }) {
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  const { size, setSize, font, setFont, space, setSpace, awake } = prefs
  const i = SIZES.indexOf(size)

  // si chiude toccando fuori o con Esc
  useEffect(() => {
    if (!open) return
    const out = (e) => box.current && !box.current.contains(e.target) && setOpen(false)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', out)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', out)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const seg = (label, value, set, options) => (
    <div className="rd-opt">
      <span className="rd-opt__label">{label}</span>
      <div className="rd-seg" role="group" aria-label={label}>
        {options.map(([v, l]) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => set(v)}>
            {l}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="rd-bar" ref={box}>
      <div className="rd-bar__row">
        <div className="rd-seg" role="group" aria-label="Lingua dell'estratto">
          {VIEWS.map(([v, l, aria]) => (
            <button key={v} type="button" aria-pressed={view === v} aria-label={aria} onClick={() => setView(v)}>
              {l}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="rd-aa"
          aria-expanded={open}
          aria-controls="rd-panel"
          aria-label="Opzioni di lettura: grandezza, carattere, spaziatura"
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden="true">Aa</span>
        </button>
      </div>
      {open && (
        <div id="rd-panel" className="rd-panel" role="group" aria-label="Opzioni di lettura">
          <div className="rd-opt">
            <span className="rd-opt__label">Grandezza</span>
            <div className="rd-seg rd-seg--size" role="group" aria-label="Grandezza del testo">
              <button type="button" aria-label="Testo più piccolo" disabled={i === 0} onClick={() => setSize(SIZES[i - 1])}>
                A−
              </button>
              <output className="rd-size" aria-live="polite">
                {SIZE_PCT[size]}%
              </output>
              <button type="button" aria-label="Testo più grande" disabled={i === SIZES.length - 1} onClick={() => setSize(SIZES[i + 1])}>
                A+
              </button>
            </div>
          </div>
          {seg('Carattere', font, setFont, [
            ['serif', 'Classico'],
            ['sans', 'Semplice'],
          ])}
          {seg('Spaziatura', space, setSpace, [
            ['normal', 'Normale'],
            ['wide', 'Ampia'],
          ])}
          {awake.supported &&
            seg('Schermo', awake.on ? 'on' : 'off', (v) => awake.setOn(v === 'on'), [
              ['off', 'Normale'],
              ['on', 'Sempre acceso'],
            ])}
        </div>
      )}
    </div>
  )
}

export default function ReadingPage() {
  const ref = useReveal()
  const [view, setView] = useStored('gmi-reading-view', 'both', VIEWS.map((v) => v[0]))
  const [size, setSize] = useStored('gmi-reading-size', 'm', SIZES)
  const [font, setFont] = useStored('gmi-reading-font', 'serif', ['serif', 'sans'])
  const [space, setSpace] = useStored('gmi-reading-space', 'normal', ['normal', 'wide'])
  const awake = useAwake()
  const prefs = { size, setSize, font, setFont, space, setSpace, awake }
  const [en, it] = ['en', 'it'].map((l) => R.excerpt.versions.find((v) => v.lang === l))
  const shown = view === 'both' ? [en, it] : [view === 'en' ? en : it]
  return (
    <>
      <SiteHeader page="menu" />
      <Progress />
      <main id="main" tabIndex={-1} className={`rd rd--${size} rd--${font} rd--${space}`} ref={ref}>
        <header id="rd-top" className="rd-hero">
          <img className="rd-hero__logo" src={EV.logo} srcSet={EV.logoSrcSet} sizes="(min-width: 640px) 360px, 70vw" alt={EV.name} width="682" height="343" />
          <p className="rd-hero__kind">{R.kind}</p>
          <h1 className="rd-hero__title display">{R.title}</h1>
          <p className="rd-hero__original">{R.original}</p>
          <div className="divider" aria-hidden="true" />
          <p className="rd-hero__meta">
            25 ottobre 2026
            <br />
            {R.place}
          </p>
          <div className="rd-hero__partner">
            <PartnerLogo className="rd-hero__plogo">
              <span>{R.partner}</span>
            </PartnerLogo>
          </div>
        </header>

        <figure className="rd-question rd-reveal" style={{ clipPath: QUOTE_CLIP }}>
          <blockquote className="display">{R.question}</blockquote>
          <figcaption lang="it">{R.questionIt}</figcaption>
        </figure>

        <section id="estratto" className="rd-section rd-reveal" aria-labelledby="rd-excerpt">
          <h2 id="rd-excerpt" className="rd-h2">{R.excerpt.heading}</h2>
          <ReaderBar view={view} setView={setView} prefs={prefs} />
          {/* affiancati: ogni paragrafo inglese ha accanto il suo italiano, così si segue riga per riga */}
          <div className={`rd-text rd-text--${shown.length === 2 ? 'two' : 'one'}`}>
            {shown.map((v) => (
              <p key={v.lang} className="rd-text__tag" lang={v.lang}>
                {v.tag}
              </p>
            ))}
            {FIELDS.map((f) =>
              shown.map((v) => (
                <p key={`${f}-${v.lang}`} lang={v.lang} className={f === 'strong' ? 'rd-text__p rd-text__key' : 'rd-text__p'}>
                  {v[f]}
                </p>
              )),
            )}
          </div>
        </section>

        <section id="domande" className="rd-section rd-reveal" aria-labelledby="rd-questions">
          <h2 id="rd-questions" className="rd-h2">{R.questions.heading}</h2>
          <ol className="rd-questions">
            {R.questions.items.map(([lead, text], i) => (
              <li key={i}>
                <span className="rd-questions__n display" aria-hidden="true">{i + 1}</span>
                <p>
                  <strong>{lead}</strong> {rich(text)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <aside id="libro" className="rd-book rd-reveal" style={{ clipPath: BOOK_CLIP }} aria-labelledby="rd-book-title">
          <span className="rd-book__badge">{R.ebook.badge}</span>
          <h2 id="rd-book-title" className="rd-book__title">{R.ebook.title}</h2>
          <div className="rd-book__row">
            <img className="rd-book__qr" src={R.ebook.qr} alt="QR code del libro in PDF" width="120" height="120" />
            <p className="rd-book__text">{R.ebook.text}</p>
          </div>
          <a className="btn btn--primary rd-book__btn" href={R.ebook.url} target="_blank" rel="noopener noreferrer">
            {R.ebook.button} →
          </a>
        </aside>

        <section className="rd-section rd-reveal" aria-labelledby="rd-books">
          <h2 id="rd-books" className="rd-h2">{R.books.heading}</h2>
          <ol className="rd-books">
            {R.books.items.map(([name, it, text]) => (
              <li key={name}>
                <p className="rd-books__name">
                  <strong>{name}</strong> <em>{it}</em>
                </p>
                <p className="rd-books__text">{rich(text)}</p>
              </li>
            ))}
          </ol>
        </section>

        <footer className="rd-credits rd-reveal">
          <PartnerLogo className="rd-credits__logo">
            <p className="rd-credits__brand display">{R.credits.brand}</p>
          </PartnerLogo>
          <p>{R.credits.role}</p>
          <p className="rd-credits__curator">{R.credits.curator}</p>
          <ShareButton className="rd-share" title="Reading · The Alchemy of Happiness" label="Condividi il testo" />
        </footer>
      </main>
      <SiteFooter />
      <BottomNav items={NAV} heroId="rd-top" label="Sezioni del reading" />
    </>
  )
}
