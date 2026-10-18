// Il menu del pranzo YMHS. I nomi degli ingredienti sono quelli esatti forniti da GMI.
//
// SEGRETO: questo file sta fuori da src/ e non finisce mai nel codice del sito.
// Lo legge solo la funzione api/menu.js, che lo consegna al telefono dall'ora indicata
// in src/data/events.js (menu.revealAt) oppure prima, se lo decidi tu (vedi README, "Menu segreto").
//
// `art` sceglie il disegno vettoriale dell'ingrediente (chiavi neutre a1…a8 di TOPPING_ART in src/poke/art.jsx:
// a1 avocado e miele, a2 avocado e limone, a3 tonno, a4 barbabietola, a5 ricotta, a6 cavolo rosso, a7 hummus, a8 pollo).
// `media` (opzionale) sostituisce l'animazione disegnata con frame o video
// scrubbati dallo scroll — istruzioni nel README, sezione "Animazione poke".
export const POKES = [
  {
    id: 'poke-1',
    label: { it: 'Opzione 1', en: 'Option 1' },
    title: { it: 'Tonno & avocado al miele', en: 'Tuna & honeyed avocado' },
    items: [
      { name: { it: 'Riso nero', en: 'Black rice' }, art: 'rice' },
      { name: { it: 'Avocado + miele di acacia', en: 'Avocado + acacia honey' }, art: 'a1' },
      { name: { it: 'Tonno pescato', en: 'Wild-caught tuna' }, art: 'a3' },
      { name: { it: 'Ricotta/formaggio light', en: 'Ricotta/light cheese' }, art: 'a5' },
      { name: { it: 'Cavolo cappuccino rosso', en: 'Red cabbage' }, art: 'a6' },
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
      { name: { it: 'Barbabietola', en: 'Beetroot' }, art: 'a4' },
      { name: { it: 'Ceci in hummus con un po\' di paprika', en: 'Chickpea hummus with a little paprika' }, art: 'a7' },
      { name: { it: 'Avocado con olio evo sale e limone', en: 'Avocado with extra virgin olive oil, salt and lemon' }, art: 'a2' },
      { name: { it: 'Straccetti di pollo con salsa tahina', en: 'Chicken strips with tahini sauce' }, art: 'a8' },
      { name: { it: 'Riso nero', en: 'Black rice' }, art: 'rice' },
    ],
    media: null,
  },
]

// Utility per una sequenza di frame in public/poke/<cartella>/0001.webp, 0002.webp, ...
export function framesFor(folder, count, ext = 'webp') {
  return Array.from({ length: count }, (_, i) => `/poke/${folder}/${String(i + 1).padStart(4, '0')}.${ext}`)
}
