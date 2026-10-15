import { useState } from 'react'
import PokeIllustration from '../poke/PokeIllustration'
import { POKES } from '../data/menu'
import { t, usePrefs } from '../shared/prefs'
import { useReveal } from '../shared/reveal'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'
import { Corner, Lace, tornClip } from '../shared/Paper'
import { Cupola, Fregio } from '../shared/Ricamo'

// Guida all'identità di GMI Torino: la base su cui costruire il sito ufficiale e ogni evento.
// I valori sono gli stessi di src/styles/base.css.

const COLORS = [
  { name: 'Crema', hex: '#FFFCEB', role: { it: 'Fondo del tema chiaro. È il crema del logo.', en: 'Light theme background. The cream of the logo.' } },
  { name: 'Bordeaux', hex: '#6E0B0E', role: { it: 'Colore del logo: titoli, bottoni, barra di navigazione.', en: 'The logo colour: headings, buttons, navigation bar.' } },
  { name: 'Bordeaux vivo', hex: '#8F1A1E', role: { it: 'Stato premuto e passaggio del mouse.', en: 'Pressed and hover states.' } },
  { name: 'Oro', hex: '#C99434', role: { it: 'Ornamenti e filetti. Mai per testo piccolo su crema.', en: 'Ornaments and rules. Never small text on cream.' } },
  { name: 'Oro testo', hex: '#8A5F12', role: { it: 'Etichette e piccoli testi d’accento su crema.', en: 'Labels and small accent text on cream.' } },
  { name: 'Bordeaux notte', hex: '#1C0709', role: { it: 'Fondo del tema scuro.', en: 'Dark theme background.' } },
  { name: 'Inchiostro', hex: '#2B0A0C', role: { it: 'Testo principale nel tema chiaro.', en: 'Body text in the light theme.' } },
  { name: 'Crema scuro', hex: '#FBF3DA', role: { it: 'Superfici: schede e bottoni secondari.', en: 'Surfaces: cards and secondary buttons.' } },
]

const ACCENTS = [
  { name: 'YMHS', hex: '#8F9C7D' },
  { name: { it: 'Esempio', en: 'Example' }, hex: '#B88A5A' },
  { name: { it: 'Esempio', en: 'Example' }, hex: '#6C86B0' },
]

const DEMO_CLIP = tornClip(14, { depth: 5 })

function Swatch({ c, lang }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.hex)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      /* appunti non disponibili */
    }
  }
  return (
    <li className="swatch reveal">
      <button type="button" onClick={copy} aria-label={`${t({ it: 'Copia', en: 'Copy' }, lang)} ${c.hex}`}>
        <span className="swatch__chip" style={{ background: c.hex }} />
        <span className="swatch__name">{c.name}</span>
        <span className="swatch__hex">{copied ? t({ it: 'Copiato', en: 'Copied' }, lang) : c.hex}</span>
        <span className="swatch__role">{t(c.role, lang)}</span>
      </button>
    </li>
  )
}

function IntroDemo({ lang, theme }) {
  const [k, setK] = useState(0)
  return (
    <div className="intro-demo">
      <div className="intro-demo__logo">
        <video
          key={`${k}-${theme}`}
          src={theme === 'dark' ? '/brand/gmi-torino-intro-d.mp4' : '/brand/gmi-torino-intro-l.mp4'}
          muted
          playsInline
          autoPlay
          preload="metadata"
          width="400"
          height="456"
        />
      </div>
      <button type="button" className="btn btn--ghost" onClick={() => setK((v) => v + 1)}>
        {t({ it: 'Riproduci', en: 'Play again' }, lang)}
      </button>
    </div>
  )
}

