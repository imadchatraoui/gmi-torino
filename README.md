# GMI Torino · sito

Sito di GMI Torino con l'identità della sezione: logo ufficiale (PNG trasparente), bordeaux, crema e oro,
font di sistema SF Pro. Volutamente semplice: niente elementi decorativi "torinesi". Italiano e inglese,
tema chiaro e scuro (segue il telefono; bottoni in alto a destra). Lo stile delle locandine YMHS (carta,
salvia, blu, Bodoni) vale solo per le cose dell'evento: la sua scheda e la pagina `/menu/`.

| URL | File | Cosa |
| --- | --- | --- |
| `gmitorino.org/` | `index.html` → `src/home/` | "Prossimamente, inshallah" + Chi siamo, Eventi, Archivio, Contatti |
| `gmitorino.org/menu/` | `menu/index.html` → `src/menu/` | menu del pranzo del prossimo evento: i poke si aprono con lo scroll |
| `gmitorino.org/design/` | `design/index.html` → `src/design/` | guida all'identità: marchio, intro, colori, tipografia, stile evento, template, movimento, componenti, voce |

Vite + Preact (codice scritto in stile React: gli import di `react` puntano a `preact/compat`), nessuna libreria di animazione.
Dipendenze: solo `preact` e `@hugeicons/core-free-icons` (le icone del cuore); in sviluppo `vite`, `@preact/preset-vite`, `oxlint`.
Build multi-page (`vite.config.js`): ogni URL è un file statico vero, funziona su Vercel o qualunque
hosting statico senza regole di rewrite.

```bash
npm install
npm run dev      # http://localhost:5173 e http://localhost:5173/menu/  (?nointro salta l'intro)
npm run build    # output in dist/
npm run preview

# controlli da telefono simulato (Chrome headless, 375x812 @2x)
node scripts/shot-mobile.mjs http://localhost:5173/menu/?nointro /tmp/menu.png "0,#poke-1@0.5,100%" --dark --size=375x667 --en
node scripts/perf-scroll.mjs http://localhost:4173/menu/?nointro   # CPU 4x, fotogrammi e dove rallenta
```

## Dove si cambiano i contenuti

- `src/data/events.js` — gli eventi (template): data, luogo, quota, iscrizione, colore d'accento, banner, logo,
  blocchi accesi (`info`, `signup`, `program`, `menu`). Un giorno dopo la fine l'evento passa da solo in Archivio
  e per 7 giorni in Eventi resta un avviso che rimanda lì (`src/data/when.js`).
- `src/data/site.js` — testi "Ci stiamo lavorando" delle sezioni (`WIP`), contatti, voci di navigazione.
- `src/data/menu.js` — le due opzioni poke e i loro ingredienti (testo esatto del menu).
- Testi IT/EN: ogni testo è `{ it: '…', en: '…' }`. "Giovani Musulmani d'Italia" non si traduce.
- `src/styles/` — `base.css` (colori, temi, header, footer, bottoni, intro, componenti condivisi), `torino.css`
  (solo la calligrafia إن شاء الله), `home.css`, `menu.css`, `design.css`.
- `src/components/react-bits/` — GradientText (titolo), StarBorder (Iscriviti), PulseHeart (like): sorgenti ufficiali
  non modificate, ricolorate da fuori (vedi `THIRD_PARTY_NOTICES.md`).
- L'archivio si riempie da solo: un giorno dopo la fine, un evento di `src/data/events.js` passa in Archivio.

## Animazione poke

`src/poke/PokeScroll.jsx` crea una sezione alta alcune schermate con uno stage
`position: sticky`. Lo scroll produce un progresso `p` da 0 a 1 che guida:

