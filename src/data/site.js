// Contenuti del sito GMI Torino. Testi e link si cambiano solo qui.

// Sezioni della home, nell'ordine della pagina. Chi siamo e Archivio torneranno quando avranno contenuti veri
// (l'archivio compare da solo quando c'è un evento passato, vedi src/home/Home.jsx).
export const SECTIONS = [
  { id: 'eventi', label: { it: 'Eventi', en: 'Events' } },
  { id: 'contatti', label: { it: 'Contatti', en: 'Contact' } },
]

const ARCHIVE = { id: 'archivio', label: { it: 'Archivio', en: 'Archive' } }

export const sectionLabel = (id) => [...SECTIONS, ARCHIVE].find((s) => s.id === id)?.label

export const CONTACTS = {
  instagram: { url: 'https://www.instagram.com/gmi.torino/', handle: '@gmi.torino' },
  email: 'gmitorino@gmail.com',
  national: { url: 'https://gmitalia.org', label: 'gmitalia.org' },
}
