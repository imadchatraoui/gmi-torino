// Illustrazioni vettoriali del poke, vista dall'alto.
// Ogni topping è disegnato attorno a (0,0) in un raggio di ~52 unità;
// la ciotola usa il sistema 480x480 con centro (240,240).
// Forme generate con un PRNG a seme fisso: stesso disegno a ogni render.
// Luce da in alto a sinistra: ombre in basso a destra, riflessi in alto a sinistra.
// Solo gli ingredienti del menu: niente guarnizioni aggiunte.

export const VIEW = 480
export const C = VIEW / 2
export const BOWL_R = 214
export const FOOD_R = 176

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function scatter(rand, count, radius, minDist = 0) {
  const pts = []
  let guard = 0
  while (pts.length < count && guard++ < count * 60) {
    const r = radius * Math.sqrt(rand())
    const a = rand() * Math.PI * 2
    const p = { x: Math.cos(a) * r, y: Math.sin(a) * r, rot: rand() * 360, k: rand() }
    if (minDist && pts.some((q) => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 < minDist * minDist)) continue
    pts.push(p)
  }
  return pts
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)]
const f1 = (v) => v.toFixed(1)

/* ---------- ombra morbida (senza filtri SVG) ---------- */

function SoftShadow({ id, rx, ry, dx = 3, dy = 5, opacity = 0.32 }) {
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="55%" stopColor="#2A0B0D" stopOpacity={opacity} />
          <stop offset="100%" stopColor="#2A0B0D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={dx} cy={dy} rx={rx} ry={ry} fill={`url(#${id})`} />
    </>
  )
}

/* ---------- base: riso nero ---------- */

const RICE_GRAINS = (() => {
  const rand = rng(7)
  const cols = ['#3A2441', '#26162C', '#4A2F52', '#1C1021', '#33203A', '#432A4B']
  return scatter(rand, 560, FOOD_R - 5).map((g) => ({ ...g, fill: pick(rand, cols) }))
})()

export function RiceBed({ uid }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-rice-depth`} cx="50%" cy="50%" r="50%">
          <stop offset="78%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#0B0410" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id={`${uid}-rice-sheen`} cx="36%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#9C7AA4" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#9C7AA4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={FOOD_R} fill="#1F1225" />
      {RICE_GRAINS.map((g, i) => {
        const x = f1(C + g.x)
        const y = f1(C + g.y)
        return (
          <ellipse key={i} cx={x} cy={y} rx="4.4" ry="1.9" fill={g.fill} transform={`rotate(${g.rot.toFixed(0)} ${x} ${y})`} />
        )
      })}
      {RICE_GRAINS.filter((_, i) => i % 6 === 0).map((g, i) => {
        const x = f1(C + g.x - 0.8)
        const y = f1(C + g.y - 0.5)
        return (
          <ellipse
            key={`h${i}`}
            cx={x}
            cy={y}
            rx="2"
            ry="0.7"
            fill="#B597BC"
            opacity="0.5"
            transform={`rotate(${g.rot.toFixed(0)} ${x} ${y})`}
          />
        )
      })}
      <circle cx={C} cy={C} r={FOOD_R} fill={`url(#${uid}-rice-sheen)`} />
      <circle cx={C} cy={C} r={FOOD_R} fill={`url(#${uid}-rice-depth)`} />
    </g>
  )
}

/* ---------- ciotola in carta kraft ---------- */

const KRAFT_FIBERS = (() => {
  const rand = rng(91)
  return Array.from({ length: 90 }, () => {
    const a = rand() * Math.PI * 2
    const r = FOOD_R + 26 + rand() * 12
    return { x: C + Math.cos(a) * r, y: C + Math.sin(a) * r, rot: (a * 180) / Math.PI + 90 + (rand() - 0.5) * 40, len: 3 + rand() * 6, light: rand() > 0.5 }
  })
})()

