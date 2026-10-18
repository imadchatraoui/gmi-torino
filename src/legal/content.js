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
      h: { it: 'Chi tratta i dati', en: 'Who handles the data' },
      blocks: [
        {
          p: {
            it: 'Il titolare del trattamento è GMI Torino, sezione torinese di Giovani Musulmani d’Italia APS. Per qualsiasi domanda sui tuoi dati puoi scriverci a {email}.',
            en: 'The data controller is GMI Torino, the Turin chapter of Giovani Musulmani d’Italia APS. For any question about your data you can write to {email}.',
          },
        },
      ],
    },
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
    {
      h: { it: 'Chi ci aiuta', en: 'Who helps us' },
      blocks: [
        {
          list: [
            {
              it: 'Vercel Inc. (Stati Uniti): ospita il sito. I trasferimenti fuori dall’UE avvengono con le garanzie previste dal GDPR (EU-US Data Privacy Framework o clausole contrattuali standard).',
              en: 'Vercel Inc. (United States): hosts the site. Transfers outside the EU rely on the safeguards provided by the GDPR (EU-US Data Privacy Framework or standard contractual clauses).',
            },
            {
              it: 'Upstash: conserva solo i conteggi dei "mi piace", quando la funzione è attiva.',
              en: 'Upstash: stores only the like counts, when that feature is active.',
            },
            {
              it: 'Google: moduli d’iscrizione agli eventi.',
              en: 'Google: event sign-up forms.',
            },
          ],
        },
      ],
    },
    {
      h: { it: 'I tuoi diritti', en: 'Your rights' },
      blocks: [
        {
          p: {
            it: 'Puoi chiederci di vedere, correggere o cancellare i tuoi dati, di limitarne l’uso, di opporti o di riceverli in un formato leggibile, scrivendo a {email}. Se pensi che i tuoi dati non siano trattati bene puoi rivolgerti al Garante per la protezione dei dati personali (garanteprivacy.it).',
            en: 'You can ask us to see, correct or delete your data, to restrict its use, to object or to receive it in a readable format, by writing to {email}. If you think your data is not handled properly you can contact the Italian Data Protection Authority (garanteprivacy.it).',
          },
        },
      ],
    },
  ],
}

export const ACCESSIBILITY = {
  kicker: { it: 'Note legali', en: 'Legal' },
  title: { it: 'Accessibilità', en: 'Accessibility' },
  intro: {
    it: 'Vogliamo che il sito si possa usare da tutti: con il telefono o il computer, con la tastiera, con un lettore di schermo, con il testo ingrandito. Il nostro riferimento sono le linee guida WCAG 2.1 al livello AA.',
    en: 'We want everyone to be able to use the site: on a phone or a computer, with a keyboard, with a screen reader, with enlarged text. Our reference is the WCAG 2.1 guidelines at level AA.',
  },
  sections: [
    {
      h: { it: 'Stato', en: 'Status' },
      blocks: [
        {
          p: {
            it: 'Il sito è parzialmente conforme alle WCAG 2.1 AA. La valutazione l’abbiamo fatta noi (autovalutazione), con controlli automatici e prove a mano, il 18 ottobre 2026.',
            en: 'The site partially conforms to WCAG 2.1 AA. We assessed it ourselves (self-assessment), with automated checks and manual tests, on 18 October 2026.',
          },
        },
      ],
    },
    {
      h: { it: 'Cosa abbiamo fatto', en: 'What we have done' },
      blocks: [
        {
          list: [
            { it: 'Testi a contrasto sufficiente (almeno 4,5:1) sia nel tema chiaro sia in quello scuro.', en: 'Text with sufficient contrast (at least 4.5:1) in both the light and the dark theme.' },
            { it: 'Tutto si usa con la tastiera, con un contorno ben visibile sull’elemento attivo e il link "Vai al contenuto" all’inizio di ogni pagina.', en: 'Everything works with a keyboard, with a clearly visible outline on the active element and a "Skip to content" link at the start of every page.' },
            { it: 'Immagini e loghi hanno un testo alternativo; i bottoni hanno un nome leggibile dai lettori di schermo.', en: 'Images and logos have alternative text; buttons have a name screen readers can read.' },
            { it: 'Con l’impostazione "riduci movimento" del telefono le animazioni si fermano e l’intro col logo non parte.', en: 'With the phone’s "reduce motion" setting, animations stop and the logo intro does not play.' },
            { it: 'Il testo si può ingrandire senza perdere contenuti; lingua della pagina indicata (italiano o inglese).', en: 'Text can be enlarged without losing content; the page language is declared (Italian or English).' },
          ],
        },
      ],
    },
    {
      h: { it: 'Limiti che conosciamo', en: 'Known limitations' },
      blocks: [
        {
          list: [
            { it: 'Le illustrazioni della ciotola nel menu sono decorative: gli ingredienti sono comunque scritti per intero sotto ogni disegno.', en: 'The bowl illustrations on the menu are decorative: the ingredients are always written out in full under each drawing.' },
            { it: 'Alcune sezioni sono ancora in costruzione e mostrano solo una bozza sfocata.', en: 'Some sections are still under construction and only show a blurred draft.' },
            { it: 'Non abbiamo ancora provato il sito con lettori di schermo su tutti i dispositivi.', en: 'We have not yet tested the site with screen readers on every device.' },
          ],
        },
      ],
    },
    {
      h: { it: 'Segnalaci un problema', en: 'Report a problem' },
      blocks: [
        {
          p: {
            it: 'Se qualcosa non riesci a leggere o a usare, scrivici a {email}: ti rispondiamo entro 30 giorni e, se possiamo, ti mandiamo il contenuto in un altro formato.',
            en: 'If there is something you cannot read or use, write to {email}: we reply within 30 days and, if we can, send you the content in another format.',
          },
        },
      ],
    },
  ],
}
