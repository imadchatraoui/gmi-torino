import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { eventById } from '../data/events'
import { tornClip } from '../shared/Paper'
import { t, usePrefs } from '../shared/prefs'
import SiteHeader from '../shared/SiteHeader'
import { scrollToEl } from '../shared/smoothScroll'

// gmitorino.org/corposunnah: il menu in anteprima per Oumaima di Corpo e Sunnah, che l'ha pensato con noi.
// Il link si apre poche volte (OPENS in api/corposunnah.js): poi il server non consegna più il menu
// (api/corposunnah.js). Da /admin si può riattivare.
const MenuRevealed = lazy(() => import('../menu/MenuRevealed'))
const EV = eventById('ymhs')
const CLIP = tornClip(57, { depth: 3, points: 30 })

export default function CorpoPage() {
  const { lang } = usePrefs()
  const tr = (v) => t(v, lang)
  const collab = EV.menu.collab
  const [state, setState] = useState('checking') // checking | ready | opening | open | used | error
  const [options, setOptions] = useState(null)
  const [left, setLeft] = useState(1)
  const menuRef = useRef(null)

  const check = () => {
    setState('checking')
    fetch('/api/corposunnah', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setLeft(d.left ?? 1)
        setState(d.used ? 'used' : 'ready')
      })
      .catch(() => setState('error'))
  }
  useEffect(check, [])

  const openMenu = async () => {
    setState('opening')
    try {
      const r = await fetch('/api/corposunnah', { method: 'POST' })
      if (r.status === 410) return setState('used')
      if (!r.ok) throw new Error()
      const d = await r.json()
      try {
        localStorage.removeItem('gmi-menu-pos') // si parte dall'inizio del menu
      } catch {
        /* niente */
      }
      setLeft(d.left ?? 0)
      setOptions(d.options)
      setState('open')
    } catch {
      setState('error')
    }
  }

  // aperto: la pagina scivola al menu; chiudere o ricaricare chiede conferma (il link non si riapre)
  useEffect(() => {
    if (state !== 'open') return
    const id = setTimeout(() => scrollToEl(menuRef.current), 500)
    const warn = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    addEventListener('beforeunload', warn)
    return () => {
      clearTimeout(id)
      removeEventListener('beforeunload', warn)
    }
  }, [state])

  const logo = (
    <span
      className="cs-logo"
      role="img"
      aria-label={collab.name}
      style={{ '--r': collab.ratio, WebkitMaskImage: `url(${collab.logo})`, maskImage: `url(${collab.logo})` }}
    />
  )

  return (
    <>
      <SiteHeader page="menu" />
      <main id="main" tabIndex={-1} className="menu cs">
        <section id="menu-top" className="cs-hero" aria-labelledby="cs-title">
          {logo}
          <p className="cs-eyebrow">{tr({ it: 'Per Oumaima', en: 'For Oumaima' })}</p>
          <h1 id="cs-title" className="cs-title display">
            {tr({ it: 'Grazie per il menu', en: 'Thank you for the menu' })}
          </h1>
          <div className="divider" aria-hidden="true" />
          <p className="cs-text">
            {tr({
              it: `Hai pensato con noi il menu del pranzo dello ${EV.name}. Prima che lo vedano tutti, ecco come apparirà ai ragazzi.`,
              en: `You created the ${EV.name} lunch menu with us. Before everyone else sees it, here is how it will look.`,
            })}
          </p>
          <p className="cs-sign">GMI Torino</p>
        </section>

        {(state === 'ready' || state === 'opening') && (
          <section className="cs-once" style={{ clipPath: CLIP }} aria-labelledby="cs-once-title">
            <p className="cs-once__mark" aria-hidden="true">
              {left}×
            </p>
            <h2 id="cs-once-title" className="cs-once__title">
              {left > 1
                ? tr({ it: `Questo link si apre ancora ${left} volte`, en: `This link opens ${left} more times` })
                : tr({ it: 'Questo link si apre una volta sola', en: 'This link opens only once' })}
            </h2>
            <p className="cs-once__text">
              {tr({
                it: left > 1
                  ? 'Quando premi il pulsante il menu si apre qui sotto e conta come un\'apertura: tieni la pagina aperta finché non hai finito di guardarlo.'
                  : 'Quando premi il pulsante il menu si apre qui sotto. Da quel momento il link non funziona più: tieni la pagina aperta finché non hai finito di guardarlo.',
                en: left > 1
                  ? 'When you press the button the menu opens below and counts as one opening: keep this page open until you have finished.'
                  : 'When you press the button the menu opens below. From then on the link stops working: keep this page open until you have finished.',
              })}
            </p>
            <button type="button" className="btn btn--primary cs-once__btn" onClick={openMenu} disabled={state === 'opening'}>
              {state === 'opening' ? tr({ it: 'Apro il menu…', en: 'Opening…' }) : tr({ it: 'Apri il menu', en: 'Open the menu' })}
            </button>
          </section>
        )}

        {state === 'checking' && <div className="menu-loading" />}

        {state === 'used' && (
          <section className="cs-once cs-once--used" style={{ clipPath: CLIP }} aria-labelledby="cs-used-title">
            <h2 id="cs-used-title" className="cs-once__title">
              {tr({ it: 'Questo link è già stato aperto', en: 'This link has already been opened' })}
            </h2>
            <p className="cs-once__text">
              {tr({
                it: 'Le aperture sono finite. Se ti serve rivederlo, scrivi a GMI Torino: lo riattiviamo noi.',
                en: 'No openings left. If you need to see it again, write to GMI Torino and we will reactivate it.',
              })}
            </p>
          </section>
        )}

        {state === 'error' && (
          <section className="cs-once" style={{ clipPath: CLIP }}>
            <p className="cs-once__text">{tr({ it: 'Non riesco a collegarmi. Riprova tra poco.', en: 'Cannot connect. Please try again shortly.' })}</p>
            <button type="button" className="btn btn--ghost cs-once__btn" onClick={check}>
              {tr({ it: 'Riprova', en: 'Try again' })}
            </button>
          </section>
        )}

        {state === 'open' && options && (
          <div ref={menuRef} className="cs-menu">
            <p className="cs-open-note">
              {left > 0
                ? tr({ it: `Aperture rimaste: ${left}. Il menu resta qui finché tieni aperta la pagina.`, en: `Openings left: ${left}. The menu stays here while this page is open.` })
                : tr({ it: 'Il link ora è chiuso: il menu resta qui finché tieni aperta la pagina.', en: 'The link is now closed: the menu stays here while this page is open.' })}
            </p>
            <Suspense fallback={<div className="menu-loading" />}>
              <MenuRevealed options={options} />
            </Suspense>
          </div>
        )}
      </main>
    </>
  )
}