1. il coperchio (kraft, con l'adesivo GMI Torino) che si solleva e scivola via di lato;
2. il giro degli ingredienti, nell'ordine del menu: quello di turno si solleva, gli altri
   si attenuano, compare il suo numero e nella lista sotto si accende il nome. Alla fine
   resta la ciotola completa e numerata.

Durante lo scroll React non fa re-render: vengono scritti solo `transform`/`opacity`
sui livelli (un `<div>` con il suo SVG per ingrediente). Con `prefers-reduced-motion`
la sezione non è sticky e mostra subito la bowl aperta.

I tempi sono in `src/poke/timeline.js` (`LID`, `STEP`, `TAIL` in schermate di scroll).
I disegni sono in `src/poke/art.jsx`.

### Sostituire il disegno con frame o video (es. Higgsfield)

Ogni poke in `src/data/menu.js` ha un campo `media`. Se è `null` si usa il disegno in
codice; altrimenti:

**Sequenza di frame** (consigliata: scrub perfetto anche su iPhone)

```js
import { framesFor } from './menu'
// public/poke/option-1/0001.webp ... 0096.webp
media: { type: 'frames', frames: framesFor('option-1', 96) },
```

Estrarre e comprimere i frame da un video:

```bash
mkdir -p public/poke/option-1
ffmpeg -i option-1.mp4 -vf "fps=24,scale=720:-1" -c:v libwebp -quality 70 public/poke/option-1/%04d.webp
```

720 px di lato e ~80–120 frame bastano: restare sotto ~3 MB a sequenza.

**Video scrubbato**

```js
media: { type: 'video', src: '/poke/option-1.mp4', poster: '/poke/option-1.webp' },
```

Il video va codificato con un keyframe per frame, altrimenti lo scrub scatta:

```bash
ffmpeg -i input.mp4 -an -vf "scale=720:-1" -c:v libx264 -g 1 -crf 26 -movflags +faststart public/poke/option-1.mp4
```

**Sincronizzare i nomi degli ingredienti** con il video: `cues` indica a che punto
(0–1) dello scroll parte ogni ingrediente.

```js
media: { type: 'frames', frames: framesFor('option-1', 96), cues: [0.2, 0.34, 0.48, 0.62, 0.76] },
```

## Like condivisi sui poke

Ogni poke ha un cuore (PulseHeart di React Bits) nella scelta in alto e accanto al titolo.
- `api/likes.js` — funzione Vercel: `GET /api/likes?ids=poke-1,poke-2` → `{ counts }`,
  `POST /api/likes` con `{ id, delta: 1 | -1 }` → `{ id, count }`. Salva in Upstash Redis (hash `gmi:likes`).
- `src/shared/likes.js` — lato telefono: il "mi piace" di questo telefono resta in localStorage,
  i numeri arrivano dall'API. Se l'API non risponde (chiavi mancanti, rete assente) passa al
  ripiego locale: il cuore funziona lo stesso ma il numero vale solo su quel telefono.
- In locale (`npm run dev` / `npm run preview`) `/api/likes` gira con un Redis finto in memoria
  (`vite.config.js`), condiviso tra i dispositivi collegati al Mac finché il server resta acceso.

Per accenderli davvero su Vercel: progetto Vercel → Storage / Marketplace → Upstash Redis →
collegarlo al progetto. Vercel aggiunge da solo `KV_REST_API_URL` e `KV_REST_API_TOKEN`
(vanno bene anche `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`). Il piano gratuito basta.

## Asset

- Logo: `public/brand/gmi-torino-{160,320,640}.png` (trasparente) e `gmi-torino-scuro-{160,320}.png` per il tema scuro.
  Mai dentro cerchi o riquadri.
- Intro: `public/brand/gmi-torino-intro-l.mp4` / `-d.mp4` (chiaro/scuro), a ogni apertura, si salta con un tocco o un tasto.
- Favicon/icone in `public/` (rigenerate dal logo).
- Il vecchio sito (componenti WebGL, gif animate da 2–3 MB, foto evento di settembre) è
  in `_unused/old-site/`: non entra nel build.

## Deploy

Non ancora fatto (da decidere: vedi `YMHS_PROGRESS.md`). Su Vercel: progetto collegato al repo, preset Vite,
build `npm run build`, output `dist/`; la cartella `api/` diventa la funzione dei like. Poi il dominio
`gmitorino.org` va puntato a Vercel dal pannello del registrar.
