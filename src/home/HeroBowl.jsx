import { useEffect, useRef, useState } from 'react'
import { POKES } from '../data/menu'
import PokeIllustration from '../poke/PokeIllustration'
import { buildTimeline } from '../poke/timeline'

const WIDE = '(min-width: 960px)'

// Bowl aperta decorativa nella colonna destra dell'hero, solo su schermi larghi
// (su telefono non viene nemmeno montata).
export default function HeroBowl() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches)
  const ref = useRef(null)
  const poke = POKES[0]

  useEffect(() => {
    const mq = window.matchMedia(WIDE)
    const onChange = () => setWide(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (wide) ref.current?.update(1, buildTimeline(poke.items.length))
  }, [wide, poke])

  if (!wide) return null
  return (
    <div className="hero__bowl" aria-hidden="true">
      <PokeIllustration ref={ref} items={poke.items} label={poke.label} markers={false} />
    </div>
  )
}
