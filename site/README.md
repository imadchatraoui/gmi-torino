# GMI Torino

Sito della sezione torinese dei Giovani Musulmani d’Italia. Identità visiva bordeaux/oro, pagine istituzionali, eventi e archivio visivo con scorrimento guidato dalla pagina su desktop, swipe su mobile e visualizzazione delle immagini in una finestra accessibile.

## Avvio

Richiede Node.js 22.13 o successivo.

```sh
cd site
npm ci
npm run dev
```

L’anteprima locale è su http://127.0.0.1:5173.

```sh
npm run build
npx tsc --noEmit
```

## Contenuti

- `site/content/site.json`: email, Instagram, ente responsabile, URL e stato della verifica per il lancio pubblico.
- `site/content/events.json`: eventi, date ISO, luoghi, stato `upcoming` / `archived`, eventuale link di partecipazione.
- `site/content/gallery.json`: immagini, titoli, descrizioni accessibili, categoria `photo` / `poster`, evento e data visibile.

Raccontarci: **26 settembre 2026**, data confermata dal responsabile del progetto. Luogo, orario e temi provengono dalle locandine fornite. Il sito non inventa appuntamenti futuri, statistiche o fotografie.

## Aggiungere fotografie

Metti le nuove foto JPG, PNG, WebP o AVIF nella radice di questa repo, accanto alle immagini esistenti, e avvia:

```sh
cd site
npm run media:sync
```

Il comando importa le immagini in `site/public/media` e aggiunge le nuove voci alla galleria. Non cancella gli originali. Viene eseguito anche prima di `npm run build`. Usa un nome con `YYYY-MM-DD` per ricavare la data; senza data il sito indica semplicemente «Dall’archivio». I file che contengono `logo`, `cropped` o `gmi_singolo` non vengono importati come fotografie. I GIF non vengono importati nella galleria. Le due GIF originali del logo sono integrate separatamente nell’animazione d’ingresso: `public/media/gmi-build.gif` e `public/media/gmi-shine.gif`.

Per completare il racconto della foto modifica `title`, `subtitle`, `alt`, `eventId` e `dateLabel` nel catalogo. Un titolo e una descrizione specifici sono preferibili ai testi generici dell’importazione. Usa solo immagini autorizzate, soprattutto se sono presenti minori.

## Accessibilità e privacy

Navigazione da tastiera, link per saltare al contenuto, focus visibile, dialoghi con gestione del focus, menu mobile e supporto a `prefers-reduced-motion`. Lo scorrimento dell’archivio torna nativo su dispositivi touch, con movimento ridotto e su finestre basse. I tasti Freccia sinistra/destra, Home ed End funzionano quando la galleria ha il focus; nel visualizzatore le frecce cambiano immagine ed Esc chiude.

Font Manrope ospitato localmente con licenza SIL OFL; i testi non utilizzano corsivo. Nessun analytics, pixel, contenuto social incorporato, newsletter o modulo di registrazione. I link a Instagram e alla posta si aprono solo su azione dell’utente.

La versione Sites è **privata** e non indicizzabile. Prima del lancio pubblico completare la verifica descritta in `site/LAUNCH.md`; `legal.reviewed` è inizialmente `false`. Non rappresenta una certificazione di conformità legale.

## Pubblicazione

Il progetto Sites è associato a `site/.openai/hosting.json`. La pubblicazione usa le procedure del plugin Sites. Non aggiungere token, credenziali o file `.env` al repository. Dopo nuove foto o modifiche ai contenuti, ricompilare e pubblicare una nuova versione.

## Componenti visivi

Il prodotto usa sorgenti ufficiali di [Animate UI](https://animate-ui.com/) e [React Bits](https://reactbits.dev/): Button, Sheet, Dialog, Tabs, Accordion, Fade, Blur; BlurText e SpotlightCard. Threads resta conservato tra le sorgenti ufficiali, ma la landing corrente usa l’illustrazione della Mole. I componenti copiati conservano il sorgente originale. La composizione del sito, i contenuti e la geometria dello scorrimento dell’archivio sono locali.

`licenses/component-sources.json` registra repository, commit, registry e SHA-256 dei 22 file. Le licenze MIT con Commons Clause sono conservate in `licenses/` e nelle copie pubbliche `public/licenses/`. Non ridistribuire i componenti come un prodotto o una libreria di componenti.

L’intro compone le due GIF originali, attende il caricamento e si chiude automaticamente al termine. È saltabile con il pulsante o Esc, ha chiusura su errore e timeout massimo di sicurezza. Con movimento ridotto l’intro non è montata. L’intro non si ripete durante la normale navigazione interna.

## Mole, geometrie e video

La landing utilizza `public/media/mole-geometrie-oro.png`, un’illustrazione originale trasparente creata con ImageGen. Il prompt esatto è conservato in `licenses/mole-illustration-prompt.txt`. Il logo originale rimane distinto dall’illustrazione.

`content/hero-videos.json` configura fino a tre finestre ottagonali. Le due clip attuali sono esempi di repertorio Mixkit richiesti dall’utente: mani su un progetto e un vicolo di Venezia. Non sono presentati come attività di GMI né come riprese di Torino. Fonti e verifica delle licenze sono registrate in `licenses/demo-video-sources.json` e indicate nel visualizzatore. I file sono ospitati localmente; non vengono incorporati player esterni. Le clip non contengono tracce audio.

Su mobile, con movimento ridotto o risparmio dati, le anteprime sono fotografie statiche e non caricano i file video automaticamente. Il tocco apre un dialogo con controlli nativi. Su desktop una sola anteprima alla volta viene riprodotta, senza audio, quando è visibile. Pausa, uscita dal viewport, scheda nascosta e apertura del visualizzatore fermano le anteprime. Esc chiude e restituisce il focus alla finestra selezionata.

Per sostituire un esempio, aggiungere una clip autorizzata e la sua copertina in `public/media/`, aggiornare `src`, `poster`, `title` e `description` nel catalogo, e impostare `demo: false` solo per contenuti reali della sezione. Conservare le autorizzazioni, aggiungere sottotitoli se c’è parlato e aggiornare i crediti prima della pubblicazione. Ricompilare e pubblicare la nuova versione.
