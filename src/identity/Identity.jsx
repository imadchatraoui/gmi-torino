import { useState } from 'react'
import Mark from '../shared/Mark'
import { useReveal } from '../shared/reveal'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'

// Guida all'identità visiva di GMI Torino: la base su cui costruire il sito ufficiale.
// I valori sono gli stessi di src/styles/base.css.

const COLORS = [
  { name: 'Teal', token: '--teal', hex: '#18ABAF', role: 'Colore primario GMI: bottoni, accenti, stati attivi.' },
  { name: 'Blu GMI', token: '--navy', hex: '#004A73', role: 'Titoli, link, marchio. Il secondo colore del gradiente.' },
  { name: 'Notte', token: '--navy-darker', hex: '#00253A', role: 'Fondi scuri: card evento, footer, barra di navigazione.' },
  { name: 'Teal scuro', token: '--teal-dark', hex: '#0A8F92', role: 'Etichette e testo accento su bianco.' },
  { name: 'Teal chiaro', token: '--teal-light', hex: '#5DC4C7', role: 'Accento su fondo scuro, fine del gradiente.' },
  { name: 'Nebbia', token: '--mist', hex: '#F1F5F9', role: 'Superfici: card, chip, bottoni secondari.' },
  { name: 'Inchiostro', token: '--fg', hex: '#0F172A', role: 'Testo principale.' },
  { name: 'Bianco', token: '--white', hex: '#FFFFFF', role: 'Fondo della pagina.' },
]

const TYPE = [
  { label: 'Titolo · 700', cls: 'type-h1', sample: 'Protagonisti noi' },
  { label: 'Sezione · 700', cls: 'type-h2', sample: 'Eventi e incontri' },
  { label: 'Sottotitolo · 600', cls: 'type-h3', sample: 'Youth Mental Health Summit' },
  { label: 'Testo · 400', cls: 'type-body', sample: 'Spazi in cui raccontarci, confrontarci e fare la nostra parte nella città.' },
  { label: 'Etichetta · 600 maiuscolo', cls: 'eyebrow', sample: 'Prossimo evento' },
]

const MOTION = [
  { name: 'Uscita morbida', value: 'cubic-bezier(0.22, 1, 0.36, 1)', text: 'Per tutto ciò che entra: veloce all’inizio, si posa piano.' },
  { name: 'Durata', value: '0.7 s', text: 'Comparse allo scroll. Micro-interazioni 0.25 s.' },
  { name: 'Sequenza', value: '90 ms', text: 'Ritardo tra elementi in fila: mai più di 4-5 passi.' },
  { name: 'Archi', value: 'dal basso', text: 'Gli archi crescono da terra, come un portico che si costruisce.' },
]

function Swatch({ c }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.hex)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* clipboard non disponibile: niente */
    }
  }
  return (
    <li className="swatch reveal">
      <button type="button" onClick={copy} aria-label={`Copia ${c.hex}`}>
        <span className="swatch__chip" style={{ background: c.hex }} />
        <span className="swatch__name">{c.name}</span>
        <span className="swatch__hex">{copied ? 'Copiato' : c.hex}</span>
        <span className="swatch__role">{c.role}</span>
      </button>
    </li>
  )
}

function ArcadeDemo() {
  const [k, setK] = useState(0)
  return (
    <div className="demo">
      <div key={k} className="demo__arcade" aria-hidden="true">
        {[2, 1, 0, 1, 2].map((n, i) => (
          <span key={i} className={`demo__arch${n === 0 ? ' demo__arch--door' : ''}${n === 2 ? ' demo__arch--far' : ''}`} style={{ '--n': n }} />
        ))}
      </div>
      <button type="button" className="btn btn--ghost demo__play" onClick={() => setK((v) => v + 1)}>
        Riproduci <span className="btn__arrow">↻</span>
      </button>
    </div>
  )
}

