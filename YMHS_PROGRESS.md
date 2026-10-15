# YMHS — stato lavori

Branch: `ymhs-site` (creato da `main` dopo il commit "snapshot pre-YMHS"). Niente push, niente deploy, DNS non toccato.

## Fatto

### Run 1 — 2026-10-15
- Commit "snapshot pre-YMHS" su `main`, poi branch `ymhs-site`.
- Info evento lette dall'Instagram pubblico di @gmi.torino (senza login):
  **Youth Mental Health Summit**, domenica 25 ottobre 2026, 10:00–19:30, Casa del Quartiere di San Salvario (Torino),
  quota 10 €, iscrizioni entro venerdì 23 ottobre, form `forms.gle/fRGgX14NWpU66HHJ9` (link in bio).
  Tutto in `src/data/event.js`.
- Nuovo sito Vite + React, build **multi-page**: `/` (home coming soon) e `/menu/` (menu). Nessuna libreria di animazione:
  JS totale ~76 KB gzip (quasi tutto React), CSS ~5 KB a pagina.
- **Home**: logo, "YMHS" in Bodoni con lettere che salgono, timbro "sito in lavorazione", info (quando/dove/quota),
  countdown in giorni, card "Il menu poke" → `/menu/`, bottone iscrizioni, striscia di carta con i temi, footer.
