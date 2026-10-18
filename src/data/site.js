// Contenuti del sito GMI Torino. Testi e link si cambiano solo qui.

// Nell'ordine della pagina: prima quello che c'è già (eventi, contatti), poi quello che arriva.
export const SECTIONS = [
  { id: 'eventi', label: { it: 'Eventi', en: 'Events' } },
  { id: 'contatti', label: { it: 'Contatti', en: 'Contact' } },
  { id: 'chi-siamo', label: { it: 'Chi siamo', en: 'About us' } },
  { id: 'archivio', label: { it: 'Archivio', en: 'Archive' } },
]

export const sectionLabel = (id) => SECTIONS.find((s) => s.id === id)?.label

// Le sezioni ancora in costruzione: in home finiscono sotto la dissolvenza, con una sola nota.
export const WIP = {
  'chi-siamo': {
    it: 'Presto qui la nostra storia, le persone che portano avanti GMI Torino e come unirti a noi.',
    en: 'Soon: our story, the people behind GMI Torino and how to join us.',
  },
  archivio: {
    it: 'Stiamo raccogliendo foto e racconti degli incontri passati: l’archivio crescerà evento dopo evento.',
    en: 'We are collecting photos and stories from past events: the archive will grow event by event.',
  },
}

export const CONTACTS = {
  instagram: { url: 'https://www.instagram.com/gmi.torino/', handle: '@gmi.torino' },
  email: 'gmitorino@gmail.com',
  national: { url: 'https://gmitalia.org', label: 'gmitalia.org' },
}