export function Bowl({ uid }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-bowl-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#2A0B0D" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#2A0B0D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-kraft-rim`} x1="0.15" y1="0.1" x2="0.85" y2="0.95">
          <stop offset="0%" stopColor="#E2C08E" />
          <stop offset="55%" stopColor="#C99B62" />
          <stop offset="100%" stopColor="#A9794A" />
        </linearGradient>
        <radialGradient id={`${uid}-inner`} cx="62%" cy="66%" r="62%">
          <stop offset="0%" stopColor="#FBF6EA" />
          <stop offset="80%" stopColor="#EFE5D2" />
          <stop offset="100%" stopColor="#DCCDB2" />
        </radialGradient>
      </defs>
      {/* ombra sul tavolo */}
      <ellipse cx={C + 10} cy={C + 16} rx={BOWL_R + 18} ry={BOWL_R + 14} fill={`url(#${uid}-bowl-shadow)`} />
      {/* bordo esterno in kraft */}
      <circle cx={C} cy={C} r={BOWL_R} fill={`url(#${uid}-kraft-rim)`} />
      {KRAFT_FIBERS.map((f, i) => (
        <line
          key={i}
          x1={f1(f.x)}
          y1={f1(f.y - f.len / 2)}
          x2={f1(f.x)}
          y2={f1(f.y + f.len / 2)}
          stroke={f.light ? '#F0D9B0' : '#8E6236'}
          strokeOpacity="0.45"
          strokeWidth="0.9"
          strokeLinecap="round"
          transform={`rotate(${f.rot.toFixed(0)} ${f1(f.x)} ${f1(f.y)})`}
        />
      ))}
      <circle cx={C} cy={C} r={BOWL_R - 1} fill="none" stroke="#8E6236" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* labbro arrotolato */}
      <circle cx={C} cy={C} r={BOWL_R - 9} fill="none" stroke="#F3DDB4" strokeOpacity="0.7" strokeWidth="2" />
      {/* interno patinato */}
      <circle cx={C} cy={C} r={BOWL_R - 16} fill={`url(#${uid}-inner)`} />
      <circle cx={C} cy={C} r={FOOD_R + 4} fill="#CDBB9C" opacity="0.6" />
      {/* riflesso sulla parete interna */}
      <path
        d={`M ${C - 150} ${C - 104} A 186 186 0 0 1 ${C + 46} ${C - 182}`}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.7"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  )
}

/* ---------- coperchio con adesivo GMI Torino ---------- */

const LID_SPECKS = (() => {
  const rand = rng(57)
  return scatter(rand, 150, BOWL_R - 6).map((s) => ({ ...s, len: 2 + rand() * 7, light: rand() > 0.55 }))
})()

export function Lid({ uid, label }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-lid`} cx="40%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#E3C495" />
          <stop offset="70%" stopColor="#CDA36D" />
          <stop offset="100%" stopColor="#B4875A" />
        </radialGradient>
        <radialGradient id={`${uid}-lid-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="#2A0B0D" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2A0B0D" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${uid}-sticker`}>
          <circle cx={C} cy={C} r="64" />
        </clipPath>
      </defs>
      <ellipse cx={C + 12} cy={C + 18} rx={BOWL_R + 14} ry={BOWL_R + 10} fill={`url(#${uid}-lid-shadow)`} />
      <circle cx={C} cy={C} r={BOWL_R + 2} fill={`url(#${uid}-lid)`} />
      {LID_SPECKS.map((s, i) => (
        <line
          key={i}
          x1={f1(C + s.x)}
          y1={f1(C + s.y)}
          x2={f1(C + s.x + s.len)}
          y2={f1(C + s.y)}
          stroke={s.light ? '#F2DDB8' : '#8F643A'}
          strokeOpacity="0.4"
          strokeWidth="0.9"
          strokeLinecap="round"
          transform={`rotate(${s.rot.toFixed(0)} ${f1(C + s.x)} ${f1(C + s.y)})`}
        />
      ))}
      {/* scanalature del coperchio */}
      <circle cx={C} cy={C} r={BOWL_R - 6} fill="none" stroke="#9A6E40" strokeOpacity="0.55" strokeWidth="2.5" />
      <circle cx={C} cy={C} r={BOWL_R - 10} fill="none" stroke="#F1D9AE" strokeOpacity="0.6" strokeWidth="1.5" />
      <circle cx={C} cy={C} r={FOOD_R - 4} fill="none" stroke="#9A6E40" strokeOpacity="0.25" strokeWidth="1.5" />
      {/* adesivo */}
      <g transform={`rotate(-7 ${C} ${C})`}>
        <circle cx={C + 2} cy={C + 3} r="76" fill="#2A0B0D" opacity="0.18" />
        <circle cx={C} cy={C} r="76" fill="#F3EDE2" />
        <circle cx={C} cy={C} r="70" fill="none" stroke="#27396A" strokeWidth="2" />
        <circle cx={C} cy={C} r="66.5" fill="none" stroke="#7D8866" strokeWidth="1" />
        <g clipPath={`url(#${uid}-sticker)`}>
          <image href="/brand/gmi-torino-160.png" x={C - 33} y={C - 58} width="66" height="81" />
        </g>
        <text
          x={C}
          y={C + 44}
          textAnchor="middle"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif"
          fontSize="15"
          fontWeight="600"
          letterSpacing="0.2"
          fill="#1E2E36"
        >
          {label}
        </text>
      </g>
    </g>
  )
}