export default function Design() {
  const { lang, theme } = usePrefs()
  const tr = (v) => t(v, lang)
  useReveal()

  return (
    <>
      <SiteHeader page="design" />
      <main className="id">
        <section className="id-hero">
          <p className="id-kicker">Design</p>
          <h1 className="id-hero__title">{tr({ it: 'L’identità di GMI Torino', en: 'The GMI Torino identity' })}</h1>
          <p className="id-hero__lede">
            {tr({
              it: 'Il nostro logo nei suoi colori, bordeaux, crema e oro, un solo font per il testo. Ogni evento può portare il suo stile dentro la sua scheda. Questa pagina è la base per il sito ufficiale: se qualcosa non è qui, prima si aggiunge qui.',
              en: 'Our logo in its own colours, burgundy, cream and gold, one typeface for text. Each event can bring its own style inside its card. This page is the basis for the official website: if something is not here, add it here first.',
            })}
          </p>
        </section>

        <section className="id-sec" aria-labelledby="m-t">
          <h2 id="m-t" className="id-sec__title reveal">
            {tr({ it: 'Marchio', en: 'Logo' })}
          </h2>
          <div className="marks">
            <figure className="marks__item reveal">
              <div className="marks__box">
                <img src="/brand/gmi-torino-320.png" alt="GMI Torino" width="320" height="394" />
              </div>
              <figcaption>{tr({ it: 'Su crema: il logo così com’è.', en: 'On cream: the logo as it is.' })}</figcaption>
            </figure>
            <figure className="marks__item reveal" style={{ '--d': 1 }}>
              <div className="marks__box marks__box--dark">
                <img src="/brand/gmi-torino-scuro-320.png" alt="" width="320" height="394" />
              </div>
              <figcaption>{tr({ it: 'Su fondo scuro: stesso PNG, bordeaux schiarito.', en: 'On dark backgrounds: same PNG, lightened burgundy.' })}</figcaption>
            </figure>
          </div>
          <ul className="rules reveal">
            <li>{tr({ it: 'Mai ricolorarlo, deformarlo o ruotarlo.', en: 'Never recolour, stretch or rotate it.' })}</li>
            <li>{tr({ it: 'Larghezza minima 28 px; intorno, spazio libero pari a metà della sua larghezza.', en: 'Minimum width 28 px; clear space of half its width around it.' })}</li>
            <li>{tr({ it: 'File: public/brand/gmi-torino-*.png e gmi-torino-scuro-*.png (trasparenti). Niente cerchi o riquadri intorno.', en: 'Files: public/brand/gmi-torino-*.png and gmi-torino-scuro-*.png (transparent). No discs or boxes around it.' })}</li>
          </ul>
          <h3 className="id-sub reveal">{tr({ it: 'Il logo che si costruisce', en: 'The logo building itself' })}</h3>
          <p className="id-sec__lede reveal">
            {tr({
              it: 'All’apertura del sito si disegna prima la Mole, poi compare il logo. Una volta per visita, si salta con un tocco. Due video (chiaro e scuro, 109 e 164 KB) al posto della GIF da 3 MB.',
              en: 'When the site opens, the Mole is drawn first, then the logo appears. Once per visit, skippable with a tap. Two videos (light and dark, 109 and 164 KB) instead of the 3 MB GIF.',
            })}
          </p>
          <IntroDemo lang={lang} theme={theme} />
        </section>

        <section className="id-sec" aria-labelledby="c-t">
          <h2 id="c-t" className="id-sec__title reveal">
            {tr({ it: 'Colori', en: 'Colours' })}
          </h2>
          <p className="id-sec__lede reveal">
            {tr({
              it: 'Presi dal logo e dalle locandine di GMI Torino. Tocca un colore per copiarne il codice.',
              en: 'Taken from the GMI Torino logo and posters. Tap a colour to copy its code.',
            })}
          </p>
          <ul className="swatches">
            {COLORS.map((c) => (
              <Swatch key={c.hex} c={c} lang={lang} />
            ))}
          </ul>
        </section>

        <section className="id-sec" aria-labelledby="t-t">
          <h2 id="t-t" className="id-sec__title reveal">
            {tr({ it: 'Tipografia', en: 'Type' })}
          </h2>
          <p className="id-sec__lede reveal">
            {tr({
              it: 'Un solo font per il testo: SF Pro, il font dell’iPhone (zero byte da scaricare; sugli altri telefoni il loro font di sistema). Titoli in Semibold 600. Solo i titoli degli eventi usano un serif come nelle locandine: Bodoni Moda.',
              en: 'One typeface for text: SF Pro, the iPhone font (nothing to download; other phones use their system font). Headings in Semibold 600. Only event titles use a serif like the posters: Bodoni Moda.',
            })}
          </p>
          <ul className="type-list">
            <li className="reveal">
              <span className="type-list__label">{tr({ it: 'Titolo · 600', en: 'Heading · 600' })}</span>
              <span className="type-h1">{tr({ it: 'Prossimamente', en: 'Coming soon' })}</span>
            </li>
            <li className="reveal">
              <span className="type-list__label">{tr({ it: 'Sezione · 600', en: 'Section · 600' })}</span>
              <span className="type-h2">{tr({ it: 'Il menu del pranzo', en: 'The lunch menu' })}</span>
            </li>
            <li className="reveal">
              <span className="type-list__label">{tr({ it: 'Testo · 400', en: 'Body · 400' })}</span>
              <span className="type-body">
                {tr({
                  it: 'Ci troviamo per stare insieme, imparare e fare la nostra parte nella città.',
                  en: 'We meet to spend time together, learn and do our part in the city.',
                })}
              </span>
            </li>
            <li className="reveal">
              <span className="type-list__label">{tr({ it: 'Titolo evento · Bodoni Moda', en: 'Event title · Bodoni Moda' })}</span>
              <span className="type-event display">Youth Mental Health Summit</span>
            </li>
            <li className="reveal">
              <span className="type-list__label">{tr({ it: 'Etichetta · 600, maiuscolo spaziato', en: 'Label · 600, spaced caps' })}</span>
              <span className="type-label">{tr({ it: 'Prossimo evento', en: 'Next event' })}</span>
            </li>
            <li className="reveal">
              <span className="type-list__label">{tr({ it: 'Unica eccezione: la calligrafia', en: 'The one exception: calligraphy' })}</span>
              <span className="type-ar" lang="ar" dir="rtl">
                إن شاء الله
              </span>
            </li>
          </ul>
        </section>

        <section className="id-sec" aria-labelledby="cu-t">
          <h2 id="cu-t" className="id-sec__title reveal">{tr({ it: 'La cupola ricamata', en: 'The embroidered dome' })}</h2>
          <p className="id-sec__lede reveal">
            {tr({
              it: 'Nel nostro logo la cupola della Mole è riempita da un arabesco: Torino e arte islamica nello stesso segno. Sul sito la ridisegniamo a tratto: la cupola intera chiude l’apertura della home e si disegna da sola; una fascia più piccola, il fregio, separa le sezioni.',
              en: 'In our logo the dome of the Mole is filled with an arabesque: Turin and Islamic art in one sign. On the site we redraw it as line art: the whole dome closes the home page opening and draws itself; a smaller band, the frieze, separates sections.',
            })}
          </p>
          <div className="cupola-demo" data-reveal>
            <Cupola />
          </div>
          <Fregio className="fregio-demo" />
        </section>

        <section className="id-sec" aria-labelledby="to-t">
          <h2 id="to-t" className="id-sec__title reveal">{tr({ it: 'Lo stile di un evento: YMHS', en: 'An event’s own style: YMHS' })}</h2>
          <p className="id-sec__lede reveal">
            {tr({
              it: 'Un evento può avere il suo stile, ma solo dentro le sue cose: la sua scheda in Eventi e la sua pagina del menu. Per il YMHS è lo stile delle locandine: carta, salvia strappata, blu, pizzo, filetti col rombo, titoli in serif. Il resto del sito resta GMI Torino.',
              en: 'An event can have its own style, but only inside its own things: its card in Events and its menu page. For YMHS it is the poster style: paper, torn sage, blue, lace, diamond rules, serif titles. The rest of the site stays GMI Torino.',
            })}
          </p>
          <div className="paper-demo theme-ymhs reveal">
            <Corner />
            <div className="paper-demo__card" style={{ clipPath: DEMO_CLIP }}>
              <span className="paper-demo__label">{tr({ it: 'Prossimo evento', en: 'Next event' })}</span>
              <span className="paper-demo__title display">Youth Mental Health Summit</span>
            </div>
            <div className="divider" aria-hidden="true" />
            <Lace />
          </div>
        </section>

        <section className="id-sec" aria-labelledby="e-t">
          <h2 id="e-t" className="id-sec__title reveal">{tr({ it: 'Template evento', en: 'Event template' })}</h2>
          <p className="id-sec__lede reveal">
            {tr({
              it: 'Ogni evento usa la stessa struttura e gli stessi colori. Cambiano solo: un colore d’accento (un alone tenue, mai pieno), il banner, il logo dell’evento e quali blocchi mostrare: info, iscrizione, programma, menu. Un giorno dopo la fine l’evento passa da solo in Archivio.',
              en: 'Every event uses the same structure and colours. Only these change: one accent colour (a soft glow, never solid), the banner, the event logo and which blocks to show: info, sign-up, programme, menu. One day after it ends, the event moves to the Archive by itself.',
            })}
          </p>
          <ul className="accents">
            {ACCENTS.map((a) => (
              <li key={a.hex} className="accent-card reveal" style={{ '--accent': a.hex }}>
                <span className="accent-card__name">{tr(a.name)}</span>
                <span className="accent-card__hex">{a.hex}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="id-sec" aria-labelledby="mo-t">
          <h2 id="mo-t" className="id-sec__title reveal">{tr({ it: 'Movimento', en: 'Motion' })}</h2>
          <p className="id-sec__lede reveal">
            {tr({
              it: 'Un solo momento forte per pagina: all’apertura il logo che si costruisce, nel menu la ciotola che si apre. Si animano solo posizione e trasparenza, così resta fluido anche su telefoni economici. Con “riduci movimento” tutto è fermo.',
              en: 'One strong moment per page: the logo building itself when the site opens, the bowl opening on the menu. Only position and opacity are animated, so it stays smooth on cheap phones. With “reduce motion” everything stands still.',
            })}
          </p>
          <div className="bowl-demo reveal">
            <PokeIllustration items={POKES[0].items} label={tr(POKES[0].label)} open />
          </div>
          <dl className="motion">
            <div className="reveal">
              <dt>{tr({ it: 'Curva', en: 'Easing' })}</dt>
              <dd>
                <code>cubic-bezier(0.22, 1, 0.36, 1)</code>
              </dd>
            </div>
            <div className="reveal">
              <dt>{tr({ it: 'Durate', en: 'Durations' })}</dt>
              <dd>{tr({ it: '0,25 s tocchi · 0,7 s comparse · 1–1,4 s il momento forte', en: '0.25 s taps · 0.7 s reveals · 1–1.4 s the strong moment' })}</dd>
            </div>
          </dl>
        </section>

        <section className="id-sec" aria-labelledby="co-t">
          <h2 id="co-t" className="id-sec__title reveal">{tr({ it: 'Componenti', en: 'Components' })}</h2>
          <div className="comp reveal">
            <a className="btn btn--primary" href="#co-t">
              {tr({ it: 'Iscriviti', en: 'Sign up' })}
            </a>
            <a className="btn btn--ghost" href="#co-t">
              {tr({ it: 'Il menu del pranzo', en: 'The lunch menu' })}
            </a>
            <p className="hero__status">
              <span className="hero__dot" aria-hidden="true" />
              {tr({ it: 'Sito in costruzione', en: 'Site under construction' })}
            </p>
          </div>
        </section>

        <section className="id-sec" aria-labelledby="v-t">
          <h2 id="v-t" className="id-sec__title reveal">{tr({ it: 'Voce', en: 'Voice' })}</h2>
          <ul className="voice">
            <li className="reveal">
              <strong>{tr({ it: 'Diciamo “noi”.', en: 'We say “we”.' })}</strong>
              {tr({ it: 'Da giovani a giovani, in italiano semplice e diretto.', en: 'From young people to young people, in plain words.' })}
            </li>
            <li className="reveal">
              <strong>{tr({ it: 'Frasi brevi.', en: 'Short sentences.' })}</strong>
              {tr({ it: 'Una cosa per frase: data, luogo, cosa fare.', en: 'One thing per sentence: date, place, what to do.' })}
            </li>
            <li className="reveal">
              <strong>{tr({ it: 'Il nome non si traduce.', en: 'The name is never translated.' })}</strong>
              {tr({
                it: '“Giovani Musulmani d’Italia” resta in italiano anche nella versione inglese.',
                en: '“Giovani Musulmani d’Italia” stays in Italian in the English version too.',
              })}
            </li>
            <li className="reveal">
              <strong>{tr({ it: 'Niente emoji né frasi fatte.', en: 'No emoji, no clichés.' })}</strong>
              {tr({ it: 'Caldo ma sobrio. Inshallah si scrive così.', en: 'Warm but sober. Inshallah is written like this.' })}
            </li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
