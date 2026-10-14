import { EVENT } from '../data/event'
import { POKES } from '../data/menu'
import PokeScroll from '../poke/PokeScroll'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'

export default function MenuPage() {
  return (
    <>
      <SiteHeader page="menu" />
      <main className="menu">
        <section className="menu-intro">
          <p className="eyebrow">
            {EVENT.short} <span aria-hidden="true">·</span> Pranzo <span aria-hidden="true">·</span> 25.10
          </p>
          <h1 className="menu-intro__title">
            Il menu <em>del pranzo</em>
          </h1>
          <p className="menu-intro__lede">
            Due proposte di poke. Scorri: il coperchio si apre e gli ingredienti escono uno alla volta.
          </p>
          <nav className="jump" aria-label="Vai al poke">
            {POKES.map((p, i) => (
              <a key={p.id} href={`#${p.id}`}>
                <span className="jump__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="jump__title">{p.title}</span>
                <span aria-hidden="true">↓</span>
              </a>
            ))}
          </nav>
        </section>

        {POKES.map((p, i) => (
          <PokeScroll key={p.id} poke={p} index={i} />
        ))}

        <section className="recap" aria-labelledby="recap-title">
          <h2 id="recap-title" className="recap__title">
            In breve
          </h2>
          <div className="recap__grid">
            {POKES.map((p) => (
              <article key={p.id} className="recap__card">
                <p className="eyebrow">{p.label}</p>
                <h3>{p.title}</h3>
                <ol>
                  {p.items.map((it) => (
                    <li key={it.name}>{it.name}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
          <p className="recap__note">Allergie o intolleranze? Chiedi allo staff al banco del pranzo.</p>
        </section>

        <figure className="verse">
          <blockquote>
            «O voi che credete, mangiate le cose buone di cui vi abbiamo provvisto e ringraziate Allah, se è Lui che
            adorate.»
          </blockquote>
          <figcaption>Corano, Al-Baqarah · 2:172</figcaption>
        </figure>
      </main>
      <SiteFooter />
    </>
  )
}