/* ---------- avocado ---------- */

function AvocadoSlice({ uid }) {
  // spicchio a mezzaluna: buccia sul lato esterno, polpa che schiarisce verso il nocciolo
  return (
    <g>
      <path d="M -34 2 C -24 -20 24 -20 34 2 C 18 -6 -18 -6 -34 2 Z" fill="#2E4A1A" />
      <path d="M -31.5 1 C -22 -16.5 22 -16.5 31.5 1 C 16 -4.5 -16 -4.5 -31.5 1 Z" fill={`url(#${uid}-flesh)`} />
      <path d="M -22 -9 C -10 -15 10 -15 20 -10" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )
}

function AvocadoFan({ uid }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-flesh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7FA43A" />
          <stop offset="35%" stopColor="#B7CC5C" />
          <stop offset="100%" stopColor="#E8E59E" />
        </linearGradient>
      </defs>
      <SoftShadow id={`${uid}-avo-sh`} rx={46} ry={40} dx={4} dy={7} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(${-10 + i * 4} ${-26 + i * 9.5}) rotate(${-26 + i * 10})`}>
          <AvocadoSlice uid={uid} />
        </g>
      ))}
    </g>
  )
}

function AvocadoHoney({ uid }) {
  const drizzle = 'M -36 -20 C -20 -34 -10 4 6 -12 S 30 -10 24 12 S 8 30 22 40'
  return (
    <g>
      <AvocadoFan uid={uid} />
      {/* miele di acacia: chiaro e trasparente */}
      <path d={drizzle} fill="none" stroke="#B87A10" strokeOpacity="0.35" strokeWidth="6.5" strokeLinecap="round" transform="translate(1.5 2)" />
      <path d={drizzle} fill="none" stroke="#E7A92C" strokeOpacity="0.88" strokeWidth="4.6" strokeLinecap="round" />
      <path d="M -33 -22 C -21 -31 -12 -6 2 -14" fill="none" stroke="#FFF1C2" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M 8 -11 C 20 -14 28 -6 25 6" fill="none" stroke="#FFF1C2" strokeOpacity="0.8" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="22" cy="40" r="4.4" fill="#E7A92C" opacity="0.9" />
      <circle cx="20.8" cy="38.6" r="1.4" fill="#FFF1C2" />
      <circle cx="-38" cy="-21" r="3.2" fill="#E7A92C" opacity="0.85" />
    </g>
  )
}

const SALT = (() => scatter(rng(31), 18, 40))()
const OIL = (() => scatter(rng(33), 7, 36, 10))()

function AvocadoLemon({ uid }) {
  return (
    <g>
      <AvocadoFan uid={uid} />
      {/* olio evo */}
      {OIL.map((o, i) => (
        <g key={i}>
          <ellipse cx={f1(o.x)} cy={f1(o.y)} rx={f1(3 + o.k * 4)} ry={f1(2.4 + o.k * 3)} fill="#C9B33A" opacity="0.42" />
          <circle cx={f1(o.x - 1)} cy={f1(o.y - 1)} r="0.9" fill="#FFFBE0" opacity="0.9" />
        </g>
      ))}
      {/* sale in fiocchi */}
      {SALT.map((s, i) => (
        <rect
          key={i}
          x={f1(s.x - 1.4)}
          y={f1(s.y - 1.4)}
          width="2.8"
          height="2.8"
          rx="0.4"
          fill="#FFFFFF"
          opacity="0.95"
          transform={`rotate(${s.rot.toFixed(0)} ${f1(s.x)} ${f1(s.y)})`}
        />
      ))}
      {/* spicchio di limone */}
      <g transform="translate(34 34) rotate(-32)">
        <ellipse cx="2" cy="3" rx="20" ry="9" fill="#2A0B0D" opacity="0.18" />
        <path d="M -19 0 A 19 19 0 0 1 19 0 Z" fill="#F3CF2C" />
        <path d="M -16 0 A 16 16 0 0 1 16 0 Z" fill="#FBEFA0" />
        {[22, 50, 78, 106, 134, 158].map((a) => {
          const r = (a * Math.PI) / 180
          return (
            <path
              key={a}
              d={`M 0 -1 L ${f1(Math.cos(r) * -14.5)} ${f1(Math.sin(r) * -14.5 - 1)}`}
              stroke="#F3D96A"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )
        })}
        <path d="M -19 0 L 19 0" stroke="#E9C126" strokeWidth="2" />
      </g>
    </g>
  )
}

/* ---------- cubetti (tonno, barbabietola) ---------- */

// quadrilatero irregolare: i cubetti tagliati a mano non sono mai quadrati perfetti
function jitterQuad(rand, s, amt = 0.14) {
  const h = s / 2
  const j = () => (rand() - 0.5) * 2 * amt * s
  return [
    [-h + j(), -h + j()],
    [h + j(), -h + j()],
    [h + j(), h + j()],
    [-h + j(), h + j()],
  ]
}

const quadPath = (q) => `M ${q.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L ')} Z`

function makeCubes(seed, count, size, minDist) {
  const rand = rng(seed)
  return scatter(rand, count, 38, minDist)
    .sort((a, b) => a.y - b.y)
    .map((p) => {
      const sz = size * (0.82 + p.k * 0.34)
      const top = jitterQuad(rand, sz)
      // spessore visibile verso il basso a destra (luce da in alto a sinistra)
      const dx = sz * 0.16
      const dy = sz * 0.24
      const side = [top[1], [top[1][0] + dx, top[1][1] + dy], [top[2][0] + dx, top[2][1] + dy], top[2]]
      const front = [top[3], top[2], [top[2][0] + dx, top[2][1] + dy], [top[3][0] + dx, top[3][1] + dy]]
      const bend = (rand() - 0.5) * sz * 0.5
      return { ...p, sz, top, side, front, bend, rot: (p.rot % 50) - 25 }
    })
}

const TUNA = makeCubes(11, 12, 19, 18)
const BEET = makeCubes(23, 12, 16, 15)

function Tuna({ uid }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-tuna`} cx="34%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#D2485A" />
          <stop offset="55%" stopColor="#B02B3E" />
          <stop offset="100%" stopColor="#8C1A2C" />
        </radialGradient>
      </defs>
      <SoftShadow id={`${uid}-tuna-sh`} rx={50} ry={46} dx={4} dy={6} opacity={0.24} />
      {TUNA.map((c, i) => (
        <g key={i} transform={`translate(${f1(c.x)} ${f1(c.y)}) rotate(${c.rot.toFixed(0)})`}>
          <path d={quadPath(c.top)} fill="#2A0B0D" opacity="0.25" transform={`translate(${f1(c.sz * 0.22)} ${f1(c.sz * 0.34)})`} />
          <path d={quadPath(c.front)} fill="#741527" />
          <path d={quadPath(c.side)} fill="#5E0F1F" />
          <path d={quadPath(c.top)} fill={`url(#${uid}-tuna)`} />
          {/* venature del tonno crudo */}
          <path
            d={`M ${f1(-c.sz * 0.42)} ${f1(-c.sz * 0.1)} Q ${f1(c.bend)} ${f1(-c.sz * 0.36)} ${f1(c.sz * 0.42)} ${f1(-c.sz * 0.05)}`}
            fill="none"
            stroke="#F2A3AA"
            strokeOpacity="0.5"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d={`M ${f1(-c.sz * 0.4)} ${f1(c.sz * 0.2)} Q ${f1(c.bend * 0.6)} ${f1(c.sz * 0.02)} ${f1(c.sz * 0.38)} ${f1(c.sz * 0.24)}`}
            fill="none"
            stroke="#F2A3AA"
            strokeOpacity="0.32"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          {/* lucido */}
          <ellipse cx={f1(-c.sz * 0.18)} cy={f1(-c.sz * 0.24)} rx={f1(c.sz * 0.2)} ry={f1(c.sz * 0.08)} fill="#FFFFFF" opacity="0.35" transform={`rotate(-12 ${f1(-c.sz * 0.18)} ${f1(-c.sz * 0.24)})`} />
        </g>
      ))}
    </g>
  )
}

