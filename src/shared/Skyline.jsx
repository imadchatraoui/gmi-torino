// Skyline di Torino in stile pannello della metro: sagome piene e chiare, senza dettagli.
// Da sinistra: collina e Basilica di Superga, davanti la Gran Madre di Dio, case, Mole Antonelliana.
// I tre monumenti stanno nella fascia centrale (x 240-880), l'unica visibile sul telefono.
// Dietro, le Alpi sfumate con il Monviso. Colori dai token CSS (--sky, --sky-far).
// viewBox 1200x320, appoggiata in basso.

function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const ALPS =
  'M0 236 L34 222 L58 228 L96 196 L118 208 L150 176 L170 186 L196 128 L214 160 L236 150 L262 178 L300 166 ' +
  'L338 186 L372 170 L410 192 L452 176 L490 198 L540 184 L590 204 L640 188 L690 206 L742 190 L800 206 ' +
  'L860 186 L910 200 L962 178 L1010 196 L1060 174 L1100 192 L1150 180 L1200 196 L1200 320 L0 320 Z'

const SUPERGA =
  // collina
  'M0 320 L0 262 C 60 248 104 222 168 214 C 226 208 276 222 334 246 C 372 262 410 274 452 282 L452 320 Z ' +
  // corpo e pronao
  'M130 216 L130 188 L144 188 L170 174 L196 188 L210 188 L210 216 Z ' +
  // campanili
  'M128 190 L128 154 Q 134 142 140 154 L140 190 Z M133 146 L134 132 L135 146 Z ' +
  'M200 190 L200 154 Q 206 142 212 154 L212 190 Z M205 146 L206 132 L207 146 Z ' +
  // tamburo, cupola, lanterna
  'M152 182 L152 152 L188 152 L188 182 Z M149 154 C 151 126 189 126 191 154 Z M165 132 L165 118 L175 118 L175 132 Z M167 119 L170 108 L173 119 Z'

const GRAN_MADRE =
  // scalinata
  'M466 320 L466 300 L474 300 L474 292 L482 292 L482 286 L598 286 L598 292 L606 292 L606 300 L614 300 L614 320 Z ' +
  // pronao e frontone
  'M498 288 L498 248 L582 248 L582 288 Z M492 250 L540 226 L588 250 Z ' +
  // tamburo, cupola, lanterna
  'M508 236 L508 214 L572 214 L572 236 Z M504 216 C 508 178 572 178 576 216 Z M535 186 L535 174 L545 174 L545 186 Z M537 175 L540 166 L543 175 Z'

const MOLE =
  // basamento con colonnato e cornice
  'M722 320 L722 232 L714 232 L714 226 L886 226 L886 232 L878 232 L878 320 Z ' +
  // attico
  'M734 228 L734 206 L866 206 L866 228 Z ' +
  // cupola a sezione quadrata, molto slanciata
  'M742 208 C 750 160 772 130 786 110 L814 110 C 828 130 850 160 858 208 Z ' +
  // tempietto a due ordini
  'M780 112 L780 106 L820 106 L820 112 Z M784 108 L784 84 L816 84 L816 108 Z M788 86 L788 64 L812 64 L812 86 Z ' +
  // guglia con anelli
  'M792 66 L800 8 L808 66 Z M794 48 L806 48 L805 52 L795 52 Z M796 30 L804 30 L803 33 L797 33 Z ' +
  // stella
  'M800 0 L801.8 4.2 L806.2 4.4 L802.8 7.2 L804 11.4 L800 9 L796 11.4 L797.2 7.2 L793.8 4.4 L798.2 4.2 Z'

// case basse tra un monumento e l'altro (forme fisse generate da seme)
const HOUSES = (() => {
  const rand = rng(12)
  const out = []
  const spans = [
    [0, 200],
    [612, 680],
    [844, 1200],
  ]
  spans.forEach(([from, to]) => {
    let x = from
    while (x < to) {
      const w = 22 + Math.floor(rand() * 34)
      const h = 18 + Math.floor(rand() * 40)
      const top = 320 - h
      const roof = rand() > 0.55
      const tower = rand() > 0.9
      let d = roof
        ? `M${x} 320 L${x} ${top} L${x + w / 2} ${top - 10} L${x + w} ${top} L${x + w} 320 Z`
        : `M${x} 320 L${x} ${top} L${x + w} ${top} L${x + w} 320 Z`
      if (tower) d += ` M${x + w / 2 - 4} ${top} L${x + w / 2 - 4} ${top - 34} L${x + w / 2} ${top - 44} L${x + w / 2 + 4} ${top - 34} L${x + w / 2 + 4} ${top} Z`
      out.push(d)
      x += w + (rand() > 0.7 ? 4 : 0)
    }
  })
  return out.join(' ')
})()

export default function Skyline({ className = '' }) {
  return (
    <svg className={`skyline ${className}`} viewBox="0 0 1200 320" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <path className="skyline__far" d={ALPS} />
      <path className="skyline__near" d={SUPERGA} transform="translate(190 0)" />
      <path className="skyline__near" d={`${HOUSES} ${GRAN_MADRE}`} />
      <path className="skyline__near" d={MOLE} transform="translate(-40 0)" />
    </svg>
  )
}
