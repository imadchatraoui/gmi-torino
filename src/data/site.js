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

export const CONTACTS = {
  instagram: { url: 'https://www.instagram.com/gmi.torino/', handle: '@gmi.torino' },
  email: 'gmitorino@gmail.com',
  national: { url: 'https://gmitalia.org', label: 'gmitalia.org' },
}
