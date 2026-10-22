import { useEffect, useRef, useState } from 'react'
import { EVENTS } from '../data/events'
import { CONTACTS, sectionLabel } from '../data/site'
import { daysUntil, eventStatus, isLive, signupOpen } from '../data/when'
import BottomNav from '../shared/BottomNav'
import Intro from '../shared/Intro'
import { t, usePrefs } from '../shared/prefs'
import { tornClip } from '../shared/Paper'
import { useReveal } from '../shared/reveal'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'
import GradientText from '../components/react-bits/GradientText'
import StarBorder from '../components/react-bits/StarBorder'
import Partners from '../shared/Partners'
import WipBox from '../shared/WipBox'
import { directionsUrl } from '../shared/directions'
import { useLiveEvent, useLiveSettings } from '../shared/liveSettings'
import WordCycle from './WordCycle'

// colori del titolo animato (React Bits GradientText): bordeaux e oro scuri su crema, crema e oro su scuro
const TITLE_COLORS = {
  light: ['#6E0B0E', '#A87A20', '#A8262B', '#A87A20'],
  dark: ['#F7ECD4', '#E6BE6A', '#F4D0C0', '#FFF1C8'],
}

// la stessa espressione in tre modi: in sha Allah → in arabo → tradotta
const ARABIC = { text: 'إن شاء الله', lang: 'ar', dir: 'rtl', ar: true }
const CYCLE_IT = [{ text: 'in sha Allah' }, ARABIC, { text: 'se Dio vuole' }]
const CYCLE_EN = [{ text: 'in sha Allah' }, ARABIC, { text: 'God willing' }]

const NEXT_CLIP = tornClip(5, { depth: 5 })
const CARD_CLIP = tornClip(9, { depth: 2.5, points: 40 })

function countdown(iso, lang) {
  const n = daysUntil(iso)
  if (n > 1) return t({ it: `tra ${n} giorni`, en: `in ${n} days` }, lang)
  if (n === 1) return t({ it: 'domani', en: 'tomorrow' }, lang)
  if (n === 0) return t({ it: 'oggi', en: 'today' }, lang)
  return null
}

function Hero({ next: base, recent, lang, theme }) {
  const next = useLiveEvent(base)
  const tr = (v) => t(v, lang)
  const ref = useRef(null)
  // fuori schermo la parola che cambia si ferma (WordCycle guarda la classe is-off)
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
        <h1 id="hero-title" className="hero__title" aria-label={tr({ it: 'Prossimamente, in sha Allah', en: 'Coming soon, in sha Allah' })}>
          <span aria-hidden="true">
            <GradientText colors={TITLE_COLORS[theme]} variant="flow" animationSpeed={10} scale={3}>
              {tr({ it: 'Prossimamente,', en: 'Coming soon,' })}
            </GradientText>
          </span>
          <WordCycle className="hero__morph" words={lang === 'en' ? CYCLE_EN : CYCLE_IT} />
        </h1>
        <p className="hero__lede">
          {tr({
            it: 'Stiamo costruendo il nuovo sito della sezione torinese di Giovani Musulmani d’Italia.',
            en: 'We are building the new website of the Turin chapter of Giovani Musulmani d’Italia.',
          })}
        </p>
        {next && (
          <a className="hero__next theme-ymhs" href="#eventi" style={{ clipPath: NEXT_CLIP }}>
            <span className="hero__next-label">
              {isLive(next) ? tr({ it: 'In corso, oggi', en: 'Happening today' }) : tr({ it: 'Prossimo evento', en: 'Next event' })}
            </span>
            <span className="hero__next-name display">{next.name}</span>
            <span className="hero__next-date">
              {tr(next.date)}
              {!isLive(next) && countdown(next.start, lang) && <span className="hero__next-count">{countdown(next.start, lang)}</span>}
            </span>
          </a>
        )}
        {!next && <ThankYou ev={recent} lang={lang} />}
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

// Sezioni ancora in costruzione: titolo nitido, sotto la bozza sfocata con il nastro (src/shared/WipBox.jsx)
function WipSection({ id, lang, kind }) {
  const tr = (v) => t(v, lang)
  return (
    <section id={id} className="sec" aria-labelledby={`${id}-title`}>
      <SectionHead id={id} title={tr(sectionLabel(id))} />
      <WipBox kind={kind} />
    </section>
  )
}

// alle 13:00 del giorno dell'evento compare un avviso che porta al menu (fino alla fine dell'evento)
// striscia sotto l'header nel giorno dell'evento: dall'inizio "è iniziato" (con indicazioni),
// dalle 13:00 "il menu è svelato", fino alla fine dell'evento
function MenuReveal({ ev, lang }) {
  const live = useLiveSettings()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])
  if (!ev) return null
  const start = new Date(ev.start).getTime()
  const end = new Date(ev.end ?? ev.start).getTime()
  if (now < start || now > end) return null
  const menuOpen = live
    ? live.menuOpen || (live.revealAt && now + (live.offset || 0) >= new Date(live.revealAt).getTime())
    : ev.menu?.revealAt && now >= new Date(ev.menu.revealAt).getTime()
  return menuOpen ? (
    <a className="menu-reveal theme-ymhs" href="/menu/">
      <span className="menu-reveal__label">{t({ it: 'È ora di pranzo', en: 'It’s lunchtime' }, lang)}</span>
      <span className="menu-reveal__text">{t({ it: 'Il menu è svelato →', en: 'The menu is revealed →' }, lang)}</span>
    </a>
  ) : (
    <a className="menu-reveal theme-ymhs" href={directionsUrl(ev)} target="_blank" rel="noopener noreferrer">
      <span className="menu-reveal__label">{t({ it: `${ev.short ?? ev.name} è iniziato`, en: `${ev.short ?? ev.name} has started` }, lang)}</span>
      <span className="menu-reveal__text">{t({ it: 'Indicazioni →', en: 'Directions →' }, lang)}</span>
    </a>
  )
}

