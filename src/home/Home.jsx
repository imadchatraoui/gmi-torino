import { EVENTS } from '../data/events'
import { CONTACTS, SECTIONS, WIP } from '../data/site'
import { daysUntil, eventStatus } from '../data/when'
import BottomNav from '../shared/BottomNav'
import Intro from '../shared/Intro'
import { t, usePrefs } from '../shared/prefs'
import { tornClip } from '../shared/Paper'
import { useReveal } from '../shared/reveal'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'

const NEXT_CLIP = tornClip(5, { depth: 5 })
const CARD_CLIP = tornClip(9, { depth: 2.5, points: 40 })

function countdown(iso, lang) {
  const n = daysUntil(iso)
  if (n > 1) return t({ it: `tra ${n} giorni`, en: `in ${n} days` }, lang)
  if (n === 1) return t({ it: 'domani', en: 'tomorrow' }, lang)
  if (n === 0) return t({ it: 'oggi', en: 'today' }, lang)
  return null
}

// Titolo principale: le lettere salgono una dopo l'altra, poi ondeggiano piano, di continuo.
function AnimatedTitle({ text }) {
  let n = 0
  return (
    <h1 id="hero-title" className="hero__title" aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span key={w} className="hero__word" aria-hidden="true">
          {[...word].map((ch, i) => (
            <span key={i} className="hero__ch" style={{ '--n': n++ }}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

function Hero({ next, lang }) {
  const tr = (v) => t(v, lang)
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__body">
        <p className="hero__kicker">GMI Torino</p>
        <AnimatedTitle key={lang} text={tr({ it: 'Prossimamente, inshallah', en: 'Coming soon, inshallah' })} />
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
  const { lang } = usePrefs()
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
      {WIP[id] && (
        <p className="wip reveal" style={{ '--d': 2 }}>
          <span className="wip__dot" aria-hidden="true" />
          <span>
            <strong>{t({ it: 'Ci stiamo lavorando.', en: 'We are working on it.' }, lang)}</strong> {t(WIP[id], lang)}
          </span>
        </p>
      )}
    </header>
  )
}

function About({ lang }) {
  return (
    <section id="chi-siamo" className="sec" aria-labelledby="chi-siamo-title">
      <SectionHead id="chi-siamo" title={t(SECTIONS[0].label, lang)} />
    </section>
  )
}

// Template evento: stessa struttura per ogni evento; cambiano accento, banner, logo e blocchi accesi.
function EventCard({ ev, lang }) {
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
          <img className="event__logo" src={ev.logo} alt={ev.name} width="748" height="304" loading="lazy" decoding="async" />
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
          <a className="btn btn--primary" href={ev.signup.url} target="_blank" rel="noopener noreferrer">
            {tr({ it: 'Iscriviti', en: 'Sign up' })}
          </a>
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

function Events({ lang, upcoming, recent }) {
  const tr = (v) => t(v, lang)
  return (
    <section id="eventi" className="sec" aria-labelledby="eventi-title">
      <SectionHead id="eventi" title={tr(SECTIONS[1].label)} />
      {upcoming.map((ev) => (
        <EventCard key={ev.id} ev={ev} lang={lang} />
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
      <SectionHead id="archivio" title={tr(SECTIONS[2].label)} />
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
      <SectionHead id="contatti" title={tr(SECTIONS[3].label)} />
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
  const { lang } = usePrefs()
  useReveal()

  const upcoming = EVENTS.filter((e) => eventStatus(e) === 'upcoming')
  const recent = EVENTS.filter((e) => eventStatus(e) === 'recent')
  const finished = EVENTS.filter((e) => eventStatus(e) !== 'upcoming')

  return (
    <>
      <Intro />
      <SiteHeader page="home" />
      <main className="home">
        <Hero next={upcoming[0]} lang={lang} />
        <About lang={lang} />
        <Events lang={lang} upcoming={upcoming} recent={recent} />
        <Archive lang={lang} finished={finished} />
        <Contacts lang={lang} />
      </main>
      <SiteFooter />
      <BottomNav />
    </>
  )
}
