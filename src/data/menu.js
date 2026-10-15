// Il menu del pranzo YMHS. I nomi degli ingredienti sono quelli esatti forniti da GMI.
//
// `art` sceglie il disegno vettoriale dell'ingrediente (vedi src/poke/art.jsx).
// `media` (opzionale) sostituisce l'animazione disegnata con frame o video
// scrubbati dallo scroll — istruzioni nel README, sezione "Animazione poke".
export const POKES = [
  {
    id: 'poke-1',
    label: { it: 'Opzione 1', en: 'Option 1' },
    title: { it: 'Tonno & avocado al miele', en: 'Tuna & honeyed avocado' },
    items: [
      { name: { it: 'Riso nero', en: 'Black rice' }, art: 'rice' },
      { name: { it: 'Avocado + miele di acacia', en: 'Avocado + acacia honey' }, art: 'avocadoHoney' },
      { name: { it: 'Tonno pescato', en: 'Wild-caught tuna' }, art: 'tuna' },
      { name: { it: 'Ricotta/formaggio light', en: 'Ricotta/light cheese' }, art: 'ricotta' },
      { name: { it: 'Cavolo cappuccino rosso', en: 'Red cabbage' }, art: 'redCabbage' },
    ],
    media: null,
    // Esempi:
    // media: { type: 'frames', frames: framesFor('option-1', 96), cues: [...] },
    // media: { type: 'video', src: '/poke/option-1.mp4', poster: '/poke/option-1.webp' },
  },
  {
    id: 'poke-2',
    label: { it: 'Opzione 2', en: 'Option 2' },
    title: { it: 'Hummus, pollo & barbabietola', en: 'Hummus, chicken & beetroot' },
    items: [
      { name: { it: 'Barbabietola', en: 'Beetroot' }, art: 'beet' },
      { name: { it: 'Ceci in hummus con un po\' di paprika', en: 'Chickpea hummus with a little paprika' }, art: 'hummus' },
      { name: { it: 'Avocado con olio evo sale e limone', en: 'Avocado with extra virgin olive oil, salt and lemon' }, art: 'avocadoLemon' },
      { name: { it: 'Straccetti di pollo con salsa tahina', en: 'Chicken strips with tahini sauce' }, art: 'chicken' },
      { name: { it: 'Riso nero', en: 'Black rice' }, art: 'rice' },
    ],
    media: null,
  },
]

// Utility per una sequenza di frame in public/poke/<cartella>/0001.webp, 0002.webp, ...
export function framesFor(folder, count, ext = 'webp') {
  return Array.from({ length: count }, (_, i) => `/poke/${folder}/${String(i + 1).padStart(4, '0')}.${ext}`)
}
