// Eventi di GMI Torino, costruiti tutti con lo stesso template (src/event/).
// Ogni evento sceglie:
//   accent  — un solo colore, usato come alone tenue sfumato dietro l'intestazione
//   banner  — immagine in alto (opzionale), logo — logo dell'evento (opzionale)
//   blocks  — quali blocchi mostrare: info, signup, program, menu
// Il giorno dopo la data di fine l'evento passa da solo in Archivio (src/data/when.js).
export const EVENTS = [
  {
    id: 'ymhs',
    slug: 'ymhs',
    short: 'YMHS',
    name: 'Youth Mental Health Summit',
    edition: { it: 'Prima edizione', en: 'First edition' },
    start: '2026-10-25T10:00:00+01:00',
    end: '2026-10-25T19:30:00+01:00',
    date: { it: 'Domenica 25 ottobre 2026', en: 'Sunday 25 October 2026' },
    dayMonth: '25.10',
    time: '10:00 – 19:30',
    venue: 'Casa del Quartiere di San Salvario',
    city: 'Torino',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Casa+del+Quartiere+San+Salvario+Torino',
    price: '10 €',
    signup: {
      url: 'https://forms.gle/fRGgX14NWpU66HHJ9',
      note: { it: 'Iscrizioni entro venerdì 23 ottobre', en: 'Sign up by Friday 23 October' },
    },
    // stile proprio dell'evento (classe .theme-ymhs in base.css): scheda evento e pagina del menu
    theme: 'ymhs',
    accent: '#8f9c7d',
    banner: null,
    logo: '/eventi/ymhs/logo.png',
    // insieme a GMI Torino (loghi vettoriali in public/eventi/ymhs/partner/, ricavati dalle locandine)
    partners: [
      { name: 'Umma Rise', logo: '/eventi/ymhs/partner/umma-rise.svg', ratio: 414 / 83, height: 15 },
      { name: 'Bayna', logo: '/eventi/ymhs/partner/bayna.svg', ratio: 1017 / 778, height: 34 },
    ],
    blocks: { info: true, signup: true, program: false, menu: true },
    menu: {
      meal: { it: 'Il pranzo', en: 'Lunch' },
      // il menu è una sorpresa: i piatti (server/menu-data.js) arrivano al telefono solo da quest'ora
      revealAt: '2026-10-25T13:00:00+01:00',
      note: {
        it: 'Allergie o intolleranze? Chiedi allo staff al banco del pranzo.',
        en: 'Allergies or intolerances? Ask the staff at the lunch counter.',
      },
    },
  },
]

export const eventById = (id) => EVENTS.find((e) => e.id === id)
