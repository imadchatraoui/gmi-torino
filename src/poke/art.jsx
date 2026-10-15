// Disegni SVG degli ingredienti, vista dall'alto.
// Ogni topping è disegnato attorno a (0,0) in un raggio di ~56 unità;
// la bowl usa il sistema 480x480 con centro (240,240).
// Le forme sono generate con un PRNG a seme fisso: stesso disegno a ogni render.

export const VIEW = 480
export const C = VIEW / 2
export const BOWL_R = 200
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
  while (pts.length < count && guard++ < count * 40) {
    const r = radius * Math.sqrt(rand())
    const a = rand() * Math.PI * 2
    const p = { x: Math.cos(a) * r, y: Math.sin(a) * r, rot: rand() * 360, k: rand() }
    if (minDist && pts.some((q) => (q.x - p.x) ** 2 + (q.y - p.y) ** 2 < minDist * minDist)) continue
    pts.push(p)
  }
  return pts
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)]

/* ---------- base: riso nero ---------- */

const RICE_GRAINS = (() => {
  const rand = rng(7)
  const cols = ['#3B2642', '#24162A', '#4A3152', '#1B1020', '#33203A']
  return scatter(rand, 470, FOOD_R - 6).map((g) => ({ ...g, fill: pick(rand, cols) }))
})()

export function RiceBed() {
  return (
    <g>
      <circle cx={C} cy={C} r={FOOD_R} fill="#21142A" />
      {RICE_GRAINS.map((g, i) => (
        <ellipse
          key={i}
          cx={(C + g.x).toFixed(1)}
          cy={(C + g.y).toFixed(1)}
          rx="4.6"
          ry="2"
          fill={g.fill}
          transform={`rotate(${g.rot.toFixed(0)} ${(C + g.x).toFixed(1)} ${(C + g.y).toFixed(1)})`}
        />
      ))}
      {RICE_GRAINS.filter((_, i) => i % 9 === 0).map((g, i) => (
        <ellipse
          key={`h${i}`}
          cx={(C + g.x + 1).toFixed(1)}
          cy={(C + g.y - 0.6).toFixed(1)}
          rx="1.8"
          ry="0.7"
          fill="#7A5C82"
          opacity="0.55"
          transform={`rotate(${g.rot.toFixed(0)} ${(C + g.x).toFixed(1)} ${(C + g.y).toFixed(1)})`}
        />
      ))}
    </g>
  )
}

/* ---------- bowl e coperchio ---------- */

export function Bowl({ uid }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="62%" stopColor="#0f172a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-glaze`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#34475A" />
          <stop offset="70%" stopColor="#22303C" />
          <stop offset="100%" stopColor="#18222B" />
        </radialGradient>
      </defs>
      <ellipse cx={C + 10} cy={C + 18} rx={BOWL_R + 20} ry={BOWL_R + 16} fill={`url(#${uid}-shadow)`} />
      <circle cx={C} cy={C} r={BOWL_R} fill={`url(#${uid}-glaze)`} />
      <circle cx={C} cy={C} r={BOWL_R - 3} fill="none" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="2" />
      <circle cx={C} cy={C} r={FOOD_R + 5} fill="#141C24" />
      <path
        d={`M ${C - 136} ${C - 118} A 180 180 0 0 1 ${C + 68} ${C - 172}`}
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.16"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  )
}

export function Lid({ uid, label }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-kraft`} cx="44%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#DDBF92" />
          <stop offset="75%" stopColor="#C9A673" />
          <stop offset="100%" stopColor="#B38E5B" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r={BOWL_R + 8} fill={`url(#${uid}-kraft)`} />
      <circle cx={C} cy={C} r={BOWL_R - 6} fill="none" stroke="#A9834F" strokeWidth="3" />
      <circle cx={C} cy={C} r={BOWL_R - 14} fill="none" stroke="#E4CCA4" strokeOpacity="0.7" strokeWidth="1.5" />
      {/* bollino */}
      <g transform={`rotate(-8 ${C} ${C})`}>
        <circle cx={C} cy={C} r="62" fill="#ffffff" />
        <circle cx={C} cy={C} r="55" fill="none" stroke="#18abaf" strokeWidth="1.5" />
        <text
          x={C}
          y={C - 6}
          textAnchor="middle"
          fontFamily="'Poppins', system-ui, sans-serif"
          fontWeight="700"
          fontSize="28"
          letterSpacing="-0.5"
          fill="#004a73"
        >
          Poke
        </text>
        <text
          x={C}
          y={C + 22}
          textAnchor="middle"
          fontFamily="'Poppins', system-ui, sans-serif"
          fontWeight="600"
          fontSize="11"
          letterSpacing="1.5"
          fill="#0a8f92"
        >
          {label.toUpperCase()}
        </text>
      </g>
    </g>
  )
}

