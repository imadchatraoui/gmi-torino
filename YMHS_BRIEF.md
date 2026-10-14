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
