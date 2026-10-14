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

## Manca / idee per le prossime run
- [ ] Provare su un iPhone vero (scroll sticky + barra Safari): da fare quando il dev server/anteprima è disponibile.
- [ ] Pulizia dipendenze non più usate (react, react-dom, @vitejs/plugin-react, three, ogl, gsap, framer-motion, tailwind) — solo dopo conferma dell'utente.
- [ ] Decidere hosting e DNS (utente).

## Come provare
```bash
npm install
npm run dev        # http://localhost:5173/  e  http://localhost:5173/menu/
npm run build && npm run preview
```
Su telefono: `npm run dev -- --host` e aprire l'IP del Mac dalla stessa rete Wi-Fi.

## Decisioni prese
- Nome evento: uso **"Youth Mental Health Summit"** (come nei post Instagram), non "Young" come nel brief.
- Menu su `/menu/` come file statico (multi-page) → nessuna regola di rewrite sull'hosting.
- Stile carta crema + rosso GMI `#8B181A` + inchiostro `#2A1314`, ispirato al "Save the date" GMI e alla grafica YMHS
  (carta, salvia, blu). Bodoni Moda + IBM Plex Mono. Niente gradienti viola, niente glow, niente emoji.
- Titoli delle opzioni ("Tonno & avocado al miele", "Hummus, pollo & barbabietola") scritti da me sugli ingredienti:
  cambiarli in `src/data/menu.js` se non piacciono. La lista ingredienti è il testo esatto.
- Il numero del referente presente sul poster non è stato messo sul sito (dato personale).
- Nota "Allergie o intolleranze? Chiedi allo staff al banco del pranzo." — da confermare.
- Verifica visiva fatta con Chrome headless su copie statiche (375x812) perché l'avvio del dev server di anteprima è stato rifiutato.