// nei 7 giorni dopo un evento, in cima alla home: grazie e invito a seguirci
function ThankYou({ ev, lang }) {
  if (!ev) return null
  return (
    <a className="hero__next hero__thanks theme-ymhs" href={CONTACTS.instagram.url} target="_blank" rel="noopener noreferrer" style={{ clipPath: NEXT_CLIP }}>
      <span className="hero__next-label">{t({ it: 'Grazie a chi c’era', en: 'Thank you for coming' }, lang)}</span>
      <span className="hero__next-name display">{ev.name}</span>
      <span className="hero__next-date">
        {t({ it: 'Foto e prossimi incontri su Instagram →', en: 'Photos and next meetups on Instagram →' }, lang)}
      </span>
    </a>
  )
}

// invito a seguirci: è su Instagram che annunciamo i prossimi eventi
function FollowUs({ lang }) {
  return (
    <a className="follow reveal" href={CONTACTS.instagram.url} target="_blank" rel="noopener noreferrer">
      <span className="follow__label">{t({ it: 'Non perderti il prossimo evento', en: 'Don’t miss the next event' }, lang)}</span>
      <span className="follow__text">
        {t({ it: 'Seguici su Instagram', en: 'Follow us on Instagram' }, lang)} <strong>{CONTACTS.instagram.handle}</strong> →
      </span>
    </a>
  )
}

// Template evento: stessa struttura per ogni evento; cambiano accento, banner, logo e blocchi accesi.
function EventCard({ ev: base, lang, theme }) {
  const ev = useLiveEvent(base)
  const tr = (v) => t(v, lang)
  const live = isLive(ev)
  const when = live ? null : countdown(ev.start, lang)
  const settings = useLiveSettings()
  const open = settings?.signup === 'open' ? true : settings?.signup === 'closed' ? false : signupOpen(ev)
  return (
    <article className={`event reveal${ev.theme ? ` theme-${ev.theme}` : ''}`} style={{ '--accent': ev.accent, clipPath: CARD_CLIP }}>
      {ev.banner && <img className="event__banner" src={ev.banner} alt="" loading="lazy" decoding="async" />}
      <div className="event__head">
        <p className="event__kicker">
          {live ? tr({ it: 'In corso, oggi', en: 'Happening today' }) : tr({ it: 'Prossimo evento', en: 'Next event' })}
          {when && <span className="event__count">{when}</span>}
        </p>
        {ev.logo ? (
          <img className="event__logo" src={ev.logo} srcSet={ev.logoSrcSet} sizes="(min-width: 860px) 480px, 100vw" alt={ev.name} width="682" height="343" loading="lazy" decoding="async" />
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
              <a href={directionsUrl(ev)} target="_blank" rel="noopener noreferrer">
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
                {ev.signup && (
                  <span>{open ? tr(ev.signup.note) : tr({ it: 'Iscrizioni chiuse', en: 'Sign-up closed' })}</span>
                )}
              </dd>
            </div>
          )}
        </dl>
      )}
      <div className="event__actions">
        {ev.blocks.signup && open && (
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
        {ev.blocks.program && ev.program && (
          <a className="btn btn--ghost" href="/programma/">
            {tr({ it: 'Il programma', en: 'The programme' })}
          </a>
        )}
        {ev.blocks.menu && ev.menu && (
          <a className="btn btn--ghost" href="/menu/">
            {tr({ it: 'Il menu del pranzo', en: 'The lunch menu' })}
          </a>
        )}
      </div>
      <Partners ev={ev} className="event__partners" />
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
      <FollowUs lang={lang} />
    </section>
  )
}

function Archive({ lang, finished }) {
  const tr = (v) => t(v, lang)
  if (!finished.length) return <WipSection id="archivio" lang={lang} kind="archive" />
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
          {ev.blocks.program && ev.program && (
            <a className="past__link" href="/programma/">
              {tr({ it: 'Il programma', en: 'The programme' })}
            </a>
          )}
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
      <main id="main" tabIndex={-1} className="home">
        <MenuReveal ev={upcoming[0]} lang={lang} />
        <Hero next={upcoming[0]} recent={recent[0]} lang={lang} theme={theme} />
        <WipSection id="chi-siamo" lang={lang} kind="about" />
        <Events lang={lang} theme={theme} upcoming={upcoming} recent={recent} />
        <Archive lang={lang} finished={finished} />
        <Contacts lang={lang} />
      </main>
      <SiteFooter />
      <BottomNav />
    </>
  )
}
