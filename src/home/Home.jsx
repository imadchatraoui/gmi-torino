import { useEffect, useRef } from 'react'
import { EVENTS } from '../data/events'
import { CONTACTS, WIP, sectionLabel } from '../data/site'
import { daysUntil, eventStatus } from '../data/when'
import BottomNav from '../shared/BottomNav'
import Intro from '../shared/Intro'
import { t, usePrefs } from '../shared/prefs'
import { tornClip } from '../shared/Paper'
import { useReveal } from '../shared/reveal'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'
import GradientText from '../components/react-bits/GradientText'
import StarBorder from '../components/react-bits/StarBorder'

// colori del titolo animato (React Bits GradientText): bordeaux e oro scuri su crema, crema e oro su scuro
const TITLE_COLORS = {
  light: ['#6E0B0E', '#A87A20', '#A8262B', '#A87A20'],
  dark: ['#F7ECD4', '#E6BE6A', '#F4D0C0', '#FFF1C8'],
}

const NEXT_CLIP = tornClip(5, { depth: 5 })
const CARD_CLIP = tornClip(9, { depth: 2.5, points: 40 })

function countdown(iso, lang) {
  const n = daysUntil(iso)
  if (n > 1) return t({ it: `tra ${n} giorni`, en: `in ${n} days` }, lang)
  if (n === 1) return t({ it: 'domani', en: 'tomorrow' }, lang)
  if (n === 0) return t({ it: 'oggi', en: 'today' }, lang)
  return null
}

function Hero({ next, lang, theme }) {
  const tr = (v) => t(v, lang)
  const ref = useRef(null)
  // fuori schermo il riflesso sulla calligrafia si ferma: niente ridisegni inutili durante lo scroll
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-off', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section id="top" ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero__body">
        <p className="hero__kicker">GMI Torino</p>
        <h1 id="hero-title" className="hero__title">
          <GradientText colors={TITLE_COLORS[theme]} variant="flow" animationSpeed={10} scale={3}>
            {tr({ it: 'Prossimamente, inshallah', en: 'Coming soon, inshallah' })}
          </GradientText>
        </h1>
        <p className="hero__ar" lang="ar" dir="rtl">
          إن شاء الله
        </p>
        <p className="hero__lede">
          {tr({
            it: 'Stiamo costruendo il nuovo sito della sezione torinese di Giovani Musulmani d’Italia.',
            en: 'We are building the new website of the Turin chapter of Giovani Musulmani d’Italia.',
          })}
        </p>
        {next && (
          <a className="hero__next theme-ymhs" href="#eventi" style={{ clipPath: NEXT_CLIP }}>
            <span className="hero__next-label">{tr({ it: 'Prossimo evento', en: 'Next event' })}</span>
            <span className="hero__next-name display">{next.name}</span>
            <span className="hero__next-date">
              {tr(next.date)}
              {countdown(next.start, lang) && <span className="hero__next-count">{countdown(next.start, lang)}</span>}
            </span>
          </a>
        )}
      </div>
    </section>
  )
}

function SectionHead({ id, title, children }) {
  return (
    <header className="sec-head">
      <h2 id={`${id}-title`} className="sec-head__title reveal">
        {title}
      </h2>
      {children && (
        <p className="sec-head__lede reveal" style={{ '--d': 1 }}>
          {children}
        </p>
      )}
    </header>
  )
}

