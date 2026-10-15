import { forwardRef, useId, useImperativeHandle, useMemo, useRef } from 'react'
import './poke-art.css'
import { Bowl, C, FOOD_R, Lid, RiceBed, TOPPING_ART, VIEW } from './art'
import { clamp01, easeInOut, easeOut } from './timeline'

// Angoli (gradi, y verso il basso) dei 4 toppings attorno al riso.
const SLOTS = [-135, -45, 45, 135]
const SLOT_R = 92
const EXPLODE = 84
const ART_SCALE = 1.45
const pct = (v) => (v / VIEW) * 100

const Svg = ({ children }) => (
  <svg viewBox={`0 0 ${VIEW} ${VIEW}`} aria-hidden="true" focusable="false">
    {children}
  </svg>
)

function Marker({ x, y, n }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <circle r="15" fill="#004a73" />
      <circle r="15" fill="none" stroke="#ffffff" strokeWidth="2" />
      <text
        y="5"
        textAnchor="middle"
        fontFamily="'Poppins', system-ui, sans-serif"
        fontSize="14"
        fontWeight="500"
        fill="#ffffff"
      >
        {n}
      </text>
    </g>
  )
}

/**
 * Bowl poke disegnata in SVG, divisa in livelli HTML sovrapposti
 * (ognuno con il suo SVG) così ogni livello si muove solo con transform/opacity
 * e il browser non deve ridisegnare l'SVG durante lo scroll.
 *
 * API imperativa: ref.current.update(p, timeline)
 */
const PokeIllustration = forwardRef(function PokeIllustration({ items, label, markers = true }, ref) {
  const uid = useId().replace(/:/g, '')
  const lidRef = useRef(null)
  const ringRef = useRef(null)
  const riceMarkerRef = useRef(null)
  const layerRefs = useRef([])
  const markerRefs = useRef([])

  // Il riso è la base; gli altri ingredienti occupano i 4 posti attorno.
  const layout = useMemo(() => {
    let slot = 0
    return items.map((item, i) => {
      if (item.art === 'rice') return { i, rice: true }
      const deg = SLOTS[slot++ % SLOTS.length]
      const a = (deg * Math.PI) / 180
      const dir = { x: Math.cos(a), y: Math.sin(a) }
      return {
        i,
        rice: false,
        Art: TOPPING_ART[item.art],
        dir,
        cx: C + dir.x * SLOT_R,
        cy: C + dir.y * SLOT_R,
      }
    })
  }, [items])

  useImperativeHandle(ref, () => ({
    update(p, tl) {
      // coperchio: si solleva, poi scivola via in alto
      const lt = clamp01(p / tl.lidEnd)
      const lift = easeOut(clamp01(lt / 0.3))
      const slide = easeInOut(clamp01((lt - 0.25) / 0.75))
      if (lidRef.current) {
        lidRef.current.style.transform =
          `translate3d(${-14 * slide}%, ${-112 * slide}%, 0) rotate(${-18 * slide}deg) scale(${1 + 0.05 * lift - 0.1 * slide})`
        lidRef.current.style.opacity = String(1 - clamp01((lt - 0.7) / 0.3))
      }

      layout.forEach((l) => {
        const t = tl.local(p, l.i)
        if (l.rice) {
          if (ringRef.current) ringRef.current.style.opacity = String(t <= 0 ? 0 : t < 1 ? Math.sin(t * Math.PI) * 0.9 + 0.1 * t : 0.25)
          if (riceMarkerRef.current) riceMarkerRef.current.style.opacity = String(clamp01((t - 0.35) / 0.4))
          return
        }
        const el = layerRefs.current[l.i]
        if (!el) return
        const e = easeOut(t)
        const pop = Math.sin(t * Math.PI) * 0.12
        el.style.transform = `translate3d(${pct(l.dir.x * EXPLODE * e)}%, ${pct(l.dir.y * EXPLODE * e)}%, 0) scale(${1 + pop})`
        const m = markerRefs.current[l.i]
        if (m) m.style.opacity = String(clamp01((t - 0.55) / 0.35))
      })
    },
  }), [layout])

  const riceIndex = layout.findIndex((l) => l.rice)

  return (
    <div className="poke-art">
      <div className="poke-art__layer">
        <Svg>
          <Bowl uid={uid} />
          <RiceBed />
        </Svg>
      </div>
      {riceIndex >= 0 && (
        <div className="poke-art__layer poke-art__fade" ref={ringRef} style={{ opacity: 0 }}>
          <Svg>
            <circle cx={C} cy={C} r={FOOD_R - 2} fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.5" strokeDasharray="2 9" strokeLinecap="round" />
          </Svg>
        </div>
      )}
      {markers && riceIndex >= 0 && (
        <div className="poke-art__layer poke-art__fade" ref={riceMarkerRef} style={{ opacity: 0 }}>
          <Svg>
            <Marker x={C} y={C + FOOD_R + 2} n={riceIndex + 1} />
          </Svg>
        </div>
      )}
      {layout.map((l) =>
        l.rice ? null : (
          <div
            key={l.i}
            className="poke-art__layer poke-art__move"
            ref={(el) => { layerRefs.current[l.i] = el }}
            style={{ transformOrigin: `${pct(l.cx)}% ${pct(l.cy)}%` }}
          >
            <Svg>
              <g transform={`translate(${l.cx.toFixed(1)} ${l.cy.toFixed(1)}) scale(${ART_SCALE})`}>
                <l.Art uid={`${uid}-${l.i}`} />
              </g>
              {markers && (
                <g ref={(el) => { markerRefs.current[l.i] = el }} style={{ opacity: 0 }}>
                  <Marker x={l.cx + l.dir.x * 80} y={l.cy + l.dir.y * 80} n={l.i + 1} />
                </g>
              )}
            </Svg>
          </div>
        ),
      )}
      <div className="poke-art__layer poke-art__move poke-art__lid" ref={lidRef}>
        <Svg>
          <Lid uid={uid} label={label} />
        </Svg>
      </div>
    </div>
  )
})

export default PokeIllustration
