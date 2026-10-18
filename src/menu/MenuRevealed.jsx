import { useEffect } from 'react'
import BottomNav from '../shared/BottomNav'
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
  const navItems = [
    ...options.map((p) => ({ id: p.id, label: p.label })),
    { id: 'menu-top', top: true, label: { it: 'Torna su', en: 'Top' } },
  ]

  // se chiudi e riapri il menu, riparti da dove eri (per qualche ora), finita l'intro
  useEffect(() => {
    const KEY = 'gmi-menu-pos'
    let saved = null
    try {
      saved = JSON.parse(localStorage.getItem(KEY))
    } catch {
      /* niente */
    }
    let tries = 0
    const restore = setInterval(() => {
      if (document.documentElement.classList.contains('intro-on') && tries++ < 60) return
      clearInterval(restore)
      if (saved && !location.hash && Date.now() - saved.t < 3 * 3600 * 1000 && saved.y > 200) {
        scrollTo({ top: saved.y, behavior: 'instant' })
      }
    }, 150)
    let timer = 0
    const save = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        try {
          localStorage.setItem(KEY, JSON.stringify({ y: Math.round(scrollY), t: Date.now() }))
        } catch {
          /* modalità privata */
        }
      }, 400)
    }
    addEventListener('scroll', save, { passive: true })
    return () => {
      clearInterval(restore)
      clearTimeout(timer)
      removeEventListener('scroll', save)
    }
  }, [])

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
      <BottomNav items={navItems} heroId="menu-top" label={tr({ it: 'Opzioni del menu', en: 'Menu options' })} />
    </div>
  )
}
