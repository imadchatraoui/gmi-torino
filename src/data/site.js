// Contenuti del sito GMI Torino. Testi e link si cambiano solo qui.

// Sezioni della home, nell'ordine della pagina.
export const SECTIONS = [
  { id: 'chi-siamo', label: { it: 'Chi siamo', en: 'About us' } },
  { id: 'eventi', label: { it: 'Eventi', en: 'Events' } },
  { id: 'archivio', label: { it: 'Archivio', en: 'Archive' } },
  { id: 'contatti', label: { it: 'Contatti', en: 'Contact' } },
]

export const sectionLabel = (id) => SECTIONS.find((s) => s.id === id)?.label

export const CONTACTS = {
  instagram: { url: 'https://www.instagram.com/gmi.torino/', handle: '@gmi.torino' },
  email: 'gmitorino@gmail.com',
  national: { url: 'https://gmitalia.org', label: 'gmitalia.org' },
}
