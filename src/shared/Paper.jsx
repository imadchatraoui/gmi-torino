// Elementi "di carta" dello stile YMHS: pizzo, angolo di carta strappata con rametti, bordi strappati.
// Tutto vettoriale e fermo: nessun costo durante lo scroll.

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// clip-path con i bordi strappati (in alto e/o in basso), in percentuale: si adatta a qualsiasi misura
export function tornClip(seed = 3, { top = true, bottom = true, depth = 6, points = 34 } = {}) {
  const rand = rng(seed)
  const edge = (y0, dir) =>
    Array.from({ length: points + 1 }, (_, i) => {
      const x = (i / points) * 100
      const y = y0 + dir * rand() * depth
      return `${x.toFixed(2)}% ${y.toFixed(2)}%`
    })
  const t = top ? edge(0, 1) : ['0% 0%', '100% 0%']
  const b = bottom ? edge(100, -1).reverse() : ['100% 100%', '0% 100%']
  return `polygon(${[...t, ...b].join(',')})`
}

// Bordo di pizzo: due file di smerli (salvia dietro, blu davanti) con i fori
export function Lace({ className = '' }) {
  return (
    <svg className={`lace ${className}`} aria-hidden="true" focusable="false" width="100%" height="54">
      <defs>
        <pattern id="lace-back" width="22" height="40" patternUnits="userSpaceOnUse" x="-6" patternTransform="scale(1.35)">
          <path d="M0 40 V18 Q11 4 22 18 V40 Z" className="lace__sage" />
          <circle cx="11" cy="18" r="3.2" className="lace__hole" />
          <circle cx="4.5" cy="26" r="1.7" className="lace__hole" />
          <circle cx="17.5" cy="26" r="1.7" className="lace__hole" />
        </pattern>
        <pattern id="lace-front" width="16" height="40" patternUnits="userSpaceOnUse" patternTransform="scale(1.35)">
          <path d="M0 40 V27 Q8 15 16 27 V40 Z" className="lace__navy" />
          <circle cx="8" cy="27" r="2.6" className="lace__hole" />
          <circle cx="8" cy="34" r="1.3" className="lace__hole" />
          <circle cx="3" cy="33" r="1" className="lace__hole" />
          <circle cx="13" cy="33" r="1" className="lace__hole" />
        </pattern>
      </defs>
      <rect width="100%" height="54" fill="url(#lace-back)" />
      <rect width="100%" height="54" fill="url(#lace-front)" />
    </svg>
  )
}

// Angolo in alto a destra: carta blu strappata e un rametto con fiorellini (come nelle locandine)
const SPRIG = (() => {
  const rand = rng(8)
  const leaves = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8
    const x = 168 - t * 120
    const y = 18 + t * 92 + Math.sin(t * 5) * 6
    const side = i % 2 ? 1 : -1
    return { x, y, rot: -60 + side * (35 + rand() * 20), s: 0.8 + rand() * 0.5 }
  })
  const flowers = Array.from({ length: 14 }, () => ({ x: 70 + rand() * 110, y: 8 + rand() * 80, r: 1.6 + rand() * 1.8 }))
  return { leaves, flowers }
})()

export function Corner({ className = '' }) {
  return (
    <svg className={`corner ${className}`} viewBox="0 0 200 150" aria-hidden="true" focusable="false">
      <path
        className="corner__navy"
        d="M200 0 L58 0 L64 6 L70 3 L78 11 L86 8 L92 16 L102 14 L108 24 L118 22 L124 33 L134 34 L140 46 L150 47 L156 60 L166 62 L171 76 L180 80 L184 96 L192 101 L194 118 L200 124 Z"
      />
      <path
        className="corner__paper"
        d="M200 0 L96 0 L100 4 L108 3 L114 10 L124 9 L130 18 L140 19 L145 30 L156 33 L160 46 L170 50 L174 63 L183 68 L186 82 L194 88 L196 104 L200 108 Z"
      />
      <path className="corner__stem" d="M178 4 C 150 30, 120 60, 44 116" fill="none" />
      {SPRIG.leaves.map((l, i) => (
        <ellipse
          key={i}
          className="corner__leaf"
          cx={l.x.toFixed(1)}
          cy={l.y.toFixed(1)}
          rx={(9 * l.s).toFixed(1)}
          ry={(3.6 * l.s).toFixed(1)}
          transform={`rotate(${l.rot.toFixed(0)} ${l.x.toFixed(1)} ${l.y.toFixed(1)})`}
        />
      ))}
      {SPRIG.flowers.map((f, i) => (
        <circle key={i} className="corner__flower" cx={f.x.toFixed(1)} cy={f.y.toFixed(1)} r={f.r.toFixed(1)} />
      ))}
    </svg>
  )
}
