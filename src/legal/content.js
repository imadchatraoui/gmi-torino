// Testi di "Privacy e cookie" e "Accessibilità". Si cambiano qui (IT ed EN).
// Blocchi: { p } paragrafo, { list: [...] } elenco, { storage: true } tabella della memoria del browser.
// Nei testi, {email} diventa il link all'email di GMI Torino.

export const UPDATED = { it: '18 ottobre 2026', en: '18 October 2026' }

export const STORAGE = [
  {
    key: 'gmi-theme, gmi-lang',
    what: { it: 'Tema chiaro/scuro e lingua che hai scelto.', en: 'The light/dark theme and language you chose.' },
    kind: { it: 'Preferenza', en: 'Preference' },
  },
  {
    key: 'gmi-liked, gmi-likes-local',
    what: { it: 'I poke a cui hai messo "mi piace", per ricordarli su questo telefono.', en: 'The poke bowls you liked, to remember them on this phone.' },
    kind: { it: 'Funzione', en: 'Feature' },
  },
  {
    key: 'gmi-intro-seen, gmi-menu-pos',
    what: { it: 'Se hai già visto l’intro (la seconda volta è più breve) e il punto del menu dove eri arrivato.', en: 'Whether you have already seen the intro (it is shorter the second time) and where you were in the menu.' },
    kind: { it: 'Funzione', en: 'Feature' },
  },
  {
    key: 'gmi-menu-svelato',
    what: { it: 'Il menu del pranzo, dopo che è stato svelato, per riaprirlo anche senza rete.', en: 'The lunch menu, once revealed, to open it again without a connection.' },
    kind: { it: 'Funzione', en: 'Feature' },
  },
  {
    key: 'gmi-torino-v1',
    what: { it: 'Copia delle pagine e delle immagini del sito (service worker), per aprirlo anche senza rete.', en: 'A copy of the site’s pages and images (service worker), to open it without a connection.' },
    kind: { it: 'Tecnico', en: 'Technical' },
  },
]

export const PRIVACY = {
  kicker: { it: 'Note legali', en: 'Legal' },
  title: { it: 'Privacy e cookie', en: 'Privacy and cookies' },
  intro: {
    it: 'In breve: questo sito non usa cookie, non ti profila e non mostra pubblicità. Salva sul tuo telefono solo le scelte che fai (tema, lingua, "mi piace") e una copia delle pagine per aprirle senza rete.',
    en: 'In short: this site uses no cookies, does not profile you and shows no ads. It only saves on your phone the choices you make (theme, language, likes) and a copy of the pages to open them offline.',
  },
  sections: [
    {
      h: { it: 'Quali dati e perché', en: 'Which data and why' },
      blocks: [
        {
          list: [
            {
              it: 'Navigazione. Come ogni sito, il servizio che lo ospita (Vercel) registra per qualche giorno dati tecnici delle visite (indirizzo IP, browser, pagina, ora) per farlo funzionare e proteggerlo da abusi. Base giuridica: legittimo interesse (art. 6.1.f GDPR).',
              en: 'Browsing. Like every website, the hosting service (Vercel) keeps technical visit data for a few days (IP address, browser, page, time) to run the site and protect it from abuse. Legal basis: legitimate interest (Art. 6(1)(f) GDPR).',
            },
            {
              it: '"Mi piace" sul menu. Il numero dei "mi piace" è anonimo. Per evitare che qualcuno li gonfi, il server usa per circa un minuto un’impronta non reversibile del tuo indirizzo IP, che non viene collegata a te. Base giuridica: legittimo interesse.',
              en: 'Likes on the menu. Like counts are anonymous. To stop anyone inflating them, the server uses an irreversible fingerprint of your IP address for about a minute, which is not linked to you. Legal basis: legitimate interest.',
            },
            {
              it: 'Iscrizioni agli eventi. Avvengono con un modulo Google: i dati che inserisci servono solo a organizzare l’evento. Il modulo ha la sua informativa e vale anche quella di Google.',
              en: 'Event sign-ups. They use a Google form: the data you enter is only used to organise the event. The form has its own notice and Google’s policy applies too.',
            },
            {
              it: 'Contatti. Se ci scrivi via email o Instagram usiamo i tuoi dati solo per risponderti.',
              en: 'Contact. If you write to us by email or Instagram we only use your data to reply.',
            },
          ],
        },
        {
          p: {
            it: 'Non vendiamo né cediamo dati a nessuno, non facciamo profilazione e non usiamo strumenti di pubblicità o di statistica di terze parti.',
            en: 'We do not sell or share data with anyone, we do no profiling and we use no third-party advertising or analytics tools.',
          },
        },
      ],
    },
    {
      h: { it: 'Cookie e memoria del browser', en: 'Cookies and browser storage' },
      blocks: [
        {
          p: {
            it: 'Il sito non usa cookie. Usa la memoria del tuo browser solo per queste cose, tutte tecniche o scelte da te, che secondo le linee guida del Garante Privacy (10 giugno 2021) non richiedono consenso: per questo non vedi banner.',
            en: 'The site uses no cookies. It uses your browser’s storage only for the following, all technical or chosen by you, which under the Italian Data Protection Authority’s guidelines (10 June 2021) need no consent: that is why you see no banner.',
          },
        },
        { storage: true },
        {
          p: {
            it: 'Puoi cancellare tutto quando vuoi dalle impostazioni del browser (cancella dati dei siti). I link a Instagram, Google Maps, Google Moduli e gmitalia.org portano su siti esterni, con le loro regole.',
            en: 'You can delete it all at any time from your browser settings (clear site data). Links to Instagram, Google Maps, Google Forms and gmitalia.org lead to external sites with their own rules.',
          },
        },
      ],
    },

  ],
}