- **/menu/**: intro + link alle due opzioni, poi per ogni poke una sezione sticky guidata dallo scroll:
  coperchio kraft che si alza e vola via → ogni ingrediente (ordine esatto del menu) si stacca dalla bowl con numero,
  e nella lista sotto si accende il nome. Riepilogo testuale, nota allergie, versetto 2:172 (dal vecchio sito), footer.
- Animazione predisposta per frame/video (`media` in `src/data/menu.js`, componenti `FrameSequence`/`VideoScrub`), documentata nel README.
- `prefers-reduced-motion`: niente sticky, bowl già aperta.
- Asset: logo → `public/brand/gmi-logo.webp` (20 KB); apple-touch-icon, favicon 16, icone Android, manifest sistemati.
  Vecchio sito (componenti WebGL, gif da 2–3 MB, foto settembre) spostato in `_unused/old-site/` (non cancellato).
- README riscritto (vecchio README in `_unused/old-site/README.md`).

### Run 1, iterazione 2
- Opzione 2 verificata aperta; straccetti di pollo ridisegnati (prima sembravano un anello).
- Bowl ingrandita (sfrutta gli angoli liberi dello stage), toppings più grandi.
- Progresso aggiornato direttamente nell'evento scroll (niente rAF in più, niente ritardo dopo i salti con le ancore).
- **Preact** al posto di React (`@preact/preset-vite`, codice invariato via `preact/compat`):
  JS da ~74 KB a **~13 KB gzip** per pagina (+1–2 KB di codice pagina).

### Run 1, iterazione 3
- Font self-hosted in `public/fonts/` (subset latin, ~120 KB totali, preload del Bodoni regolare): niente più Google Fonts.
- Immagine Open Graph `public/og-ymhs.jpg` (1200x630, 68 KB) + meta og/twitter su entrambe le pagine.

- Pagina `404.html` (nessun JS, ~2 KB) inclusa nel build.
- Verificati in screenshot: desktop 1280x800 (home e menu a due colonne) e `prefers-reduced-motion` (bowl già aperte, niente sticky).

### Run 1, iterazione 4
- Home desktop (≥960px): bowl aperta decorativa nella colonna destra dell'hero (montata solo su schermi larghi,
  senza numeri), timbro spostato sulla colonna del testo. Mobile invariato.
- Revisione finale di PokeScroll/HeroBowl: nessun problema trovato.

### Run 2 — 2026-10-15
- Verifica a 375x812 vera: Chrome headless su macOS non scende sotto 500 px di larghezza (gli screenshot con
  `--window-size=375,...` erano tagliati, il sito no). Nuovi script con emulazione CDP:
  `scripts/shot-mobile.mjs` (screenshot 375x812 @2x a varie posizioni di scroll, opzione `--reduce`) e
  `scripts/perf-scroll.mjs` (scroll touch con CPU rallentata 4x, misura i frame).
- Misurato: home e /menu/ a **16,7 ms/frame costanti, 0 frame persi** con CPU 4x durante lo scroll.
- Header sticky reso opaco, senza `backdrop-filter` (il testo traspariva sotto e il blur sopra le sezioni sticky
  animate costa a ogni frame); altezza header ora include `safe-area-inset-top` (iPhone con `viewport-fit=cover`).
- Footer: punto separatore centrato, "Sezione di Torino" non va più a capo a metà.
- Ricontrollati: entrambe le opzioni si aprono, testo ingredienti identico al brief, `prefers-reduced-motion`
  (bowl aperte, niente sticky), nessun overflow orizzontale (scrollWidth = 375).
- Il loop si è fermato qui: quello che resta richiede decisioni o un telefono vero (sotto).

### Sessione 15 ottobre (pomeriggio) — identità e sito ufficiale
Richiesta: sito troppo complesso → creare un'identità su cui costruire il sito ufficiale, con solo
Chi siamo, Eventi, Archivio, Contatti, nello stile di GMI Italia.
- Lo stile nazionale è su **gmitalia.org** (gmiitalia.org non esiste: NXDOMAIN). Valori presi dal suo CSS:
  bianco, teal `#18abaf`, blu `#004a73`, inchiostro `#0f172a`, Poppins, angoli 10 px, bottoni a pillola,
  titolo con gradiente blu→teal.
- **Identità GMI Torino** in `src/styles/base.css` (token) e documentata su **`/identita/`**: logo Torino
  ricolorato col gradiente GMI (maschera CSS, nessun nuovo file), Poppins self-hosted (5 file, ~40 KB),
  accento torinese = **l'arco dei portici** (cornici, badge numerici, arcata del footer), regole di movimento e di voce.
- **Home riscritta** (via countdown grande, timbro, ticker, bowl decorativa): hero "Protagonisti noi, a Torino."
  con chip "Sito in costruzione" e arcata animata il cui portale centrale porta al YMHS; poi
  Chi siamo (testo + cammino Reconnect/Inform/Socialize/Empower di GMI Italia), Eventi (card YMHS con
  iscrizione e link al menu), Archivio (Raccontarci, 26.09.2026: locandina in cornice ad arco + 8 talk in
  carosello, immagini ottimizzate 28–53 KB), Contatti (Instagram, email, GMI Italia).
- Navigazione: su telefono barra flottante in basso con indicatore che scivola sulla sezione in vista;
  su desktop link nell'header.
- Animazioni nuove: righe del titolo che salgono, archi che crescono dal basso in sequenza, riflesso sul
  portale, puntino "live", lettere YMHS in sequenza, arco della card evento, locandina che si apre dal basso,
  archi del cammino. Tutte con transform/opacity (tranne il clip della locandina, una volta sola) e
  disattivate con "riduci movimento".
- /menu/ allineato: Poppins, blu/teal, bollino del coperchio e numeri ricolorati.
- 404 ristilizzata. Rimossi Bodoni/IBM Plex, HeroBowl, Ticker (restano nella storia git).

## Manca / idee per le prossime run
- [ ] Provare su un iPhone vero (scroll sticky + barra Safari): da fare quando il dev server/anteprima è disponibile.
- [ ] Pulizia dipendenze non più usate (react, react-dom, @vitejs/plugin-react, three, ogl, gsap, framer-motion, tailwind) — solo dopo conferma dell'utente.
- [ ] Decidere hosting e DNS (utente).

## Da decidere (utente)
- **Push** del branch `ymhs-site` su GitHub (non fatto).
- **Deploy** su `gmitorino.org`: la cartella `dist/` è statica (`/`, `/menu/`, `404.html`), va bene su
  qualsiasi hosting statico; nessun rewrite necessario per `/menu`.
- **Video/frame Higgsfield**: se arrivano, impostare `media` in `src/data/menu.js` (`type: 'video'` o `'frames'`),
  istruzioni nel README. Senza, resta l'animazione SVG in codice.
- Titoli delle due opzioni e nota allergie (vedi "Decisioni prese").

## Come provare
```bash
npm install
npm run dev        # http://localhost:5173/  e  http://localhost:5173/menu/
npm run build && npm run preview
# screenshot mobile e test fluidità (con `npm run preview -- --port 4179` acceso):
node scripts/shot-mobile.mjs http://localhost:4179/menu/ /tmp/menu.png 0,2000,4000
node scripts/perf-scroll.mjs http://localhost:4179/menu/
```
Su telefono: `npm run dev -- --host` e aprire l'IP del Mac dalla stessa rete Wi-Fi.

## Decisioni prese
- (15/10) Stile del sito = sistema GMI Italia (gmitalia.org), non più carta crema/rosso. Il logo Torino resta lo
  stesso disegno ma viene mostrato col gradiente GMI. Tagline "Protagonisti noi, a Torino." ripresa da quella nazionale.
- (15/10) Archivio: "Raccontarci" con le locandine dei talk pubblicate da GMI Torino; nomi letti dalle locandine.
- Nome evento: uso **"Youth Mental Health Summit"** (come nei post Instagram), non "Young" come nel brief.
- Menu su `/menu/` come file statico (multi-page) → nessuna regola di rewrite sull'hosting.
- Stile carta crema + rosso GMI `#8B181A` + inchiostro `#2A1314`, ispirato al "Save the date" GMI e alla grafica YMHS
  (carta, salvia, blu). Bodoni Moda + IBM Plex Mono. Niente gradienti viola, niente glow, niente emoji.
- Titoli delle opzioni ("Tonno & avocado al miele", "Hummus, pollo & barbabietola") scritti da me sugli ingredienti:
  cambiarli in `src/data/menu.js` se non piacciono. La lista ingredienti è il testo esatto.
- Il numero del referente presente sul poster non è stato messo sul sito (dato personale).
- Nota "Allergie o intolleranze? Chiedi allo staff al banco del pranzo." — da confermare.
- Verifica visiva fatta con Chrome headless su copie statiche (375x812) perché l'avvio del dev server di anteprima è stato rifiutato (anche in run 2).
