import LikeButton from '../poke/LikeButton'
import PokeIllustration from '../poke/PokeIllustration'
import PokeScroll from '../poke/PokeScroll'
import { tornClip } from '../shared/Paper'
import { t, usePrefs } from '../shared/prefs'

// Il menu svelato: le due proposte e le bowl che si aprono con lo scroll.
// Caricato solo quando /api/menu lo consegna (MenuPage lo importa in modo dinamico).
const CHOICE_CLIPS = [tornClip(21, { depth: 3, points: 30 }), tornClip(33, { depth: 3, points: 30 })]

export default function MenuRevealed({ options }) {
  const { lang } = usePrefs()
  const tr = (v) => t(v, lang)
  const ids = options.map((p) => p.id)

  return (
    <div className="menu-revealed">
      <section className="choices" aria-label={tr({ it: 'Le due proposte', en: 'The two options' })}>
        {options.map((p, i) => (
          <div key={p.id} className="choice-wrap">
            <a className="choice" href={`#${p.id}`} style={{ clipPath: CHOICE_CLIPS[i % 2] }}>
              <span className="choice__bowl" aria-hidden="true">
                <PokeIllustration items={p.items} label={tr(p.label)} open markers={false} />
              </span>
              <span className="choice__text">
                <span className="choice__label">{tr(p.label)}</span>
                <span className="choice__title display">{tr(p.title)}</span>
                <span className="choice__items">{p.items.map((it) => tr(it.name)).join(', ')}</span>
              </span>
            </a>
            <LikeButton poke={p} ids={ids} className="choice__like" />
          </div>
        ))}
      </section>

      {options.map((p, i) => (
        <PokeScroll
          key={p.id}
          poke={p}
          likeIds={ids}
          skipTo={i < options.length - 1 ? `#${options[i + 1].id}` : '#menu-end'}
        />
      ))}
    </div>
  )
}
