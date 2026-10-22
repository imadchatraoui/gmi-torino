// Reading e riflessione collettiva (YMHS, 25 ottobre 2026): testi di Fedouà El Attari (EquiLibri d'Oriente),
// riportati così come li ha scritti lei. Si cambiano qui.
export const READING = {
  partner: "EquiLibri d'Oriente",
  // logo in PNG trasparente (contiene il nome); se manca, resta il nome scritto
  partnerLogo: '/eventi/ymhs/reading/equilibri-doriente.png',
  kind: 'Reading & Riflessione Collettiva',
  title: '“The Alchemy of Happiness”',
  original: "(Kīmīyā-yi Sa‘ādat / L'Alchimia della Felicità) — Abu Hamid Al-Ghazali (1058–1111)",
  place: 'Casa del Quartiere di San Salvario, TO',
  question: '“Who are you, where did you come from, and where are you going?”',
  ebook: {
    url: 'https://www.globalgreyebooks.com/alchemy-of-happiness-ebook.html',
    qr: '/eventi/ymhs/reading/qr-libro.svg',
    badge: 'Testo Integrale Gratuito',
    title: 'Scarica il libro completo in PDF',
    text: 'Inquadra il QR code col telefono per accedere e scaricare la traduzione integrale in inglese di Claud Field (Dominio Pubblico).',
    button: 'Apri PDF Ebook',
  },
  excerpt: {
    heading: '1. Estratto di Lettura (Capitolo 1: Knowledge of Self)',
    versions: [
      {
        lang: 'en',
        tag: '🇬🇧 Testo in Inglese (Traduzione Claud Field)',
        before: "“Knowledge of self is the key to the knowledge of God. According to the Hadith: 'He who knows himself knows his Lord.'",
        lead: 'The knowledge which you need to possess is to know:',
        strong: "'Who are you, where did you come from, and where are you going? For what purpose were you created, in what does your true happiness consist, and in what your misery?'",
        after: 'The heart is like a clear mirror. When it is covered with the rust of worldly anxieties and passions, it cannot reflect the light of truth. Purification of the heart consists in cleansing it from this dust, so that it may regain its natural tranquility.”',
      },
      {
        lang: 'it',
        tag: "🇮🇹 Traduzione in Italiano (Per l'ascolto condiviso)",
        before: "“La conoscenza di sé è la chiave per la conoscenza di Dio. Come recita la tradizione: 'Chi conosce se stesso, conosce il suo Signore.'",
        lead: 'La conoscenza che devi possedere consiste nel sapere:',
        strong: "'Chi sei, da dove vieni e dove stai andando? Per quale scopo sei stato creato, in cosa consiste la tua vera felicità e in cosa la tua miseria?'",
        after: 'Il cuore è come uno specchio limpido. Quando si copre della ruggine delle ansie del mondo e delle passioni, non può riflettere la luce della verità. La cura del cuore consiste nel ripulirlo da questa polvere, affinché possa ritrovare la sua naturale tranquillità (sakinah).”',
      },
    ],
  },
  questions: {
    heading: '2. Domande per la Riflessione Condivisa',
    items: [
      ['Sullo specchio del cuore:', 'Qual è la "polvere" o l\'ansia quotidiana che oggi appesantisce il nostro cuore e come possiamo fare spazio per ritrovare chiarezza interiore?'],
      ['Sulla traiettoria personale:', 'Di fronte alla domanda “Where are you going?”, quali sono le coordinate fondamentali che guidano oggi le nostre scelte?'],
      ['Sulla cura di comunità:', 'In che modo la ricerca della pace interiore (sakinah) individuale diventa una risorsa collettiva per sostenere chi ci sta accanto?'],
    ],
  },
  books: {
    heading: '3. Bibliografia Essenziale di Abu Hamid Al-Ghazali',
    items: [
      ['Kīmīyā-yi Sa‘ādat', "(L'Alchimia della Felicità)", "Sintesi accessibile scritta in persiano per guidare l'individuo alla cura del cuore, alla disciplina personale e alla conoscenza interiore."],
      ['Iḥyāʾ ʿUlūm al-Dīn', '(La Rinascita delle Scienze Religiose)', 'Capolavoro monumentale in 40 libri che concilia giurisprudenza, etica, filosofia e dimensione mistica (sufismo).'],
      ['Al-Munqidh min al-Ḍalāl', "(Il Liberatore dall'Errore)", 'Autobiografia spirituale sulla sua crisi intellettuale e il percorso verso la ricerca della verità vissuta.'],
      ['Mishkāt al-Anwār', '(La Nicchia delle Luci)', "Trattato sulla simbolica della luce nel Corano e sulla percezione spirituale dell'anima."],
      ['Ayyuhā al-Walad', '(Lettera a un Discepolo)', "Guida etica e pratica rivolta alle nuove generazioni sull'importanza di trasformare il sapere in azione consapevole."],
    ],
  },
  credits: {
    brand: "EquiLibri d'Oriente",
    role: 'Curatela e Progettazione Culturale',
    curator: 'A cura di Fedouà El Attari • Torino, 2026',
  },
}
