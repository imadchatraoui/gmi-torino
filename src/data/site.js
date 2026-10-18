// Contenuti del sito GMI Torino. Testi e link si cambiano solo qui.

// Sezioni della home, nell'ordine della pagina.
export const SECTIONS = [
  { id: 'chi-siamo', label: { it: 'Chi siamo', en: 'About us' } },
  { id: 'eventi', label: { it: 'Eventi', en: 'Events' } },
  { id: 'archivio', label: { it: 'Archivio', en: 'Archive' } },
  { id: 'contatti', label: { it: 'Contatti', en: 'Contact' } },
]

export const sectionLabel = (id) => SECTIONS.find((s) => s.id === id)?.label

// Chi siamo: testo breve e vero. Le voci di "cosa facciamo" vengono da quello che GMI Torino pubblica su Instagram.
export const ABOUT = {
  lede: {
    it: 'GMI Torino è la sezione torinese di Giovani Musulmani d’Italia. Ci troviamo per stare insieme, imparare e fare la nostra parte nella città.',
    en: 'GMI Torino is the Turin chapter of Giovani Musulmani d’Italia. We meet to spend time together, learn and do our part in the city.',
  },
  doing: [
    {
      title: { it: 'Incontri e talk', en: 'Meetups and talks' },
      text: { it: 'Su fede, crescita personale e vita di tutti i giorni, con ospiti e tra di noi.', en: 'On faith, personal growth and everyday life, with guests and among ourselves.' },
    },
    {
      title: { it: 'Eventi', en: 'Events' },
      text: { it: 'Giornate pensate per i giovani della città, come lo Youth Mental Health Summit.', en: 'Days designed for the young people of the city, like the Youth Mental Health Summit.' },
    },
    {
      title: { it: 'Uscite', en: 'Trips' },
      text: { it: 'Stare insieme anche fuori da Torino: camminate, gite, tempo all’aria aperta.', en: 'Time together outside Turin too: walks, trips, time outdoors.' },
    },
  ],
}

export const CONTACTS = {
  instagram: { url: 'https://www.instagram.com/gmi.torino/', handle: '@gmi.torino' },
  email: 'gmitorino@gmail.com',
  national: { url: 'https://gmitalia.org', label: 'gmitalia.org' },
}
