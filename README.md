# GMI Torino - sito

Il sito di GMI Torino (Giovani Musulmani d'Italia), online su **[gmitorino.org](https://gmitorino.org)**.
Ogni push su `main` viene pubblicato da Vercel in automatico.

Identità della sezione: logo ufficiale (PNG trasparente), bordeaux, crema e oro, font di sistema. Volutamente
semplice. Italiano e inglese, tema chiaro e scuro. Lo stile delle locandine YMHS (carta, salvia, blu, Bodoni)
vale solo per le cose dell'evento: la sua scheda in home, `/menu` e `/corposunnah`.

## Pagine

| URL | File | Cosa |
| --- | --- | --- |
| `/` | `index.html` → `src/home/` | "Prossimamente, in sha Allah", eventi, Chi siamo e Archivio (lavori in corso), contatti |
| `/menu` | `menu/index.html` → `src/menu/` | il menu del pranzo: segreto fino all'ora scelta, poi i poke si aprono con lo scroll |
| `/corposunnah` | `corposunnah/index.html` → `src/corposunnah/` | anteprima del menu per Oumaima di Corpo e Sunnah: il link si apre 3 volte (noindex) |
| `/admin` | `admin/index.html` → `src/admin/` | pannello di gestione (password) |
| `/privacy` | `privacy/index.html` → `src/legal/` | privacy e cookie |
| `/design` | `design/index.html` → `src/design/` | guida all'identità (noindex) |

## Pannello /admin

Da telefono, senza toccare il codice (aggiornamenti in diretta entro ~5 secondi):
ora del pranzo e apertura del menu, mi piace (in diretta, azzera, on/off), avviso in alto su tutte le pagine,
iscrizioni aperte/chiuse, piatti e ingredienti del menu, testi dell'evento, sezione Corpo e Sunnah e link
`/corposunnah` (quante aperture usate, riattiva), pioggia di emoji.

## Server (Vercel Functions + Upstash Redis)

- `api/menu.js` — consegna il menu solo dall'ora scelta (o con `?chiave=…` per chi organizza).
- `api/corposunnah.js` — il menu per `/corposunnah`, al massimo 3 aperture (`OPENS`).
- `api/likes.js` — mi piace condivisi, con limite di richieste.
- `api/settings.js` — impostazioni pubbliche lette dal sito; `api/admin.js` — il pannello.
- `server/store.js` — Redis e impostazioni; `server/menu-data.js` — i piatti (mai nel codice del sito).
- Su Vercel: Upstash collegato (`KV_REST_API_URL`/`KV_REST_API_TOKEN`); facoltativi `ADMIN_PASSWORD`,
  `MENU_PREVIEW_KEY`, `MENU_REVEAL` (`open`/`closed`, interruttore d'emergenza).

## Sviluppo

Vite + Preact (import di `react` → `preact/compat`), nessuna libreria di animazione.
In locale le funzioni `api/` girano dentro Vite con un Redis finto in memoria (chiave menu: `prova`).

```bash
npm install
npm run dev      # http://localhost:5173  (/menu/?chiave=prova per vedere il menu)
npm run build    # output in dist/
npm run preview

node scripts/shot-mobile.mjs http://localhost:5173/menu/?nointro /tmp/menu.png "0,#poke-1@0.5,100%" --dark --size=375x667 --en
node scripts/perf-scroll.mjs http://localhost:4173/menu/?nointro   # fotogrammi e dove rallenta
```

## Dove si cambiano i contenuti

- `src/data/events.js` — eventi: data, luogo, iscrizione, partner, ora del menu, collaborazione Corpo e Sunnah.
  Dopo l'evento passa da solo in Archivio.
- `src/data/site.js` — sezioni della home e contatti.
- `src/legal/content.js` — testi di Privacy e cookie.
- Testi IT/EN: ogni testo è `{ it: '…', en: '…' }`. "Giovani Musulmani d'Italia" non si traduce.
- `src/styles/` — `base.css` (colori, temi, componenti condivisi), `home.css`, `menu.css`, `corposunnah.css`,
  `admin.css`, `design.css`, `legal.css`, `torino.css`.
- `src/components/react-bits/` — GradientText, StarBorder, PulseHeart (vedi `THIRD_PARTY_NOTICES.md`).
- `public/eventi/ymhs/partner/` — loghi Umma Rise, Bayna, Corpo e Sunnah in SVG a un colore.

## Prova prima dell'evento (un iPhone e un Android)

1. Intro col logo, poi la pagina scorre bene (anche veloce, su e giù).
2. Tema chiaro/scuro e IT/EN restano scelti alla riapertura; nessuna lettera tagliata.
3. Barra in basso: ogni voce porta alla sezione giusta, senza scatti.
4. Scheda evento: calendario, mappe e "Iscriviti".
5. `/menu` senza chiave: ciotola chiusa e conto alla rovescia. Con `?chiave=ciao`: le bowl si aprono scorrendo.
6. Un mi piace da un telefono si vede sull'altro entro ~10 secondi.
7. Durante il pranzo, per lo staff: `/menu/?chiave=ciao&staff` mostra i mi piace in diretta.

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

Ogni poke in `server/menu-data.js` ha un campo `media`. Se è `null` si usa il disegno in
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

## Pannello /admin

`gmitorino.org/admin` (password scelta da Imad; per cambiarla: variabile `ADMIN_PASSWORD` su Vercel + Redeploy).
Le modifiche valgono subito, senza deploy: sono salvate su Upstash (`gmi:settings`, `server/store.js`).
- Il pranzo: sposta l'ora (+15, +30, −15 min o ora esatta), "Svela adesso", "Tieni nascosto".
- Mi piace in diretta e azzeramento.
- Avviso in cima alla home (IT/EN), acceso o spento.
- Iscrizioni: automatiche (chiudono alla data di `events.js`), aperte o chiuse.
Dopo 10 password sbagliate lo stesso indirizzo aspetta 15 minuti.

## Menu segreto

Il menu è una sorpresa: fino all'ora di pranzo `/menu` mostra la ciotola chiusa e un conto alla rovescia.
I piatti stanno in `server/menu-data.js`, fuori dal codice del sito: li consegna solo la funzione `api/menu.js`,
e solo dall'ora `menu.revealAt` di `src/data/events.js` (ora: domenica 25/10 alle 13:00). Chi ha la pagina aperta
vede il menu comparire da solo; una volta svelato resta salvato sul telefono (si apre anche senza rete).

Controllo manuale, su Vercel → Settings → Environment Variables (poi Deployments → Redeploy):
- `MENU_REVEAL=open` mostra subito il menu a tutti; `MENU_REVEAL=closed` lo tiene nascosto anche dopo l'ora;
  senza la variabile vale l'ora automatica.
- `MENU_PREVIEW_KEY=una-parola` permette a chi organizza di vederlo prima con `gmitorino.org/menu/?chiave=una-parola`.
- In locale (`npm run dev` / `preview`) la chiave è `prova`: `/menu/?chiave=prova`.

I disegni degli ingredienti (`src/poke/art.jsx`) hanno chiavi neutre (a1…a9) per non far capire niente leggendo il codice.

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

## Senza rete

`public/sw.js` (service worker, registrato solo nel sito pubblicato da `src/shared/offline.js`): dopo la prima visita
home e menu si aprono anche senza rete. Pagine: prima la rete, poi la copia salvata; file statici: copia salvata
aggiornata in background; `/api/` mai salvata. Per svuotare le copie dopo un cambio grosso: cambiare `CACHE` in `sw.js`.

## Asset

- Logo: `public/brand/gmi-torino-{160,320,640}.png` (trasparente) e `gmi-torino-scuro-{160,320}.png` per il tema scuro.
  Mai dentro cerchi o riquadri.
- Intro: `public/brand/gmi-torino-intro-l.mp4` / `-d.mp4` (chiaro/scuro), a ogni apertura, si salta con un tocco o un tasto.
- Favicon/icone in `public/` (rigenerate dal logo).
- Il vecchio sito (componenti WebGL, gif pesanti) è stato rimosso il 18/10: resta solo nella storia di git.

## Deploy

Vercel, progetto `gmi-torino` collegato a questo repo (preset Vite, build `npm run build`, output `dist/`, cartella
`api/` come funzioni). Ogni push su `main` va online da solo; il dominio `gmitorino.org` punta già a Vercel.
