import { useEffect, useMemo, useState } from 'react'
import { eventById } from '../data/events'
import { directionsUrl } from '../shared/directions'
import { useLiveEvent } from '../shared/liveSettings'
import Partners from '../shared/Partners'
import { t, usePrefs } from '../shared/prefs'
import ShareButton from '../shared/ShareButton'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'
import { scrollToEl } from '../shared/smoothScroll'

// gmitorino.org/programma: il programma della giornata, pensato per il telefono.
// I testi sono in src/data/events.js (program). Il giorno dell'evento la pagina segna cosa c'è adesso,
// attenua ciò che è passato e in alto offre un tasto per arrivarci. Per provarla: ?ora=14:30
const BASE = eventById('ymhs')
const day = BASE.start.slice(0, 10)
const offset = BASE.start.slice(19) // es. +01:00 (ora di Torino quel giorno)
const at = (hhmm) => new Date(`${day}T${hhmm}:00${offset}`).getTime()

function useNow() {
  const fake = typeof location !== 'undefined' && new URLSearchParams(location.search).get('ora')
  const [now, setNow] = useState(() => (fake && /^\d\d:\d\d$/.test(fake) ? at(fake) : Date.now()))
  useEffect(() => {
    if (fake) return
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [fake])
  return now
}


export default function ProgramPage() {
  const { lang } = usePrefs()
  const tr = (v) => t(v, lang)
  const ev = useLiveEvent(BASE)
  const now = useNow()
  const items = useMemo(() => ev.program.map((p, i) => ({ ...p, i, start: at(p.from), end: at(p.to) })), [ev.program])

  const today = now >= at('00:00') && now < at('23:59')
  const current = items.find((p) => now >= p.start && now < p.end)
  const next = current ? null : items.find((p) => p.start > now)
  const focus = today ? current || next : null
  const over = now >= items[items.length - 1].end

  const go = () => focus && scrollToEl(document.getElementById(`p-${focus.i}`))

  return (
    <>
      <SiteHeader page="menu" />
      <main id="main" tabIndex={-1} className="pg">
        <header className="pg-hero">
          <img className="pg-hero__logo" src={ev.logo} srcSet={ev.logoSrcSet} sizes="(min-width: 640px) 360px, 70vw" alt={ev.name} width="682" height="343" />
          <h1 className="pg-hero__title display">{tr({ it: 'Programma della giornata', en: 'Programme of the day' })}</h1>
          <p className="pg-hero__sub">{tr({ it: 'Talk, workshop, panel e momenti di partecipazione', en: 'Talks, workshops, a panel and moments to take part' })}</p>
          <div className="divider" aria-hidden="true" />
          <p className="pg-hero__meta">
            {tr(ev.date)} · {ev.time}
            <br />
            <a href={directionsUrl(ev)} target="_blank" rel="noopener noreferrer">
              {ev.venue}, {ev.city}
            </a>
          </p>
          {focus && (
            <button type="button" className="pg-now-btn" onClick={go}>
              <span className="pg-dot" aria-hidden="true" />
              <span>
                {current ? tr({ it: 'Adesso', en: 'Now' }) : tr({ it: 'Tra poco', en: 'Coming up' })} · {focus.from} {focus.title}
              </span>
              <span aria-hidden="true">↓</span>
            </button>
          )}
          {today && over && <p className="pg-over">{tr({ it: 'La giornata è finita: grazie a tutti!', en: 'The day is over: thank you all!' })}</p>}
        </header>

        <ol className="pg-list" aria-label={tr({ it: 'Programma', en: 'Programme' })}>
          {items.map((p) => {
            const state = !today ? '' : p === current ? 'now' : now >= p.end ? 'past' : p === next ? 'next' : ''
            return (
              <li key={p.i} id={`p-${p.i}`} className={`pg-item${p.pause ? ' pg-item--pause' : ''}${state ? ` is-${state}` : ''}`} aria-current={state === 'now' ? 'time' : undefined}>
                <p className="pg-time">
                  <time dateTime={`${day}T${p.from}`}>{p.from}</time>
                  <time className="pg-time__to" dateTime={`${day}T${p.to}`}>
                    {p.to}
                  </time>
                </p>
                <div className="pg-body">
                  {(state === 'now' || state === 'next') && (
                    <p className="pg-badge">{state === 'now' ? tr({ it: 'Adesso', en: 'Now' }) : tr({ it: 'Tra poco', en: 'Coming up' })}</p>
                  )}
                  {p.kind && <p className="pg-kind">{p.kind}</p>}
                  <h2 className={p.pause ? 'pg-title pg-title--pause' : 'pg-title display'}>{p.title}</h2>
                  {p.who && <p className="pg-who">{p.who}</p>}
                  {p.text && <p className="pg-text">{p.text}</p>}
                  {p.link && (
                    <a className="pg-link" href={p.link.href}>
                      {tr(p.link.label)} <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        <footer className="pg-end">
          <Partners ev={ev} className="pg-partners" />
          <ShareButton className="pg-share" title={tr({ it: 'Programma · YMHS', en: 'Programme · YMHS' })} label={tr({ it: 'Condividi il programma', en: 'Share the programme' })} />
        </footer>
      </main>
      <SiteFooter />
    </>
  )
}