export default function Identity() {
  useReveal()
  return (
    <>
      <SiteHeader page="identity" />
      <main className="id">
        <section className="id-hero">
          <p className="eyebrow">Identità visiva</p>
          <h1 className="id-hero__title">
            GMI Torino, <span className="grad-text">in breve.</span>
          </h1>
          <p className="id-hero__lede">
            Parte del sistema di Giovani Musulmani d’Italia — bianco, teal, blu e Poppins — con un accento tutto
            torinese: <strong>l’arco dei portici</strong>. È la base su cui costruire il sito ufficiale.
          </p>
        </section>

        <section className="id-sec" aria-labelledby="m-t">
          <h2 id="m-t" className="id-sec__title reveal">
            <span>01</span> Marchio
          </h2>
          <div className="marks">
            <figure className="marks__item reveal">
              <div className="marks__box">
                <Mark className="marks__logo" />
              </div>
              <figcaption>Su bianco: gradiente GMI dal blu al teal.</figcaption>
            </figure>
            <figure className="marks__item reveal" style={{ '--d': 1 }}>
              <div className="marks__box marks__box--dark">
                <Mark white className="marks__logo" />
              </div>
              <figcaption>Su fondo scuro: bianco pieno.</figcaption>
            </figure>
          </div>
          <ul className="rules reveal">
            <li>Dimensione minima: 24 px di larghezza.</li>
            <li>Spazio libero intorno: almeno metà della larghezza del logo.</li>
            <li>Mai deformarlo, ruotarlo o metterlo su foto senza un fondo pieno.</li>
          </ul>
        </section>

        <section className="id-sec" aria-labelledby="c-t">
          <h2 id="c-t" className="id-sec__title reveal">
            <span>02</span> Colori
          </h2>
          <p className="id-sec__lede reveal">Gli stessi di GMI Italia. Tocca un colore per copiarne il codice.</p>
          <div className="grad-bar reveal" aria-hidden="true" />
          <ul className="swatches">
            {COLORS.map((c) => (
              <Swatch key={c.token} c={c} />
            ))}
          </ul>
        </section>

        <section className="id-sec" aria-labelledby="t-t">
          <h2 id="t-t" className="id-sec__title reveal">
            <span>03</span> Tipografia
          </h2>
          <p className="id-sec__lede reveal">Una sola famiglia: Poppins, ospitata sul sito (circa 40 KB in tutto).</p>
          <ul className="type-list">
            {TYPE.map((t, i) => (
              <li key={t.label} className="reveal" style={{ '--d': i }}>
                <span className="type-list__label">{t.label}</span>
                <span className={t.cls}>{t.sample}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="id-sec" aria-labelledby="f-t">
          <h2 id="f-t" className="id-sec__title reveal">
            <span>04</span> L’arco
          </h2>
          <p className="id-sec__lede reveal">
            Torino è la città dei portici; l’arco è anche la forma del mihrab. Lo usiamo in tre modi, sempre
            semplice, mai decorato.
          </p>
          <ul className="shapes">
            <li className="reveal">
              <span className="shapes__frame" aria-hidden="true" />
              <strong>Cornice</strong>
              <span>Per le immagini importanti.</span>
            </li>
            <li className="reveal" style={{ '--d': 1 }}>
              <span className="shapes__badge" aria-hidden="true">
                <span>1</span>
              </span>
              <strong>Numero</strong>
              <span>Per sezioni, passi e liste.</span>
            </li>
            <li className="reveal" style={{ '--d': 2 }}>
              <span className="shapes__row" aria-hidden="true" />
              <strong>Arcata</strong>
              <span>Per chiudere o dividere.</span>
            </li>
          </ul>
          <p className="id-note reveal">
            Angoli: 10 px per elementi piccoli, 20 px per le card, pillola per i bottoni.
          </p>
        </section>

        <section className="id-sec" aria-labelledby="mo-t">
          <h2 id="mo-t" className="id-sec__title reveal">
            <span>05</span> Movimento
          </h2>
          <p className="id-sec__lede reveal">
            Poco e con un motivo. Si animano solo posizione e trasparenza, così resta fluido anche su telefoni
            economici; chi ha attivato “riduci movimento” vede tutto fermo.
          </p>
          <ArcadeDemo />
          <dl className="motion">
            {MOTION.map((m, i) => (
              <div key={m.name} className="reveal" style={{ '--d': i }}>
                <dt>{m.name}</dt>
                <dd>
                  <code>{m.value}</code>
                  <span>{m.text}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="id-sec" aria-labelledby="co-t">
          <h2 id="co-t" className="id-sec__title reveal">
            <span>06</span> Componenti
          </h2>
          <div className="comp reveal">
            <a className="btn btn--primary" href="#co-t">
              Iscriviti <span className="btn__arrow">↗</span>
            </a>
            <a className="btn btn--ghost" href="#co-t">
              Scopri di più <span className="btn__arrow">→</span>
            </a>
            <p className="hero__status">
              <span className="hero__dot" aria-hidden="true" />
              Sito in costruzione
            </p>
          </div>
        </section>

        <section className="id-sec" aria-labelledby="v-t">
          <h2 id="v-t" className="id-sec__title reveal">
            <span>07</span> Voce
          </h2>
          <ul className="voice">
            <li className="reveal">
              <strong>Diciamo “noi”.</strong> Parliamo da giovani a giovani, in italiano semplice e diretto.
            </li>
            <li className="reveal" style={{ '--d': 1 }}>
              <strong>Frasi brevi.</strong> Una cosa per frase: data, luogo, cosa fare.
            </li>
            <li className="reveal" style={{ '--d': 2 }}>
              <strong>Niente emoji né frasi fatte.</strong> Il tono è caldo ma sobrio.
            </li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
