// Il menu del pranzo YMHS. I nomi degli ingredienti sono quelli esatti forniti da GMI.
//
// `art` sceglie il disegno SVG dell'ingrediente (vedi src/poke/art.jsx).
// `media` (opzionale) sostituisce l'animazione disegnata in codice con frame o video
// scrubbati dallo scroll — istruzioni nel README, sezione "Animazione poke".
export const POKES = [
  {
    id: 'poke-1',
    label: 'Opzione 1',
    title: 'Tonno & avocado al miele',
    items: [
      { name: 'Riso nero', art: 'rice' },
      { name: 'Avocado + miele di acacia', art: 'avocadoHoney' },
      { name: 'Tonno pescato', art: 'tuna' },
      { name: 'Ricotta/formaggio light', art: 'ricotta' },
      { name: 'Cavolo cappuccino rosso', art: 'redCabbage' },
    ],
    media: null,
    // Esempi:
    // media: { type: 'frames', frames: framesFor('option-1', 96), cues: [...] },
    // media: { type: 'video', src: '/poke/option-1.mp4', poster: '/poke/option-1.webp' },
  },
  {
    id: 'poke-2',
    label: 'Opzione 2',
    title: 'Hummus, pollo & barbabietola',
    items: [
      { name: 'Barbabietola', art: 'beet' },
      { name: 'Ceci in hummus con un po\' di paprika', art: 'hummus' },
      { name: 'Avocado con olio evo sale e limone', art: 'avocadoLemon' },
      { name: 'Straccetti di pollo con salsa tahina', art: 'chicken' },
      { name: 'Riso nero', art: 'rice' },
    ],
    media: null,
  },
]

// Utility per una sequenza di frame in public/poke/<cartella>/0001.webp, 0002.webp, ...
export function framesFor(folder, count, ext = 'webp') {
  return Array.from({ length: count }, (_, i) => `/poke/${folder}/${String(i + 1).padStart(4, '0')}.${ext}`)
}
