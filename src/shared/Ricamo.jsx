// "La cupola ricamata": l'arabesco che riempie la cupola della Mole nel logo di GMI Torino,
// ridisegnato a tratto. Torino (la Mole) e arte islamica (le volute) nello stesso segno.
//
// <Cupola />  la cupola intera, si disegna da sola all'apertura della home (una volta)
// <Fregio />  fascia orizzontale: piccola cupola al centro e volute ai lati (divisore)

// Una voluta: curva a S che finisce in un ricciolo appuntito, come nel logo.
const VOLUTE_L = [
  // grande S dal centro in basso verso sinistra, chiusa a spirale
  'M120 244 C 100 242, 78 236, 66 220 C 56 206, 62 190, 76 192 C 88 194, 88 210, 76 210 C 70 210, 68 203, 73 201',
  // dal centro verso sinistra, a metà altezza
  'M120 222 C 108 216, 96 204, 94 188 C 92 172, 106 164, 114 172 C 120 178, 114 188, 106 184',
  // verso l'alto
  'M120 196 C 110 184, 104 168, 108 152 C 112 138, 122 134, 120 124',
  'M108 152 C 96 150, 84 158, 82 170 C 80 180, 90 184, 94 178',
  // lungo il bordo della cupola
  'M76 192 C 66 182, 64 168, 72 156 C 80 144, 94 140, 100 128',
  // piccola, verso la base
  'M66 220 C 54 222, 44 232, 46 242 C 48 250, 58 250, 58 244',
  // spine appuntite, come nel logo
  'M66 220 C 58 214, 50 214, 42 218 C 50 222, 58 224, 66 220 Z',
  'M72 156 C 64 152, 60 144, 60 136 C 66 142, 70 148, 72 156 Z',
  'M94 188 C 86 186, 80 180, 78 172 C 84 176, 90 182, 94 188 Z',
  'M108 152 C 104 146, 104 138, 108 132 C 110 140, 110 146, 108 152 Z',
]

function Volute({ d, i }) {
  // le spine (forme chiuse) sono piene
  return <path d={d} className={d.endsWith('Z') ? 'draw spina' : 'draw'} pathLength="1" style={{ '--i': i }} />
}

export function Cupola({ className = '' }) {
  return (
    <svg className={`cupola ${className}`} viewBox="0 0 240 300" aria-hidden="true" focusable="false">
      {/* profilo: tamburo, cupola, lanterna, guglia */}
      <g className="cupola__line">
        <path d="M14 296 H226" className="draw" pathLength="1" style={{ '--i': 0 }} />
        <path d="M22 296 V258 H218 V296" className="draw" pathLength="1" style={{ '--i': 1 }} />
        <path d="M18 258 H222" className="draw" pathLength="1" style={{ '--i': 1 }} />
        <path d="M26 250 C 26 196, 74 128, 110 94 H130 C 166 128, 214 196, 214 250 Z" className="draw" pathLength="1" style={{ '--i': 2 }} />
        <path d="M106 94 V62 H134 V94 M102 62 H138 M112 62 V94 M120 62 V94 M128 62 V94" className="draw" pathLength="1" style={{ '--i': 3 }} />
        <path d="M114 62 L120 4 L126 62" className="draw" pathLength="1" style={{ '--i': 4 }} />
        {Array.from({ length: 13 }, (_, k) => (
          <path key={k} d={`M${36 + k * 14} 264 V272`} className="draw" pathLength="1" style={{ '--i': 2 }} />
        ))}
      </g>
      {/* volute: metà sinistra e la sua copia a specchio */}
      <g className="cupola__ricamo">
        {VOLUTE_L.map((d, k) => (
          <Volute key={`l${k}`} d={d} i={3 + k * 0.4} />
        ))}
        <g transform="translate(240 0) scale(-1 1)">
          {VOLUTE_L.map((d, k) => (
            <Volute key={`r${k}`} d={d} i={3 + k * 0.4} />
          ))}
        </g>
        <path d="M120 244 V100" className="draw" pathLength="1" style={{ '--i': 3 }} />
      </g>
      {/* mezzaluna e stella del logo */}
      <g className="cupola__luna">
        <path d="M196 70 A 18 18 0 1 0 214 98 A 14 14 0 1 1 196 70 Z" />
        <path d="M222 66 L224 71 L229 71 L225 74 L227 79 L222 76 L217 79 L219 74 L215 71 L220 71 Z" />
      </g>
    </svg>
  )
}

const FREGIO_L = [
  'M138 24 C 122 24, 112 12, 96 14 C 82 16, 80 30, 92 30 C 100 30, 100 22, 94 21',
  'M96 14 C 78 8, 60 22, 40 18 C 28 16, 24 6, 34 5 C 40 5, 40 12, 35 12',
  'M40 18 C 26 22, 14 20, 4 20',
  'M78 23 C 72 28, 64 28, 60 24 C 66 22, 72 22, 78 23 Z',
]

export function Fregio({ className = '' }) {
  return (
    <svg className={`fregio ${className}`} viewBox="0 0 300 36" aria-hidden="true" focusable="false">
      <g className="fregio__ricamo">
        {FREGIO_L.map((d) => (
          <path key={d} d={d} />
        ))}
        <g transform="translate(300 0) scale(-1 1)">
          {FREGIO_L.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
      {/* piccola cupola al centro */}
      <path className="fregio__cupola" d="M138 30 C 141 22, 146 14, 148 10 H152 C 154 14, 159 22, 162 30 Z M148 10 V5 H152 V10 M150 5 V1" />
    </svg>
  )
}
