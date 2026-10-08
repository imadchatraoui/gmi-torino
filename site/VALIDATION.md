# Verifiche del redesign, 8 ottobre 2026

- TypeScript: `npx tsc --noEmit` superato.
- Build Vinext con output Cloudflare Worker completata.
- Runtime compilato locale: tutte le 10 pagine restituiscono HTTP 200 e un unico H1; 30 asset e 12 destinazioni interne verificati, pagine/eventi inesistenti restituiscono 404.
- 22 sorgenti dei componenti (19 Animate UI e 3 React Bits) verificati identici ai registry ufficiali; entrambe le licenze conservate, manifest delle fonti incluso.
- Nessun import di `components/ui` raggiungibile dalle pagine. Rimossa la precedente animazione locale `Motion`.
- Testi delle pagine senza corsivo: controllati stile calcolato e sorgenti. Le scritte originali nelle locandine e nel logo rimangono parte delle immagini.
- Home desktop verificata con logo, BlurText, Threads e SpotlightCard; le locandine sono materiali storici, non la composizione principale del brand.
- Intro osservata con caricamento di entrambe le GIF originali; skip chiude e restituisce il focus al brand. Chiusura naturale, Escape, errore e timeout hanno gestione esplicita. La preferenza di movimento ridotto è controllata dal codice prima del montaggio delle GIF/shader; lightbox ha stato statico per tale preferenza.
- Desktop 1280×720: archivio guidato arriva a 10/10, disabilita il comando avanti e mantiene contenuto e controlli nel viewport sotto l’header.
- Gallery: tab Fotografie mostra lo stato vuoto, Locandine mostra i materiali. Dialog apre, Freccia destra cambia immagine, Esc chiude e restituisce il focus al pulsante originale.
- Mobile reale in frame 360×640: Home, Chi siamo, Attività, Eventi, Raccontarci, Archivio, Contatti, Privacy, Cookie e Note legali senza overflow orizzontale o immagini rotte nei controlli effettuati.
- Menu mobile ha scorrimento verticale su viewport bassi (640 px) e naviga a Contatti richiudendosi. Accordion delle domande frequenti apre correttamente.
- Archivio mobile torna allo scorrimento nativo; comando avanti indica 02/10, visualizzatore apre/chiude e ripristina il focus.
- Nessun errore/avviso nella console durante i controlli della galleria e dell’intro.
- Il frame di test è stato rimosso dal sorgente; non è parte del sito pubblicato.
- Font, immagini e componenti sono serviti localmente; nessun nuovo analytics, pixel, localStorage, embed o modulo aggiunto.

Questi controlli non costituiscono una certificazione WCAG o legale. `LAUNCH.md` descrive le verifiche organizzative prima della pubblicazione pubblica. La verifica iniziale dell’importazione fotografie resta valida: nessuna modifica a quel flusso.