// Quello che arriva (Chi siamo, Archivio): una sola nota e sotto le sezioni che si dissolvono,
// sempre più sfocate verso il basso, fino a sparire nel footer. Niente frasi ripetute.
function Soon({ lang, withArchive }) {
  const tr = (v) => t(v, lang)
  const ids = withArchive ? ['chi-siamo', 'archivio'] : ['chi-siamo']
  return (
    <section className="soon" aria-labelledby="soon-title">
      <div id="chi-siamo" className="soon__note sec reveal">
        <p className="soon__label">{tr({ it: 'Ci stiamo lavorando', en: 'Work in progress' })}</p>
        <h2 id="soon-title" className="soon__title">
          {tr(
            withArchive
              ? { it: 'Chi siamo e l’archivio arrivano presto, inshallah.', en: 'About us and the archive are coming soon, inshallah.' }
              : { it: 'Chi siamo arriva presto, inshallah.', en: 'About us is coming soon, inshallah.' },
          )}
        </h2>
      </div>
      <div className="soon__ghost" aria-hidden="true" data-reveal>
        {ids.map((id, i) => (
          <div key={id} id={i ? id : undefined} className={`soon__block soon__block--${i + 1}`}>
            <p className="soon__heading">{tr(sectionLabel(id))}</p>
            <p className="soon__text">{tr(WIP[id])}</p>
            <div className="soon__lines">
              <span />
              <span />
              <span />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Template evento: stessa struttura per ogni evento; cambiano accento, banner, logo e blocchi accesi.
function EventCard({ ev, lang, theme }) {
  const tr = (v) => t(v, lang)
  const when = countdown(ev.start, lang)
  return (
    <article className={`event reveal${ev.theme ? ` theme-${ev.theme}` : ''}`} style={{ '--accent': ev.accent, clipPath: CARD_CLIP }}>
      {ev.banner && <img className="event__banner" src={ev.banner} alt="" loading="lazy" decoding="async" />}
      <div className="event__head">
        <p className="event__kicker">
          {tr({ it: 'Prossimo evento', en: 'Next event' })}
          {when && <span className="event__count">{when}</span>}
        </p>
        {ev.logo ? (
          <img className="event__logo" src={ev.logo} alt={ev.name} width="682" height="267" loading="lazy" decoding="async" />
        ) : (
          <p className="event__short display">{ev.short}</p>
        )}
        <h3 className="event__title display">{ev.name}</h3>
        {ev.edition && <p className="event__edition">{tr(ev.edition)}</p>}
      </div>
      {ev.blocks.info && (
        <dl className="event__facts">
          <div>
            <dt>{tr({ it: 'Quando', en: 'When' })}</dt>
            <dd>
              {tr(ev.date)}
              <span>{ev.time}</span>
              {ev.end && (
                <a className="event__cal" href={`/eventi/${ev.id}.ics`} download={`${ev.slug}.ics`}>
                  {tr({ it: 'Aggiungi al calendario', en: 'Add to calendar' })}
                </a>
              )}
            </dd>
          </div>
          <div>
            <dt>{tr({ it: 'Dove', en: 'Where' })}</dt>
            <dd>
              <a href={ev.mapsUrl} target="_blank" rel="noopener noreferrer">
                {ev.venue}
              </a>
              <span>{ev.city}</span>
            </dd>
          </div>
          {ev.price && (
            <div>
              <dt>{tr({ it: 'Quota', en: 'Fee' })}</dt>
              <dd>
                {ev.price}
                {ev.signup && <span>{tr(ev.signup.note)}</span>}
              </dd>
            </div>
          )}
        </dl>
      )}
      <div className="event__actions">
        {ev.blocks.signup && ev.signup && (
          <StarBorder
            as="a"
            className="signup-star"
            color={theme === 'dark' ? '#ffffff' : '#e6a92c'}
            speed="5s"
            thickness={3}
            href={ev.signup.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tr({ it: 'Iscriviti', en: 'Sign up' })}
          </StarBorder>
        )}
        {ev.blocks.menu && ev.menu && (
          <a className="btn btn--ghost" href="/menu/">
            {tr({ it: 'Il menu del pranzo', en: 'The lunch menu' })}
          </a>
        )}
      </div>
    </article>
  )
}

function Events({ lang, theme, upcoming, recent }) {
  const tr = (v) => t(v, lang)
  return (
    <section id="eventi" className="sec" aria-labelledby="eventi-title">
      <SectionHead id="eventi" title={tr(sectionLabel('eventi'))} />
      {upcoming.map((ev) => (
        <EventCard key={ev.id} ev={ev} lang={lang} theme={theme} />
      ))}
      {recent.map((ev) => (
        <a key={ev.id} className="event-recent reveal" href={`#arch-${ev.id}`}>
          <span>{tr({ it: `${ev.name} è appena passato.`, en: `${ev.name} has just ended.` })}</span>
          <strong>{tr({ it: 'Rivedi l’evento nell’archivio', en: 'Look back at it in the archive' })}</strong>
        </a>
      ))}
      {!upcoming.length && !recent.length && (
        <p className="sec-empty reveal">
          {tr({
            it: 'Il prossimo evento è in preparazione: lo annunciamo prima su Instagram.',
            en: 'The next event is in the works: we announce it on Instagram first.',
          })}
        </p>
      )}
    </section>
  )
}

function Archive({ lang, finished }) {
  const tr = (v) => t(v, lang)
  return (
    <section id="archivio" className="sec" aria-labelledby="archivio-title">
      <SectionHead id="archivio" title={tr(sectionLabel('archivio'))} />
      {finished.map((ev) => (
        <article key={ev.id} id={`arch-${ev.id}`} className="past past--auto reveal" style={{ '--accent': ev.accent }}>
          <p className="past__date">{tr(ev.date)}</p>
          <h3 className="past__title">{ev.name}</h3>
          <p className="past__venue">
            {ev.venue}
            <span>{ev.city}</span>
          </p>
          {ev.blocks.menu && (
            <a className="past__link" href="/menu/">
              {tr({ it: 'Il menu del pranzo', en: 'The lunch menu' })}
            </a>
          )}
        </article>
      ))}
    </section>
  )
}

function Contacts({ lang }) {
  const tr = (v) => t(v, lang)
  const rows = [
    { href: CONTACTS.instagram.url, label: 'Instagram', value: CONTACTS.instagram.handle, ext: true },
    { href: `mailto:${CONTACTS.email}`, label: 'Email', value: CONTACTS.email },
  ]
  return (
    <section id="contatti" className="sec" aria-labelledby="contatti-title">
      <SectionHead id="contatti" title={tr(sectionLabel('contatti'))} />
      <ul className="contacts">
        {rows.map((r, i) => (
          <li key={r.label} className="reveal" style={{ '--d': i }}>
            <a href={r.href} {...(r.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <span className="contacts__label">{r.label}</span>
              <span className="contacts__value">{r.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Home() {
  const { lang, theme } = usePrefs()
  useReveal()

  const upcoming = EVENTS.filter((e) => eventStatus(e) === 'upcoming')
  const recent = EVENTS.filter((e) => eventStatus(e) === 'recent')
  const finished = EVENTS.filter((e) => eventStatus(e) !== 'upcoming')

  return (
    <>
      <Intro />
      <SiteHeader page="home" />
      <main className="home">
        <Hero next={upcoming[0]} lang={lang} theme={theme} />
        <Events lang={lang} theme={theme} upcoming={upcoming} recent={recent} />
        {finished.length > 0 && <Archive lang={lang} finished={finished} />}
        <Contacts lang={lang} />
        <Soon lang={lang} withArchive={!finished.length} />
      </main>
      <SiteFooter />
      <BottomNav />
    </>
  )
}