/* ---------- toppings ---------- */

function AvocadoFan({ uid }) {
  const slice = 'M -30 0 Q 0 -19 30 0 Q 0 6 -30 0 Z'
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-avo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8DAA3F" />
          <stop offset="55%" stopColor="#C8D46F" />
          <stop offset="100%" stopColor="#E5E2A0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${-6 + i * 4} ${-18 + i * 9}) rotate(${-24 + i * 12})`}>
          <path d={slice} fill={`url(#${uid}-avo)`} stroke="#3E5520" strokeWidth="3" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  )
}

function AvocadoHoney({ uid }) {
  return (
    <g>
      <AvocadoFan uid={uid} />
      <path
        d="M -34 -14 C -16 -30 -6 6 10 -10 S 34 -2 26 22"
        fill="none"
        stroke="#D9950F"
        strokeOpacity="0.85"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path d="M -30 -17 C -18 -26 -10 -2 4 -12" fill="none" stroke="#F6D57E" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="28" cy="27" r="3.2" fill="#D9950F" opacity="0.85" />
    </g>
  )
}

const SALT = (() => scatter(rng(31), 16, 40))()

function AvocadoLemon({ uid }) {
  return (
    <g>
      <AvocadoFan uid={uid} />
      {[[-18, -6, 9, 4], [10, 12, 11, 4.5], [-4, 22, 7, 3]].map(([x, y, rx, ry], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#E3C94A" opacity="0.4" />
      ))}
      {SALT.map((s, i) => (
        <rect
          key={i}
          x={(s.x - 1.3).toFixed(1)}
          y={(s.y - 1.3).toFixed(1)}
          width="2.6"
          height="2.6"
          fill="#FFFFFF"
          opacity="0.9"
          transform={`rotate(${s.rot.toFixed(0)} ${s.x.toFixed(1)} ${s.y.toFixed(1)})`}
        />
      ))}
      <g transform="translate(30 30) rotate(-30)">
        <path d="M -17 0 A 17 17 0 0 1 17 0 Z" fill="#F4D547" stroke="#E2AE1A" strokeWidth="3.5" strokeLinejoin="round" />
        {[30, 60, 90, 120, 150].map((a) => (
          <line
            key={a}
            x1="0"
            y1="-1"
            x2={(Math.cos((a * Math.PI) / 180) * -13).toFixed(1)}
            y2={(Math.sin((a * Math.PI) / 180) * -13).toFixed(1)}
            stroke="#FBEFA6"
            strokeWidth="1.4"
          />
        ))}
      </g>
    </g>
  )
}

function Cubes({ seed, count, size, light, mid, dark }) {
  const pts = scatter(rng(seed), count, 40, size * 0.95)
  return (
    <g>
      {pts.map((p, i) => {
        const s = size * (0.85 + p.k * 0.3)
        return (
          <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.rot.toFixed(0)})`}>
            <rect x={-s / 2 + 1.5} y={-s / 2 + 2} width={s} height={s} rx="3.5" fill={dark} />
            <rect x={-s / 2} y={-s / 2} width={s} height={s} rx="3.5" fill={mid} />
            <rect x={-s / 2 + 2} y={-s / 2 + 2} width={s - 6} height={s * 0.4} rx="2.5" fill={light} opacity="0.75" />
          </g>
        )
      })}
    </g>
  )
}

const Tuna = () => <Cubes seed={11} count={10} size={19} light="#D86A73" mid="#AE2F3E" dark="#7C1C29" />
const Beet = () => <Cubes seed={23} count={12} size={17} light="#C4528A" mid="#8E1F52" dark="#5A1033" />

function Ricotta() {
  const blobs = scatter(rng(5), 6, 30, 20)
  return (
    <g>
      {blobs.map((b, i) => {
        const r = 12 + b.k * 7
        return (
          <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.rot.toFixed(0)})`}>
            <ellipse cx="1.5" cy="2.5" rx={r} ry={r * 0.85} fill="#D9D0BE" />
            <ellipse cx="0" cy="0" rx={r} ry={r * 0.85} fill="#F8F4EA" />
            <circle cx={-r * 0.45} cy={-r * 0.3} r={r * 0.55} fill="#FFFFFF" opacity="0.8" />
            <circle cx={r * 0.35} cy={r * 0.2} r={r * 0.2} fill="#ECE4D4" />
          </g>
        )
      })}
    </g>
  )
}