function Beet({ uid }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-beet`} cx="36%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#B4316E" />
          <stop offset="60%" stopColor="#861A4D" />
          <stop offset="100%" stopColor="#5F0F36" />
        </radialGradient>
      </defs>
      <SoftShadow id={`${uid}-beet-sh`} rx={50} ry={46} dx={4} dy={6} opacity={0.24} />
      {BEET.map((c, i) => (
        <g key={i} transform={`translate(${f1(c.x)} ${f1(c.y)}) rotate(${c.rot.toFixed(0)})`}>
          <path d={quadPath(c.top)} fill="#2A0B0D" opacity="0.25" transform={`translate(${f1(c.sz * 0.22)} ${f1(c.sz * 0.34)})`} />
          <path d={quadPath(c.front)} fill="#4E0C2C" />
          <path d={quadPath(c.side)} fill="#3F0823" />
          <path d={quadPath(c.top)} fill={`url(#${uid}-beet)`} />
          {/* anelli della barbabietola */}
          <path
            d={`M ${f1(-c.sz * 0.38)} ${f1(c.sz * 0.36)} Q ${f1(c.sz * 0.05)} ${f1(c.sz * 0.02)} ${f1(c.sz * 0.36)} ${f1(-c.sz * 0.36)} M ${f1(-c.sz * 0.1)} ${f1(c.sz * 0.38)} Q ${f1(c.sz * 0.18)} ${f1(c.sz * 0.18)} ${f1(c.sz * 0.38)} ${f1(-c.sz * 0.05)}`}
            fill="none"
            stroke="#E07BAD"
            strokeOpacity="0.4"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          <ellipse cx={f1(-c.sz * 0.16)} cy={f1(-c.sz * 0.22)} rx={f1(c.sz * 0.18)} ry={f1(c.sz * 0.08)} fill="#FFFFFF" opacity="0.4" />
        </g>
      ))}
    </g>
  )
}

