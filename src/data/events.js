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
      // dopo questa data il bottone Iscriviti sparisce e compare "Iscrizioni chiuse"
      closes: '2026-10-23T23:59:59+02:00',
    },
    // stile proprio dell'evento (classe .theme-ymhs in base.css): scheda evento e pagina del menu
    theme: 'ymhs',
    accent: '#8f9c7d',
    banner: null,
    logo: '/eventi/ymhs/logo-682.webp',
    logoSrcSet: '/eventi/ymhs/logo-340.webp 340w, /eventi/ymhs/logo-682.webp 682w, /eventi/ymhs/logo-1024.webp 1024w',
    // insieme a GMI Torino (loghi vettoriali in public/eventi/ymhs/partner/, ricavati dalle locandine)
    partners: [
      { name: 'Umma Rise', url: 'https://www.instagram.com/ummarise.eu/', logo: '/eventi/ymhs/partner/umma-rise.svg', ratio: 414 / 83, height: 15 },
      // Bayna: la B con il pallino d'oro al centro (dal logo ufficiale, due livelli: segno + pallino)
      { name: 'Bayna', url: 'https://www.instagram.com/baynapsicologia/', logo: '/eventi/ymhs/partner/bayna.svg', dot: '/eventi/ymhs/partner/bayna-punto.svg', ratio: 411 / 595, height: 36 },
    ],
    blocks: { info: true, signup: true, program: true, menu: true },
    // il programma della giornata (dalla locandina; pagina gmitorino.org/programma). Orari di quel giorno, ora di Torino.
    program: [
      { from: '10:00', to: '10:30', title: 'Apertura e introduzione', text: 'Presentazione delle realtà promotrici e delle finalità della giornata' },
      { from: '10:35', to: '11:05', kind: 'Talk', title: 'Between two worlds', who: 'Dott.ssa Najoua Meddad', text: 'Identità, seconde generazioni e minority stress' },
      { from: '11:10', to: '12:40', title: 'Sessione workshop 1', text: 'Tre workshop in parallelo su aspettative e pressione, pressioni sociali e benessere, corpo e immagine' },
      { from: '12:45', to: '13:45', title: 'Pausa pranzo', pause: true, link: { href: '/menu/', label: { it: 'Il menu del pranzo', en: 'The lunch menu' } } },
      {
        from: '13:50',
        to: '14:20',
        title: 'Reading e riflessione collettiva',
        who: 'Fedouà El Attari',
        text: 'Dal libro “The Alchemy of Happiness” di Al-Ghazali',
        link: { href: '/reading/', label: { it: 'Leggi il testo', en: 'Read the text' } },
      },
      { from: '14:25', to: '14:55', kind: 'Talk', title: 'Ihsan', who: 'Shaykh Ibrahim Gabriele Lungo', text: 'Ihsan: la scienza profetica della salute spirituale' },
      { from: '15:00', to: '16:00', kind: 'Panel', title: 'Love, family & pressure', text: 'Confronto sui cambiamenti che attraversano matrimonio, relazioni e famiglia nelle nuove generazioni musulmane' },
      { from: '16:05', to: '17:35', title: 'Sessione workshop 2', text: 'Tre workshop in parallelo su relazioni sane, solitudine e appartenenza, creatività e salute mentale' },
      { from: '17:35', to: '18:05', title: 'Coffee break', pause: true },
      { from: '18:05', to: '18:35', kind: 'Talk', title: 'Healthy community', who: 'Vincenzo Abbatantuono', text: 'Comunità, prevenzione, conflitti giovanili e dipendenze' },
      { from: '18:35', to: '19:05', title: 'Stop Start Continue', text: 'Attività per trasformare le riflessioni in impegni concreti' },
      { from: '19:05', to: '19:30', title: 'Chiusura e ringraziamenti' },
    ],
    menu: {
      meal: { it: 'Il pranzo', en: 'Lunch' },
      // chi ha ideato il menu con noi: sezione prima delle bowl (testo modificabile da /admin)
      collab: {
        name: 'Corpo e Sunnah',
        logo: '/eventi/ymhs/partner/corpo-e-sunnah.svg',
        ratio: 3627 / 2880,
        instagram: 'https://www.instagram.com/corpoesunnah/',
        handle: '@corpoesunnah',
        text: {
          it: 'Il menu del pranzo è stato ideato insieme a Oumaima di Corpo e Sunnah, che ringraziamo per il suo lavoro.',
          en: 'The lunch menu was created together with Oumaima of Corpo e Sunnah, whom we thank for her work.',
        },
      },
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
