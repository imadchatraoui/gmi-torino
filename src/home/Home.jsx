import { EVENT } from '../data/event'
import { POKES } from '../data/menu'
import PokeIllustration from '../poke/PokeIllustration'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'
import Ticker from '../shared/Ticker'

function countdown() {
  const day = 24 * 60 * 60 * 1000
  const start = new Date(EVENT.dateISO)
  const today = new Date()
  const diff = Math.round(
    (Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()) -
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
      day,
  )
  if (diff > 1) return `tra ${diff} giorni`
  if (diff === 1) return 'domani'
  if (diff === 0) return 'oggi'
  return 'grazie a chi c’era'
}

export default function Home() {
  return (
    <>
      <SiteHeader page="home" />
      <main className="home">
        <section className="hero">
          <p className="eyebrow hero__eyebrow">GMI Torino presenta</p>
          <h1 className="hero__title">
            <span className="hero__letters" aria-hidden="true">
              {EVENT.short.split('').map((c, i) => (
                <span key={i} style={{ '--i': i }}>
                  {c}
                </span>
              ))}
            </span>
            <span className="hero__name">{EVENT.name}</span>
          </h1>
          <p className="hero__edition">
            {EVENT.edition} <span aria-hidden="true">—</span> {countdown()}
          </p>
          <p className="stamp" aria-label="Il sito è in lavorazione">
            Sito in
            <br />
            lavorazione
          </p>
        </section>

        <dl className="facts">
          <div>
            <dt>Quando</dt>
            <dd>
              {EVENT.dateLabel}
              <span>{EVENT.time}</span>
            </dd>
          </div>
          <div>
            <dt>Dove</dt>
            <dd>
              <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer">
                {EVENT.venue}
              </a>
              <span>{EVENT.city}</span>
            </dd>
          </div>
          <div>
            <dt>Quota</dt>
            <dd>
              {EVENT.price}
              <span>Iscrizioni {EVENT.signupDeadline}</span>
            </dd>
          </div>
        </dl>

        <p className="lede">
          Una giornata per mettere al centro <em>noi</em>: le pressioni, le domande, le relazioni, e tutto quello che
          spesso non riusciamo a dire. Uno spazio di incontro, ascolto e confronto.
        </p>

        <div className="actions">
          <a className="menu-card" href="/menu/">
            <span className="menu-card__text">
              <span className="eyebrow">Il pranzo del summit</span>
              <span className="menu-card__title">
                Il menu <em>poke</em>
              </span>
              <span className="menu-card__sub">Scorri e aprili, un ingrediente alla volta.</span>
              <span className="menu-card__cta">
                Apri il menu <span aria-hidden="true">→</span>
              </span>
            </span>
            <span className="menu-card__bowl" aria-hidden="true">
              <PokeIllustration items={POKES[0].items} label={POKES[0].label} />
            </span>
          </a>

          <a className="btn" href={EVENT.signupUrl} target="_blank" rel="noopener noreferrer">
            <span>Iscriviti al summit</span>
            <span className="btn__meta">{EVENT.price} ↗</span>
          </a>
        </div>

        <Ticker items={EVENT.topics} label="Di cosa parleremo" />
      </main>
      <SiteFooter />
    </>
  )
}