/* ---------- ricotta ---------- */

// contorno "a grumi": un cerchio deformato e smussato
function lumpyPath(rand, r, bumps = 11, amp = 0.14, squash = 0.86) {
  const pts = Array.from({ length: bumps }, (_, i) => {
    const a = (i / bumps) * Math.PI * 2
    const rr = r * (1 + (rand() - 0.5) * 2 * amp)
    return [Math.cos(a) * rr, Math.sin(a) * rr * squash]
  })
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  let d = `M ${f1(mid(pts[bumps - 1], pts[0])[0])} ${f1(mid(pts[bumps - 1], pts[0])[1])}`
  pts.forEach((p, i) => {
    const m = mid(p, pts[(i + 1) % bumps])
    d += ` Q ${f1(p[0])} ${f1(p[1])} ${f1(m[0])} ${f1(m[1])}`
  })
  return `${d} Z`
}

// un mucchietto morbido fatto di tanti piccoli grumi: si legge come ricotta, non come mozzarella
const RICOTTA = (() => {
  const rand = rng(5)
  const base = lumpyPath(rand, 40, 14, 0.12, 0.9)
  const curds = scatter(rand, 95, 37, 4.2)
    .map((c) => ({ ...c, r: 3.4 + c.k * 3.4, lift: 1 - Math.hypot(c.x, c.y) / 40 }))
    .sort((a, b) => a.y - b.y)
  const crumbs = scatter(rand, 8, 50, 6).filter((c) => Math.hypot(c.x, c.y) > 42)
  return { base, curds, crumbs }
})()

