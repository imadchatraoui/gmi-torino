# GMI Torino · sito YMHS

Sito di GMI Torino per il **Youth Mental Health Summit** (25 ottobre 2026).

| URL | File | Cosa |
| --- | --- | --- |
| `gmitorino.org/` | `index.html` → `src/home/` | pagina "coming soon" con info evento e link al menu |
| `gmitorino.org/menu/` | `menu/index.html` → `src/menu/` | menu del pranzo: due poke che si aprono con lo scroll |

Vite + Preact (codice scritto in stile React, girato su `preact/compat`): ~13 KB gzip di JS per pagina, nessuna libreria di animazione. Le due pagine sono un build multi-page
(`vite.config.js`), quindi `/menu/` è un file statico vero: funziona su qualunque hosting
statico senza regole di rewrite.

```bash
npm install
npm run dev      # http://localhost:5173 e http://localhost:5173/menu/
npm run build    # output in dist/
npm run preview
```

## Dove si cambiano i contenuti

- `src/data/event.js` — data, orari, luogo, quota, link iscrizioni, temi.
- `src/data/menu.js` — le due opzioni poke e i loro ingredienti (testo esatto del menu).
- `src/styles/` — stile comune (`base.css`), home (`home.css`), menu (`menu.css`).

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
