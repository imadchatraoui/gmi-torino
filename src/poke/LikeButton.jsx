import PulseHeart from '../components/react-bits/PulseHeart'
import { toggleLike, useLikes } from '../shared/likes'
import { t, usePrefs } from '../shared/prefs'
import { POKES } from '../data/menu'

const IDS = POKES.map((p) => p.id)

// Cuore "mi piace" condiviso accanto a ogni poke (PulseHeart di React Bits + src/shared/likes.js).
// Colori dai token CSS della pagina: --like, --like-pill, --like-text (menu.css).
export default function LikeButton({ poke, size = 22, className = '' }) {
  const { lang } = usePrefs()
  const likes = useLikes(IDS)
  return (
    <PulseHeart
      className={`like ${className}`}
      liked={likes.liked(poke.id)}
      count={likes.count(poke.id)}
      onChange={(liked) => toggleLike(poke.id, liked)}
      size={size}
      corner={999}
      likedColor="var(--like)"
      idleColor="var(--like-idle)"
      pillColor="var(--like-pill)"
      textColor="var(--like-text)"
      label={t({ it: `Mi piace: ${t(poke.title, 'it')}`, en: `Like: ${t(poke.title, 'en')}` }, lang)}
    />
  )
}