function Ricotta({ uid }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-ric`} cx="40%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F3ECDD" />
          <stop offset="100%" stopColor="#DCCFB5" />
        </radialGradient>
      </defs>
      <SoftShadow id={`${uid}-ric-sh`} rx={52} ry={48} dx={4} dy={6} opacity={0.26} />
      <path d={RICOTTA.base} fill={`url(#${uid}-ric)`} />
      {RICOTTA.curds.map((c, i) => (
        <g key={i}>
          <circle cx={f1(c.x + 0.8)} cy={f1(c.y + 1.1)} r={f1(c.r)} fill="#CDBFA2" opacity={f1(0.35 + 0.25 * (1 - c.lift))} />
          <circle cx={f1(c.x)} cy={f1(c.y)} r={f1(c.r)} fill={c.lift > 0.55 ? '#FFFFFF' : '#F6F0E3'} />
          <circle cx={f1(c.x - c.r * 0.3)} cy={f1(c.y - c.r * 0.35)} r={f1(c.r * 0.35)} fill="#FFFFFF" opacity="0.9" />
        </g>
      ))}
      {RICOTTA.crumbs.map((c, i) => (
        <g key={`c${i}`} transform={`translate(${f1(c.x)} ${f1(c.y)})`}>
          <circle cx="0.8" cy="1.2" r={f1(2.4 + c.k * 1.6)} fill="#B9AA8D" opacity="0.45" />
          <circle r={f1(2.4 + c.k * 1.6)} fill="#F6F0E3" />
        </g>
      ))}
    </g>
  )
}

/* ---------- cavolo cappuccino rosso ---------- */

const CABBAGE = (() => {
  const rand = rng(17)
  const cols = ['#6B2A6E', '#80357E', '#5A2160', '#984A93', '#71306F']
  return scatter(rand, 40, 40)
    .map((s) => ({ ...s, len: 16 + rand() * 18, bend: (rand() - 0.5) * 24, col: pick(rand, cols), w: 3.2 + rand() * 1.8, vein: rand() > 0.45 }))
    .sort((a, b) => a.y - b.y)
})()

function RedCabbage({ uid }) {
  return (
    <g>
      <SoftShadow id={`${uid}-cab-sh`} rx={50} ry={46} dx={3} dy={5} opacity={0.2} />
      <g strokeLinecap="round" fill="none">
        {CABBAGE.map((s, i) => {
          const d = `M ${f1(-s.len / 2)} 0 Q 0 ${f1(s.bend)} ${f1(s.len / 2)} 0`
          return (
            <g key={i} transform={`translate(${f1(s.x)} ${f1(s.y)}) rotate(${s.rot.toFixed(0)})`}>
              <path d={d} stroke="#3A1240" strokeOpacity="0.35" strokeWidth={f1(s.w + 1.4)} transform="translate(0.8 1.2)" />
              <path d={d} stroke={s.col} strokeWidth={f1(s.w)} />
              {s.vein && <path d={d} stroke="#F1DDF0" strokeWidth="1" strokeOpacity="0.9" />}
            </g>
          )
        })}
      </g>
    </g>
  )
}

/* ---------- hummus di ceci con paprika ---------- */

const HUMMUS_SPIRAL = (() => {
  const pts = []
  for (let a = 0; a < Math.PI * 4.6; a += 0.2) {
    const r = 5 + a * 2.6
    pts.push(`${f1(Math.cos(a) * r)} ${f1(Math.sin(a) * r)}`)
  }
  return `M ${pts.join(' L ')}`
})()
const PAPRIKA = (() => scatter(rng(41), 60, 32))()
const CHICKPEAS = [
  [-34, 26, 0], [-24, 36, 40], [31, -30, 80], [39, -17, 120], [27, 36, 160], [-41, -12, 200], [14, 41, 240],
]

function Hummus({ uid }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-hum`} cx="40%" cy="36%" r="64%">
          <stop offset="0%" stopColor="#F1DCAE" />
          <stop offset="75%" stopColor="#E3C58D" />
          <stop offset="100%" stopColor="#CDA867" />
        </radialGradient>
        <radialGradient id={`${uid}-oil`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D8B93A" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#C9A42A" stopOpacity="0.25" />
        </radialGradient>
      </defs>
      <SoftShadow id={`${uid}-hum-sh`} rx={52} ry={50} dx={3} dy={5} opacity={0.24} />
      <circle cx="0" cy="0" r="45" fill={`url(#${uid}-hum)`} />
      <path d={HUMMUS_SPIRAL} fill="none" stroke="#C49A55" strokeWidth="3.4" strokeLinecap="round" opacity="0.75" />
      <path d={HUMMUS_SPIRAL} fill="none" stroke="#FFF3D6" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" transform="translate(-1.2 -1.4)" />
      <ellipse cx="2" cy="1" rx="11" ry="8.5" fill={`url(#${uid}-oil)`} />
      <ellipse cx="-1.5" cy="-2" rx="3.4" ry="1.6" fill="#FFF7D2" opacity="0.8" />
      {PAPRIKA.map((p, i) => (
        <circle key={i} cx={f1(p.x)} cy={f1(p.y)} r={f1(0.9 + p.k * 1.3)} fill={p.k > 0.5 ? '#B5361C' : '#C9502A'} opacity="0.85" />
      ))}
      {CHICKPEAS.map(([x, y, rot], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <circle cx="1.2" cy="1.8" r="8" fill="#8C6A35" opacity="0.4" />
          <circle r="8" fill="#E4BD78" />
          <path d="M -3.5 -5 q 5 3 1.5 9.5" fill="none" stroke="#B98A47" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="-3" cy="-3" r="2.2" fill="#F6DFA8" opacity="0.8" />
        </g>
      ))}
    </g>
  )
}

