import { eventById } from '../data/events'
import PokeIllustration from '../poke/PokeIllustration'
import PokeScroll from '../poke/PokeScroll'
import Intro from '../shared/Intro'
import { t, usePrefs } from '../shared/prefs'
import SiteFooter from '../shared/SiteFooter'
import SiteHeader from '../shared/SiteHeader'
import Skyline from '../shared/Skyline'

// Il menu del prossimo evento con menu. gmitorino.org/menu resta sempre questo indirizzo.
const EVENT = eventById('ymhs')

export default function MenuPage() {
  const { lang } = usePrefs()
  const ev = EVENT
  const { options, note, meal } = ev.menu
  const tr = (v) => t(v, lang)

  return (
    <>
      <Intro />
      <SiteHeader page="menu" />
      <main className="menu" style={{ '--accent': ev.accent }}>
        <section className="menu-hero" aria-labelledby="menu-title">
          <p className="menu-hero__event">
            {ev.logo ? <img src={ev.logo} alt="" /> : null}
            {ev.name}
          </p>
          <h1 id="menu-title" className="menu-hero__title">
            {tr({ it: 'Il menu del pranzo', en: 'The lunch menu' })}
          </h1>
          <p className="menu-hero__meta">
            {tr(ev.date)}
            <br />
            {ev.venue}
          </p>
          <p className="menu-hero__lede">
            {tr({
              it: 'Due poke, ne scegli uno. Scorri: il coperchio si apre e ti presentiamo gli ingredienti uno alla volta.',
              en: 'Two poke bowls, you pick one. Scroll down: the lid comes off and we introduce the ingredients one at a time.',
            })}
          </p>
        </section>

        <section className="choices" aria-label={tr({ it: 'Le due proposte', en: 'The two options' })}>
          {options.map((p) => (
            <a key={p.id} className="choice" href={`#${p.id}`}>
              <span className="choice__bowl" aria-hidden="true">
                <PokeIllustration items={p.items} label={tr(p.label)} open markers={false} />
              </span>
              <span className="choice__text">
                <span className="choice__label">{tr(p.label)}</span>
                <span className="choice__title">{tr(p.title)}</span>
                <span className="choice__items">{p.items.map((it) => tr(it.name)).join(', ')}</span>
              </span>
            </a>
          ))}
        </section>

        {options.map((p, i) => (
          <PokeScroll key={p.id} poke={p} skipTo={i < options.length - 1 ? `#${options[i + 1].id}` : '#menu-end'} />
        ))}

        <section id="menu-end" className="menu-end" aria-label={tr(meal)}>
          <p className="menu-note">{tr(note)}</p>
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
        <div className="menu-city">
          <Skyline />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
