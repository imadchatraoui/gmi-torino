// Contenuti del sito GMI Torino. Testi e link si cambiano solo qui.

export const SECTIONS = [
  { id: 'chi-siamo', label: { it: 'Chi siamo', en: 'About us' } },
  { id: 'eventi', label: { it: 'Eventi', en: 'Events' } },
  { id: 'archivio', label: { it: 'Archivio', en: 'Archive' } },
  { id: 'contatti', label: { it: 'Contatti', en: 'Contact' } },
]

// Per ogni sezione: cosa stiamo preparando (il sito è ancora in costruzione).
export const WIP = {
  'chi-siamo': {
    it: 'Presto qui la nostra storia, le persone che portano avanti GMI Torino e come unirti a noi.',
    en: 'Soon: our story, the people behind GMI Torino and how to join us.',
  },
  eventi: {
    it: 'Stiamo preparando il calendario dei prossimi incontri: intanto li annunciamo su Instagram.',
    en: 'We are putting together the calendar of upcoming events: for now we announce them on Instagram.',
  },
  archivio: {
    it: 'Stiamo raccogliendo foto e racconti degli incontri passati: l’archivio crescerà evento dopo evento.',
    en: 'We are collecting photos and stories from past events: the archive will grow event by event.',
  },
  contatti: {
    it: 'Presto potrai scriverci anche da un modulo qui sul sito.',
    en: 'Soon you will also be able to write to us through a form right here.',
  },
}

export const ABOUT = {
  motto: 'Protagonisti noi con l’aiuto di Dio',
  body: [
    {
      it: 'GMI Torino è la sezione torinese di Giovani Musulmani d’Italia, l’associazione che dal 2001 accompagna i giovani musulmani italiani nella crescita spirituale, culturale e sociale.',
      en: 'GMI Torino is the Turin chapter of Giovani Musulmani d’Italia, the association that since 2001 has supported young Italian Muslims in their spiritual, cultural and social growth.',
    },
    {
      it: 'Ci troviamo per stare insieme, imparare e fare la nostra parte nella città: incontri, talk ed eventi aperti a tutti.',
      en: 'We meet to spend time together, learn and do our part in the city: meetups, talks and events open to everyone.',
    },
  ],
  // il "cammino di crescita" di GMI Italia
  path: [
    { title: 'Reconnect', text: { it: 'Riscoprire la propria identità, musulmana e italiana insieme.', en: 'Rediscover who we are, Muslim and Italian together.' } },
    { title: 'Inform', text: { it: 'Conoscere l’islam e viverlo nel contesto in cui cresciamo.', en: 'Learn about Islam and live it where we grow up.' } },
    { title: 'Socialize', text: { it: 'Un ambiente di amicizia, fiducia e accompagnamento.', en: 'A place of friendship, trust and mentoring.' } },
    { title: 'Empower', text: { it: 'Diventare parte attiva e utile della comunità.', en: 'Become active, useful members of the community.' } },
  ],
}

export const ARCHIVE = [
  {
    id: 'raccontarci',
    title: 'Raccontarci',
    subtitle: { it: 'L’Italia, l’identità e le nuove generazioni musulmane', en: 'Italy, identity and the new generations of Muslims' },
    date: { it: 'Sabato 26 settembre 2026', en: 'Saturday 26 September 2026' },
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
  instagram: { url: 'https://www.instagram.com/gmi.torino/', handle: '@gmi.torino' },
  email: 'gmitorino@gmail.com',
  national: { url: 'https://gmitalia.org', label: 'gmitalia.org' },
}
