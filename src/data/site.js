// Contenuti del sito GMI Torino. Testi e link si cambiano solo qui.
import { EVENT } from './event'

export const SECTIONS = [
  { id: 'chi-siamo', label: { it: 'Chi siamo', en: 'About us' } },
  { id: 'eventi', label: { it: 'Eventi', en: 'Events' } },
  { id: 'archivio', label: { it: 'Archivio', en: 'Archive' } },
  { id: 'contatti', label: { it: 'Contatti', en: 'Contact' } },
]

export const ABOUT = {
  lede: 'Siamo la sezione torinese di Giovani Musulmani d’Italia.',
  body: [
    'GMI è l’associazione che dal 2001 accompagna i giovani musulmani italiani nel loro percorso di crescita spirituale, culturale e sociale.',
    'A Torino organizziamo incontri, talk e momenti di comunità: spazi in cui raccontarci, confrontarci e fare la nostra parte nella città in cui viviamo.',
  ],
  // Il "cammino di crescita" di GMI Italia (gmitalia.org)
  path: [
    { title: 'Reconnect', text: 'Riscoprire la propria identità, musulmana e italiana insieme.' },
    { title: 'Inform', text: 'Conoscere l’islam e viverlo nel contesto in cui cresciamo.' },
    { title: 'Socialize', text: 'Un ambiente di amicizia, fiducia e accompagnamento.' },
    { title: 'Empower', text: 'Diventare parte attiva e utile della comunità.' },
  ],
}

export const UPCOMING = [
  {
    id: 'ymhs',
    kicker: 'Prossimo evento',
    title: EVENT.name,
    short: EVENT.short,
    date: EVENT.dateLabel,
    dateISO: EVENT.dateISO,
    time: EVENT.time,
    venue: EVENT.venue,
    city: EVENT.city,
    mapsUrl: EVENT.mapsUrl,
    price: EVENT.price,
    signup: { url: EVENT.signupUrl, note: `Iscrizioni ${EVENT.signupDeadline}` },
    text: 'Una giornata per mettere al centro noi: le pressioni, le domande, le relazioni e tutto quello che spesso non riusciamo a dire.',
    extra: { href: '/menu/', label: 'Il menu del pranzo' },
  },
]

export const ARCHIVE = [
  {
    id: 'raccontarci',
    title: 'Raccontarci',
    subtitle: 'L’Italia, l’identità e le nuove generazioni musulmane',
    date: 'Sabato 26 settembre 2026',
    year: '2026',
    venue: 'Sala conferenze Chiesa Valdese',
    address: 'Corso Vittorio Emanuele II 23, Torino',
    cover: '/archivio/raccontarci/cover.webp',
    talks: [
      { title: 'La nostra voce', who: 'Dalia El Brashy', img: 'talk-1' },
      { title: 'Il gusto di appartenenza', who: 'Veiled Spies, Badr Chatoui', img: 'talk-2' },
      { title: 'Indossare l’identità', who: 'Hind Lafram', img: 'talk-3' },
      { title: 'Nafs el dam', who: 'Omar Chihi', img: 'talk-4' },
      { title: 'Movimento', who: 'Ilias Aouani', img: 'talk-5' },
      { title: 'Giovani protagonisti', who: 'Raisa Labaran, Marzia Sica, Abdullahi Ahmed', img: 'talk-6' },
      { title: 'Prima del logo', who: 'Souad Studio', img: 'talk-7' },
      { title: 'Cambiare il racconto', who: 'Souad Maddahi', img: 'talk-8' },
    ],
  },
]

export const CONTACTS = {
  instagram: { url: EVENT.instagram, handle: '@gmi.torino' },
  email: 'gmitorino@gmail.com',
  national: { url: 'https://gmitalia.org', label: 'gmitalia.org' },
}