/* ---------- straccetti di pollo con salsa tahina ---------- */

// straccetti: strisce sottili e irregolari, bordi rosolati, segni della piastra
const STRIPS = (() => {
  const rand = rng(61)
  const place = [
    [-22, -30, 24], [8, -34, 16], [-36, -8, 32], [-8, -10, 20], [22, -12, 12],
    [-24, 16, 28], [4, 14, 18], [28, 14, 30], [-8, 36, 22],
  ]
  return place.map(([x, y, r]) => {
    const w = 30 + rand() * 12
    const h = 10 + rand() * 3
    const n = 6
    const topEdge = Array.from({ length: n + 1 }, (_, i) => [-w / 2 + (w * i) / n, -h / 2 + (rand() - 0.5) * 3])
    const botEdge = Array.from({ length: n + 1 }, (_, i) => [w / 2 - (w * i) / n, h / 2 + (rand() - 0.5) * 3])
    const pts = [...topEdge, ...botEdge]
    const d = `M ${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L ')} Z`
    return { x, y, r: r + (rand() - 0.5) * 10, w, h, d }
  })
})()
const TAHINI = 'M -34 -34 C -22 -36 -24 -20 -12 -20 S -2 -6 8 -6 S 20 8 28 8 S 38 22 32 36'

function Chicken({ uid }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-chk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EDC07C" />
          <stop offset="55%" stopColor="#D49A55" />
          <stop offset="100%" stopColor="#B07033" />
        </linearGradient>
      </defs>
      <SoftShadow id={`${uid}-chk-sh`} rx={52} ry={50} dx={4} dy={6} opacity={0.26} />
      {STRIPS.map((st, i) => (
        <g key={i} transform={`translate(${st.x} ${st.y}) rotate(${st.r.toFixed(0)})`}>
          <path d={st.d} fill="#5E3413" opacity="0.4" transform="translate(1.4 2.4)" />
          <path d={st.d} fill={`url(#${uid}-chk)`} stroke="#9A5A22" strokeOpacity="0.7" strokeWidth="1.3" strokeLinejoin="round" />
          <path
            d={`M ${f1(-st.w / 2 + 7)} ${f1(-st.h / 2 + 1)} l -3 ${f1(st.h - 2)} M ${f1(-st.w / 2 + 16)} ${f1(-st.h / 2 + 1)} l -3 ${f1(st.h - 2)} M ${f1(-st.w / 2 + 25)} ${f1(-st.h / 2 + 1)} l -3 ${f1(st.h - 2)}`}
            stroke="#6E3812"
            strokeOpacity="0.7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d={`M ${f1(-st.w / 2 + 4)} ${f1(-st.h / 2 + 2)} L ${f1(st.w / 2 - 6)} ${f1(-st.h / 2 + 2.5)}`} stroke="#FBE3B6" strokeOpacity="0.6" strokeWidth="1.1" strokeLinecap="round" />
        </g>
      ))}
      <path d={TAHINI} fill="none" stroke="#8C7550" strokeOpacity="0.4" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(1.2 2)" />
      <path d={TAHINI} fill="none" stroke="#E9DAB4" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={TAHINI} fill="none" stroke="#FFFAEB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" transform="translate(-0.9 -1)" />
    </g>
  )
}

export const TOPPING_ART = {
  avocadoHoney: AvocadoHoney,
  avocadoLemon: AvocadoLemon,
  tuna: Tuna,
  beet: Beet,
  ricotta: Ricotta,
  redCabbage: RedCabbage,
  hummus: Hummus,
  chicken: Chicken,
}
