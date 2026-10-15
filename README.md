# GMI Torino · sito

Base del sito ufficiale di GMI Torino, con l'identità visiva della sezione
(sistema GMI Italia di [gmitalia.org](https://gmitalia.org) + l'arco dei portici torinesi).

| URL | File | Cosa |
| --- | --- | --- |
| `gmitorino.org/` | `index.html` → `src/home/` | Chi siamo, Eventi, Archivio, Contatti (+ chip "Sito in costruzione") |
| `gmitorino.org/menu/` | `menu/index.html` → `src/menu/` | menu del pranzo YMHS: due poke che si aprono con lo scroll |
| `gmitorino.org/identita/` | `identita/index.html` → `src/identity/` | guida all'identità visiva: marchio, colori, tipografia, arco, movimento, voce |

Vite + Preact (codice scritto in stile React, girato su `preact/compat`): ~13 KB gzip di JS per pagina,
nessuna libreria di animazione. Build multi-page (`vite.config.js`): ogni URL è un file statico vero,
funziona su qualunque hosting statico senza regole di rewrite.

```bash
npm install
npm run dev      # http://localhost:5173 e http://localhost:5173/menu/
npm run build    # output in dist/
npm run preview
```

## Dove si cambiano i contenuti

- `src/data/site.js` — testi di Chi siamo, eventi in programma, archivio, contatti, voci di navigazione.
- `src/data/event.js` — data, orari, luogo, quota, link iscrizioni del YMHS.
- `src/data/menu.js` — le due opzioni poke e i loro ingredienti (testo esatto del menu).
- `src/styles/` — identità e componenti comuni (`base.css`: colori, Poppins, bottoni, header, footer, comparse),
  home (`home.css`), menu (`menu.css`), guida identità (`identity.css`).
- Nuovo evento in archivio: aggiungere un oggetto in `ARCHIVE` (`src/data/site.js`) e le immagini in
  `public/archivio/<id>/` (webp, ~560 px di larghezza, `cwebp -q 72 -resize 560 0`).

## Animazione poke

`src/poke/PokeScroll.jsx` crea una sezione alta alcune schermate con uno stage
`position: sticky`. Lo scroll produce un progresso `p` da 0 a 1 che guida:

1. il coperchio che si solleva e scivola via;
2. gli ingredienti, uno alla volta nell'ordine del menu: ognuno si stacca dalla bowl
   e compare il suo numero, mentre nella lista sotto si accende il nome.

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

## Asset

- Logo: `public/brand/gmi-logo.webp` (320 px, ~20 KB) generato dal PNG originale.
- Favicon/icone in `public/` (rigenerate dal logo).
- Il vecchio sito (componenti WebGL, gif animate da 2–3 MB, foto evento di settembre) è
  in `_unused/old-site/`: non entra nel build.

## Deploy

Non ancora fatto: va deciso dove pubblicare (`dist/` è un sito statico) e come puntare il
DNS di `gmitorino.org`.
