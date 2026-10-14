// Striscia di carta con i temi del summit che scorre lentamente.
function tornEdge(seed, points = 36) {
  let s = seed
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const top = []
  const bottom = []
  for (let i = 0; i <= points; i++) {
    const x = ((i / points) * 100).toFixed(2)
    top.push(`${x}% ${(rand() * 9).toFixed(1)}%`)
    bottom.unshift(`${x}% ${(100 - rand() * 9).toFixed(1)}%`)
  }
  return `polygon(${[...top, ...bottom].join(',')})`
}

const CLIP = tornEdge(9)

export default function Ticker({ items, label }) {
  const row = (hidden) => (
    <ul aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
  return (
    <div className="ticker" style={{ clipPath: CLIP }} role="region" aria-label={label}>
      <div className="ticker__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
