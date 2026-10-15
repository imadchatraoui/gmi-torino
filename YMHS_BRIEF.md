# Brief — nuovo sito GMI Torino · Young Mental Health Summit (YMHS)

Scritto il 2026-10-14 dalla richiesta dell'utente (Imad). Le run notturne pianificate leggono questo file.

## Obiettivo
Nuovo sito per GMI Torino per il prossimo evento **Young Mental Health Summit (YMHS)** (dettagli evento: Instagram `gmi.torino`).
- Dominio: `gmitorino.org`. **Decisione presa: menu su `gmitorino.org/menu`** (un solo deploy, routing semplice).
- `gmitorino.org` (home) = pagina "coming soon / work in progress" curata, con pochissime cose: logo GMI, teaser YMHS, link ben visibile al menu, link Instagram.
- `/menu` = il pezzo forte: menu poke interattivo.

## Menu (testo esatto dall'utente)
**1st option**
- Riso nero
- Avocado + miele di acacia
- Tonno pescato
- Ricotta/formaggio light
- Cavolo cappuccino rosso

**2nd option**
- Barbabietola
- Ceci in hummus con un po' di paprika
- Avocado con olio evo sale e limone
- Straccetti di pollo con salsa tahina
- Riso nero

## Requisiti
- **95% traffico da telefono**: mobile-first, fluido, niente lag, responsive. Animazioni solo con transform/opacity, `prefers-reduced-motion` rispettato, niente librerie pesanti inutili.
- **Leggero**: ogni immagine/gif ottimizzata (webp/avif, dimensioni corrette, lazy loading). Le gif pesanti in `public/` vanno convertite (es. video mp4/webm muto o webp animato) o tolte se non servono.
- **Esperienza "scroll che apre il poke"**: scrollando, la bowl si apre e gli ingredienti si separano/compaiono uno a uno con il loro nome. Non possiamo generare video Higgsfield: costruire l'animazione in codice (SVG/CSS/canvas, scroll-driven) **predisposta** per sostituirla poi con una sequenza di frame o un video (es. componente che accetta `frames[]` o `src` video scrubbato con lo scroll), documentando nel README come inserirli.
- Animazioni custom + componenti estetici (stile reactbits.dev ecc., il repo li usava già: guarda `src/components/` e la git history `git show HEAD:...` per il vecchio sito).
- **Niente che sembri fatto con AI**: no gradienti viola generici, no emoji decorative, no copy da template, no glow/sparkle cliché. Identità visiva coerente con GMI (logo e colori dal vecchio progetto).
- Lingua: italiano.

## Contesto repo
- Working dir: `/Users/imadchatraoui/Desktop/gmi-menu-2` (copia del vecchio progetto menu, con modifiche non committate — Vite + React + Tailwind).
- Repo GitHub: https://github.com/imadchatraoui/gmi-menu
- Studiare bene la repo prima di iniziare.

