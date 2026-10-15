import { ABOUT, ARCHIVE, CONTACTS, UPCOMING } from '../data/site'
import BottomNav from '../shared/BottomNav'
import { useReveal } from '../shared/reveal'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'

function daysTo(iso) {
  const day = 24 * 60 * 60 * 1000
  const d = new Date(iso)
  const t = new Date()
  const diff = Math.round(
    (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())) /
      day,
  )
  if (diff > 1) return `tra ${diff} giorni`
  if (diff === 1) return 'domani'
  if (diff === 0) return 'oggi'
  return null
}

function SectionHead({ id, index, title, children }) {
  return (
    <header className="sec-head">
      <p className="sec-head__index reveal" aria-hidden="true">
        <span>{String(index).padStart(2, '0')}</span>
      </p>
      <h2 id={`${id}-title`} className="sec-head__title reveal" style={{ '--d': 1 }}>
        {title}
      </h2>
      {children && (
        <p className="sec-head__lede reveal" style={{ '--d': 2 }}>
          {children}
        </p>
      )}
    </header>
  )
}

function Hero({ next }) {
  const arches = [-2, -1, 0, 1, 2]
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <p className="hero__status">
        <span className="hero__dot" aria-hidden="true" />
        Sito in costruzione
      </p>
      <h1 id="hero-title" className="hero__title">
        <span className="line">
          <span>Protagonisti</span>
        </span>
        <span className="line">
          <span>noi,</span>
        </span>
        <span className="line">
          <span className="grad-text">a Torino.</span>
        </span>
      </h1>
      <p className="hero__lede">
        La sezione torinese di Giovani Musulmani d’Italia: incontri, talk e comunità per i giovani della città.
      </p>

      <div className="arcade" aria-label="Prossimo evento">
        {arches.map((n) =>
          n === 0 ? (
            <a key={n} className="arcade__arch arcade__arch--door" href="#eventi" style={{ '--n': 0 }}>
              <span className="arcade__door-text">
                <span className="arcade__kicker">Prossimo evento</span>
                <span className="arcade__big">{next.short}</span>
                <span className="arcade__date">25.10</span>
              </span>
            </a>
          ) : (
            <span
              key={n}
              className={`arcade__arch${Math.abs(n) === 2 ? ' arcade__arch--far' : ''}`}
              style={{ '--n': Math.abs(n) }}
              aria-hidden="true"
            />
          ),
        )}
        <span className="arcade__ground" aria-hidden="true" />
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="chi-siamo" className="sec" aria-labelledby="chi-siamo-title">
      <SectionHead id="chi-siamo" index={1} title="Chi siamo">
        {ABOUT.lede}
      </SectionHead>
      <div className="about__body">
        {ABOUT.body.map((p, i) => (
          <p key={i} className="reveal" style={{ '--d': i }}>
            {p}
          </p>
        ))}
      </div>
      <h3 className="about__path-title reveal">Il cammino di crescita</h3>
      <ol className="path">
        {ABOUT.path.map((s, i) => (
          <li key={s.title} className="path__step reveal" style={{ '--d': i }}>
            <span className="path__arch" aria-hidden="true">
              {i + 1}
            </span>
            <span className="path__title">{s.title}</span>
            <span className="path__text">{s.text}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Events() {
  return (
    <section id="eventi" className="sec" aria-labelledby="eventi-title">
      <SectionHead id="eventi" index={2} title="Eventi" />
      {UPCOMING.map((ev) => {
        const when = daysTo(ev.dateISO)
        return (
          <article key={ev.id} className="event reveal">
            <div className="event__top">
              <p className="event__kicker">{ev.kicker}</p>
              {when && <p className="event__count">{when}</p>}
            </div>
            <p className="event__short" aria-hidden="true">
              {ev.short.split('').map((c, i) => (
                <span key={i} style={{ '--i': i }}>
                  {c}
                </span>
              ))}
            </p>
            <h3 className="event__title">{ev.title}</h3>
            <p className="event__text">{ev.text}</p>
            <dl className="event__facts">
              <div>
                <dt>Quando</dt>
                <dd>
                  {ev.date}
                  <span>{ev.time}</span>
                </dd>
              </div>
              <div>
                <dt>Dove</dt>
                <dd>
                  <a href={ev.mapsUrl} target="_blank" rel="noopener noreferrer">
                    {ev.venue}
                  </a>
                  <span>{ev.city}</span>
                </dd>
              </div>
              <div>
                <dt>Quota</dt>
                <dd>
                  {ev.price}
                  <span>{ev.signup.note}</span>
                </dd>
              </div>
            </dl>
            <div className="event__actions">
              <a className="btn btn--primary" href={ev.signup.url} target="_blank" rel="noopener noreferrer">
                Iscriviti <span className="btn__arrow">↗</span>
              </a>
              <a className="btn btn--on-dark" href={ev.extra.href}>
                {ev.extra.label} <span className="btn__arrow">→</span>
              </a>
            </div>
          </article>
        )
      })}
    </section>
  )
}

function Archive() {
  return (
    <section id="archivio" className="sec" aria-labelledby="archivio-title">
      <SectionHead id="archivio" index={3} title="Archivio">
        Gli incontri che abbiamo già vissuto insieme.
      </SectionHead>
      {ARCHIVE.map((a) => (
        <article key={a.id} className="past" aria-labelledby={`${a.id}-t`}>
          <figure className="past__cover arch-frame" data-reveal>
            <span className="past__cover-in">
              <img src={a.cover} alt={`Locandina di ${a.title}`} width="720" height="896" loading="lazy" decoding="async" />
            </span>
          </figure>
          <div className="past__info">
            <p className="eyebrow reveal">{a.date}</p>
            <h3 id={`${a.id}-t`} className="past__title reveal" style={{ '--d': 1 }}>
              {a.title}
            </h3>
            <p className="past__sub reveal" style={{ '--d': 2 }}>
              {a.subtitle}
            </p>
            <p className="past__venue reveal" style={{ '--d': 3 }}>
              {a.venue}
              <span>{a.address}</span>
            </p>
          </div>
          <div className="talks">
            <p className="talks__label">
              {a.talks.length} incontri <span aria-hidden="true">· scorri →</span>
            </p>
            <ul className="talks__rail">
              {a.talks.map((t) => (
                <li key={t.img} className="talk">
                  <img
                    src={`/archivio/${a.id}/${t.img}.webp`}
                    alt=""
                    width="560"
                    height="700"
                    loading="lazy"
                    decoding="async"
                  />
                  <p className="talk__title">{t.title}</p>
                  <p className="talk__who">{t.who}</p>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  )
}

function Contacts() {
  const rows = [
    { href: CONTACTS.instagram.url, label: 'Instagram', value: CONTACTS.instagram.handle, ext: true },
    { href: `mailto:${CONTACTS.email}`, label: 'Email', value: CONTACTS.email },
    { href: CONTACTS.national.url, label: 'GMI Italia', value: CONTACTS.national.label, ext: true },
  ]
  return (
    <section id="contatti" className="sec" aria-labelledby="contatti-title">
      <SectionHead id="contatti" index={4} title="Contatti">
        Vuoi partecipare, proporre un’idea o collaborare con noi? Scrivici.
      </SectionHead>
      <ul className="contacts">
        {rows.map((r, i) => (
          <li key={r.label} className="reveal" style={{ '--d': i }}>
            <a href={r.href} {...(r.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <span className="contacts__label">{r.label}</span>
              <span className="contacts__value">{r.value}</span>
              <span className="contacts__arrow" aria-hidden="true">
                {r.ext ? '↗' : '→'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Home() {
  useReveal()
  return (
    <>
      <SiteHeader page="home" />
      <main className="home">
        <Hero next={UPCOMING[0]} />
        <About />
        <Events />
        <Archive />
        <Contacts />
      </main>
      <SiteFooter />
      <BottomNav />
    </>
  )
}
