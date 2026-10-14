// Timeline dell'animazione, in "schermate" di scroll.
// Prima si apre il coperchio, poi ogni ingrediente ha il suo tratto di scroll.
export const LID = 0.8 // schermate per aprire il coperchio
export const STEP = 0.6 // schermate per ingrediente
export const TAIL = 0.5 // pausa finale con la bowl aperta

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const easeOut = (t) => 1 - (1 - t) ** 3
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export function buildTimeline(count, cues) {
  const total = LID + STEP * count + TAIL
  const starts = cues ?? Array.from({ length: count }, (_, i) => (LID + STEP * i) / total)
  const dur = (STEP * 0.8) / total
  return {
    total, // schermate di scroll totali (escluso lo sticky stesso)
    lidEnd: LID / total,
    starts,
    dur,
    // progresso locale (0..1) dell'ingrediente i dato il progresso globale p
    local: (p, i) => clamp01((p - starts[i]) / dur),
  }
}