function RedCabbage() {
  const rand = rng(17)
  const cols = ['#6B2A6E', '#81367F', '#5A2160', '#9A4C95']
  const shreds = scatter(rand, 30, 40).map((s) => {
    const len = 18 + rand() * 16
    const bend = (rand() - 0.5) * 22
    return { ...s, len, bend, col: pick(rand, cols), vein: rand() > 0.55 }
  })
  return (
    <g strokeLinecap="round" fill="none">
      {shreds.map((s, i) => {
        const d = `M ${-s.len / 2} 0 Q 0 ${s.bend.toFixed(1)} ${s.len / 2} 0`
        return (
          <g key={i} transform={`translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.rot.toFixed(0)})`}>
            <path d={d} stroke={s.col} strokeWidth="4.2" />
            {s.vein && <path d={d} stroke="#EBD8EA" strokeWidth="1.1" />}
          </g>
        )
      })}
    </g>
  )
}

function Hummus() {
  const rand = rng(41)
  const spiral = []
  for (let a = 0; a < Math.PI * 5; a += 0.25) {
    const r = 4 + a * 2.4
    spiral.push(`${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`)
  }
  const paprika = scatter(rand, 34, 30)
  const chickpeas = [
    [-34, 24], [-26, 34], [30, -30], [38, -18], [26, 36], [-40, -14],
  ]
  return (
    <g>
      <circle cx="1.5" cy="2.5" r="44" fill="#BFA06B" />
      <circle cx="0" cy="0" r="44" fill="#E6CB98" />
      <path d={`M ${spiral.join(' L ')}`} fill="none" stroke="#CBA766" strokeWidth="3.2" strokeLinecap="round" opacity="0.85" />
      {paprika.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={(1.1 + p.k * 1.4).toFixed(2)} fill="#B53A1E" opacity="0.85" />
      ))}
      {chickpeas.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="8" fill="#E2B872" stroke="#B98A47" strokeWidth="1.2" />
          <path d="M -3 -4 q 4 3 1 8" fill="none" stroke="#B98A47" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

function Chicken() {
  // straccetti tagliati e appoggiati quasi paralleli, come escono dalla piastra
  const strips = [
    [-20, -30, 28], [8, -32, 20], [-34, -6, 34], [-6, -8, 24], [22, -10, 16],
    [-22, 18, 30], [4, 16, 22], [28, 16, 34], [-6, 38, 26],
  ]
  return (
    <g>
      {strips.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <rect x="-17" y="-5" width="36" height="12" rx="6" fill="#9A6230" opacity="0.6" />
          <rect x="-18" y="-6" width="36" height="12" rx="6" fill="#D9A15C" />
          <line x1="-8" y1="-5" x2="-12" y2="5" stroke="#9C5E25" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="-5" x2="0" y2="5" stroke="#9C5E25" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <path
        d="M -30 -34 C -14 -28 -22 -12 -6 -8 S 4 10 18 12 S 34 26 30 38"
        fill="none"
        stroke="#B9A47A"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(1 2)"
        opacity="0.5"
      />
      <path
        d="M -30 -34 C -14 -28 -22 -12 -6 -8 S 4 10 18 12 S 34 26 30 38"
        fill="none"
        stroke="#F2E6CA"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
