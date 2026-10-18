import { lazy, Suspense, useEffect, useState } from 'react'
import { eventById } from '../data/events'
import PokeIllustration from '../poke/PokeIllustration'
import Intro from '../shared/Intro'
import { useMenu } from '../shared/menuApi'
import { t, usePrefs } from '../shared/prefs'
import Partners from '../shared/Partners'
import ShareButton from '../shared/ShareButton'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'

// Il menu del prossimo evento con menu. gmitorino.org/menu resta sempre questo indirizzo.
// I piatti sono segreti fino all'ora di pranzo: arrivano da /api/menu (vedi src/shared/menuApi.js).
const EVENT = eventById('ymhs')
const MenuRevealed = lazy(() => import('./MenuRevealed'))

const pad = (n) => String(n).padStart(2, '0')

// conto alla rovescia: giorni finché manca più di un giorno, poi ore:minuti:secondi
function Countdown({ revealAt, offset, lang }) {
  const target = new Date(revealAt).getTime()
  const [now, setNow] = useState(() => Date.now() + offset)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now() + offset), 1000)
    return () => clearInterval(id)
  }, [offset])
  const left = Math.max(0, target - now)
  const days = Math.floor(left / 86400000)
  if (days >= 1) {
    return <>{t({ it: days === 1 ? 'tra 1 giorno' : `tra ${days} giorni`, en: days === 1 ? 'in 1 day' : `in ${days} days` }, lang)}</>
  }
  const s = Math.floor(left / 1000)
  return (
    <span className="menu-wait__clock" aria-label={t({ it: 'Tempo che manca', en: 'Time left' }, lang)}>
      {pad(Math.floor(s / 3600))}:{pad(Math.floor((s % 3600) / 60))}:{pad(s % 60)}
    </span>
  )
}

function MenuWait({ menu, lang }) {
  const tr = (v) => t(v, lang)
  const when = new Date(menu.revealAt)
  const day = when.toLocaleDateString(lang === 'en' ? 'en-GB' : 'it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Rome' })
  const hour = when.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' })
  if (menu.status === 'error') {
    return (
      <section className="menu-wait" aria-live="polite">
        <p className="menu-wait__label">{tr({ it: 'Il menu', en: 'The menu' })}</p>
        <p className="menu-wait__text">
          {tr({ it: 'Non riusciamo a caricare il menu. Controlla la connessione e riprova.', en: 'We could not load the menu. Check your connection and try again.' })}
        </p>
        <button type="button" className="menu-share" onClick={() => location.reload()}>
          <span>{tr({ it: 'Riprova', en: 'Try again' })}</span>
        </button>
      </section>
    )
  }
  return (
    <section className="menu-wait" aria-live="polite">
      <div className="menu-wait__bowl" aria-hidden="true">
        <PokeIllustration items={[]} label="YMHS" markers={false} />
      </div>
      <p className="menu-wait__label">{tr({ it: 'Il menu è una sorpresa', en: 'The menu is a surprise' })}</p>
      <p className="menu-wait__count display">
        <Countdown revealAt={menu.revealAt} offset={menu.offset} lang={lang} />
      </p>
      <p className="menu-wait__text">
        {tr({
          it: `Si scopre qui ${day} alle ${hour}, all'ora di pranzo. Puoi lasciare la pagina aperta: si svela da sola.`,
          en: `It is revealed here on ${day} at ${hour}, at lunchtime. You can leave this page open: it will reveal itself.`,
        })}
      </p>
    </section>
  )
}

export default function MenuPage() {
  const { lang } = usePrefs()
  const ev = EVENT
  const { note, meal, revealAt } = ev.menu
  const menu = useMenu(revealAt)
  const open = menu.status === 'open'
  const tr = (v) => t(v, lang)

  return (
    <>
      <Intro />
      <SiteHeader page="menu" />
      <main id="main" tabIndex={-1} className="menu" style={{ '--accent': ev.accent }}>
        <section id="menu-top" className="menu-hero" aria-labelledby="menu-title">
          {ev.logo ? (
            <img className="menu-hero__logo" src={ev.logo} srcSet={ev.logoSrcSet} sizes="(min-width: 640px) 600px, 100vw" alt={ev.name} width="682" height="343" />
          ) : (
            <p className="menu-hero__event">{ev.name}</p>
          )}
          <h1 id="menu-title" className="menu-hero__title display">
            {tr({ it: 'Il menu del pranzo', en: 'The lunch menu' })}
          </h1>
          <div className="divider" aria-hidden="true" />
          <p className="menu-hero__date display">{ev.dayMonth}</p>
          <p className="menu-hero__meta">
            {ev.venue}, {ev.city}
            <br />
            {ev.time}
          </p>
          {open && (
          <p className="menu-hero__lede">
            {tr({
              it: 'Due poke, ne scegli uno. Scorri: il coperchio si apre e ti presentiamo gli ingredienti uno alla volta.',
              en: 'Two poke bowls, you pick one. Scroll down: the lid comes off and we introduce the ingredients one at a time.',
            })}
          </p>
          )}
        </section>

        {open ? (
          <Suspense fallback={<div className="menu-loading" />}>
            <MenuRevealed options={menu.options} />
          </Suspense>
        ) : menu.status === 'loading' ? (
          <div className="menu-loading" />
        ) : (
          <MenuWait menu={menu} lang={lang} />
        )}

        <section id="menu-end" className="menu-end" aria-label={tr(meal)}>
          <p className="menu-note">{tr(note)}</p>
          <Partners ev={ev} className="menu-partners" />
          {open && (
          <ShareButton
            className="menu-share"
            title={tr({ it: 'Il menu del pranzo · YMHS', en: 'The lunch menu · YMHS' })}
            label={tr({ it: 'Condividi il menu', en: 'Share the menu' })}
          />
          )}
          <figure className="verse">
            <blockquote>
              <p className="verse__ar" lang="ar" dir="rtl">
                يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِن طَيِّبَاتِ مَا رَزَقْنَاكُمْ وَاشْكُرُوا لِلَّهِ إِن كُنتُمْ إِيَّاهُ تَعْبُدُونَ
              </p>
              <p className="verse__tr">
                {tr({
                  it: '«O voi che credete, mangiate le cose buone di cui vi abbiamo provvisto e ringraziate Allah, se è Lui che adorate.»',
                  en: '“O you who believe, eat of the good things We have provided for you and be grateful to Allah, if it is Him you worship.”',
                })}
              </p>
            </blockquote>
            <figcaption>{tr({ it: 'Corano, Al-Baqarah 2:172', en: 'Quran, Al-Baqarah 2:172' })}</figcaption>
          </figure>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
