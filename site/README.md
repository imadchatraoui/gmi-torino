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

Il comando importa le immagini in `site/public/media` e aggiunge le nuove voci alla galleria. Non cancella gli originali. Viene eseguito anche prima di `npm run build`. Usa un nome con `YYYY-MM-DD` per ricavare la data; senza data il sito indica semplicemente «Dall’archivio». I file che contengono `logo`, `cropped` o `gmi_singolo` non vengono importati come fotografie. I GIF non vengono importati, per evitare animazioni automatiche.

Per completare il racconto della foto modifica `title`, `subtitle`, `alt`, `eventId` e `dateLabel` nel catalogo. Un titolo e una descrizione specifici sono preferibili ai testi generici dell’importazione. Usa solo immagini autorizzate, soprattutto se sono presenti minori.

## Accessibilità e privacy

Navigazione da tastiera, link per saltare al contenuto, focus visibile, dialoghi con gestione del focus, menu mobile e supporto a `prefers-reduced-motion`. Lo scorrimento dell’archivio torna nativo su dispositivi touch, con movimento ridotto e su finestre basse. I tasti Freccia sinistra/destra, Home ed End funzionano quando la galleria ha il focus; nel visualizzatore le frecce cambiano immagine ed Esc chiude.

Font Manrope e Cormorant Garamond ospitati localmente con licenze SIL OFL. Nessun analytics, pixel, contenuto social incorporato, newsletter o modulo di registrazione. I link a Instagram e alla posta si aprono solo su azione dell’utente.

La versione Sites è **privata** e non indicizzabile. Prima del lancio pubblico completare la verifica descritta in `site/LAUNCH.md`; `legal.reviewed` è inizialmente `false`. Non rappresenta una certificazione di conformità legale.

## Pubblicazione

Il progetto Sites è associato a `site/.openai/hosting.json`. La pubblicazione usa le procedure del plugin Sites. Non aggiungere token, credenziali o file `.env` al repository. Dopo nuove foto o modifiche ai contenuti, ricompilare e pubblicare una nuova versione.
