import { useEffect, useRef, useState } from 'react'

// Una parola che lascia il posto alla successiva con una dissolvenza semplice
// (in sha Allah → إن شاء الله → se Dio vuole). Solo opacità e un piccolo spostamento: leggero ovunque.
// Si ferma fuori schermo (classe is-off sull'antenato) e con "riduci movimento" resta la prima parola.
const HOLD = 3200

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function WordCycle({ words, className = '' }) {
  const [i, setI] = useState(0)
  const ref = useRef(null)
  const key = words.map((w) => w.text).join('|')

  useEffect(() => {
    setI(0)
    if (reducedMotion() || words.length < 2) return
    const id = setInterval(() => {
      if (document.hidden || ref.current?.closest('.is-off')) return
      setI((n) => (n + 1) % words.length)
    }, HOLD)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return (
    <span ref={ref} className={`cycle ${className}`} aria-hidden="true">
      {words.map((w, n) => (
        <span
          key={w.text}
          className={`cycle__word${w.ar ? ' cycle__word--ar' : ''}${n === i ? ' is-on' : ''}`}
          lang={w.lang}
          dir={w.dir}
        >
          {w.text}
        </span>
      ))}
    </span>
  )
}
