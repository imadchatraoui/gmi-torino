# Verifiche del 7 ottobre 2026

- TypeScript: `npx tsc --noEmit` superato.
- Compilazione Vinext/Cloudflare Worker: completata.
- HTTP: tutte le 10 pagine del sito restituiscono 200, con un solo titolo H1; le pagine e gli eventi inesistenti restituiscono 404.
- Tutti i 10 collegamenti interni e i 15 asset usati (immagini, font e favicon) sono raggiungibili.
- Desktop: Home e archivio verificati a 1280 px; pagina Chi siamo verificata a 1440 px. Nessun overflow orizzontale della pagina.
- Archivio desktop: lo scorrimento guidato raggiunge l’ultima immagine, indica 10/10 e disabilita il comando successivo. Su finestre basse, touch e movimento ridotto è previsto scorrimento nativo.
- Mobile a 360 px: Home, Chi siamo, Attività, Eventi, Raccontarci, Archivio, Contatti e Privacy senza overflow orizzontale; nessuna immagine rotta nei controlli effettuati. Il menu apre Archivio e si chiude; il comando avanti sposta la galleria a 02/10.
- Galleria: filtri Tutto/Locandine/Fotografie verificati, compreso lo stato senza fotografie. Apertura del visualizzatore, cambio immagine con Freccia destra, chiusura con Esc e ripristino del focus al pulsante originale verificati.
- Nessun errore o avviso nella console durante i controlli della galleria.
- Importazione fotografie: test isolato conferma data da nome file, categoria, esclusione del logo e assenza di duplicati alla seconda esecuzione.
- Font serviti localmente, con licenze incluse. Il codice applicativo non include analytics, pixel, localStorage o embed esterni.

Questi controlli non sono una certificazione WCAG o legale. Le verifiche organizzative prima della pubblicazione pubblica sono descritte in `LAUNCH.md`.