## Regole per le run automatiche
- Lavorare su un branch nuovo `ymhs-site` (creato dallo stato attuale, dopo aver committato lo stato esistente così com'è in un primo commit "snapshot pre-YMHS").
- Commit locali frequenti. **NON fare push, NON deployare, NON toccare il DNS** — lo decide l'utente al risveglio.
- Instagram: se non leggibile senza login, non tentare login; usare testo segnaposto chiaramente marcato (es. `TODO: data/luogo evento`).
- Non cancellare file dell'utente senza motivo; asset inutilizzati spostarli in `_unused/` invece di eliminarli.
- Verificare con `npm run build` e un'anteprima a viewport mobile (375x812).
- Aggiornare `YMHS_PROGRESS.md` alla fine di ogni run: cosa è fatto, cosa manca, come provare, decisioni prese.

## Aggiornamento 15/10 sera — nuova direzione (prevale su quanto sopra)
- **Logo**: quello ufficiale di GMI Torino, `_sources/gmi-torino-logo-ufficiale.png` (1009×1009, fondo crema da scontornare). Usarlo nei suoi colori, non ricolorato.
- **Colori e stile**: quelli del logo e delle locandine Instagram di GMI Torino (`_sources/instagram-riferimento-stile.webp`): bordeaux, crema, oro, motivi geometrici/arabeschi sottili. Niente teal/blu GMI Italia.
- **Riferimento a Torino**: a scelta (la Mole è già nel logo; altre idee: portici, skyline, Po).
- **Font**: uno solo per tutto il sito, come il vecchio menu: SF Pro (stack di sistema `-apple-system`), titoli Semibold 600. Unica eccezione: "إن شاء الله" in calligrafia dorata.
- **Home `/`**: in alto "Prossimamente, inshallah" (italiano) + إن شاء الله in arabo; scorrendo, le 4 sezioni Chi siamo, Eventi, Archivio, Contatti.
- **`/design`**: guida all'identità di GMI Torino (sostituisce `/identita/`).
- **`/menu/`**: deve essere fatto benissimo. Solo disegno in codice (niente foto/video per ora). Titoli: "Tonno & avocado al miele", "Hummus, pollo & barbabietola". Solo i due poke. Nota allergie: tenerla.
- Ispirazione: menu.musulmani.org e la repo https://github.com/imadchatraoui/gmi-menu.
- **Push consentito** del branch `ymhs-site` su https://github.com/imadchatraoui/gmi-menu-2 a fine lavoro. Niente deploy, niente DNS.

### Dettagli confermati (15/10 sera, domande e risposte)
- Home: fondo **crema** con bordeaux. In alto "Prossimamente, inshallah" + إن شاء الله in calligrafia **dorata**.
- **Skyline di Torino in stile pannello della metro** (foto di riferimento: `_sources/metro-torino-riferimento.webp`): Mole, Superga, Gran Madre + Alpi sfumate dietro; composizione a mia scelta.
- **Linea della metro** (puntini + nomi inclinati) come navigazione delle sezioni della home: Prossimamente → Chi siamo → Eventi → Archivio → Contatti. **Non** usarla nel menu.
- Sotto il Prossimamente, scorrendo: le 4 sezioni Chi siamo, Eventi, Archivio, Contatti (rifatte nei colori GMI Torino). "Chi siamo" lo scrivo io (sobrio, niente dati inventati).
- **Intro**: il logo animato di Torino (`_unused/old-site/public/cropped gmi.gif` = logo che si costruisce; `animato gif.gif` = riflesso). Niente scritta ASCII. Convertire la GIF in video leggero.
- Illustrazioni: **vettoriali** disegnate da me (SVG dettagliati), niente IA, niente foto stock.
- **Template evento** riutilizzabile, stile e colori GMI Torino, blocchi attivabili/disattivabili: banner + logo evento, info e iscrizione (form), programma e ospiti, menu (non sempre presente). Info eventi da Instagram @gmi.torino. Per ora priorità al **menu**.
- **Accento per evento**: un colore, tenue, sfumato in dissolvenza (gradiente statico, niente `filter: blur`). Il menu YMHS può usare i colori YMHS come accento.
- Menu definitivo su **gmitorino.org/menu**.
- **Archivio automatico**: un giorno dopo la data l'evento passa in Archivio; per 7 giorni in Eventi resta un avviso "Rivedi l'evento" che rimanda all'archivio.
- Email contatti confermata: gmitorino@gmail.com.
- Hosting: **Vercel**. Come aggiungere eventi in futuro: da decidere più avanti (chiedere all'utente).
- **Lingue IT + EN** (traduco io). **Tema chiaro/scuro**: segue il telefono, bottone luna/sole che si ricorda la scelta. Scuro = **bordeaux notte** (quasi cioccolato, testo crema, oro). **Entrambi i bottoni (lingua e tema) in alto a destra**, logo a sinistra.
- Lavoro in autonomia finché c'è utilizzo; push del branch consentito a fine lavoro.
