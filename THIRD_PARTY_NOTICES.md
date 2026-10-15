# Third-party notices

## React Bits

Copyright (c) 2026 David Haz.

The current site includes the official React Bits JS + CSS variants of **GradientText** (main title of the home page) and **StarBorder** (the "Iscriviti" button), in `src/components/react-bits/`, unmodified; site-specific styling is applied from `src/styles/home.css`. Upstream: [reactbits.dev](https://reactbits.dev) and [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits). Added on 15 October 2026.

The old site (now in `_unused/old-site/`) included the React Bits JS/CSS variants of BlurText, Magnet, SpotlightCard and TiltedCard, adapted for GMI, retrieved on 13 October 2026 from revision `496968c4117e21278f13917201b7d615bc5e7450`.

Official sources:

- [BlurText.jsx](https://github.com/DavidHDev/react-bits/blob/496968c4117e21278f13917201b7d615bc5e7450/src/content/TextAnimations/BlurText/BlurText.jsx)
- [Magnet.jsx](https://github.com/DavidHDev/react-bits/blob/496968c4117e21278f13917201b7d615bc5e7450/src/content/Animations/Magnet/Magnet.jsx)
- [SpotlightCard.jsx](https://github.com/DavidHDev/react-bits/blob/496968c4117e21278f13917201b7d615bc5e7450/src/content/Components/SpotlightCard/SpotlightCard.jsx)
- [SpotlightCard.css](https://github.com/DavidHDev/react-bits/blob/496968c4117e21278f13917201b7d615bc5e7450/src/content/Components/SpotlightCard/SpotlightCard.css)
- [TiltedCard.jsx](https://github.com/DavidHDev/react-bits/blob/496968c4117e21278f13917201b7d615bc5e7450/src/content/Components/TiltedCard/TiltedCard.jsx)
- [TiltedCard.css](https://github.com/DavidHDev/react-bits/blob/496968c4117e21278f13917201b7d615bc5e7450/src/content/Components/TiltedCard/TiltedCard.css)

Local adaptations: preference-aware reduced motion, disabled pointer effects on coarse/touch devices, semantic tag and single accessible text for BlurText, transparent card surfaces, responsive image sizing and optional styling props for TiltedCard. The original animations and component implementations are preserved.

The code is incorporated into this website under the upstream MIT + Commons Clause terms. Full upstream license (also available in `src/components/react-bits/REACT_BITS_LICENSE.md`):

```text
MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

# Font

I file in `public/fonts/` sono sottoinsiemi latin (dal pacchetto `@fontsource/poppins`) distribuiti
con licenza **SIL Open Font License 1.1** (https://openfontlicense.org):

- **Poppins** — Copyright 2020 The Poppins Project Authors (https://github.com/itfoundry/Poppins)

Nota: i componenti React Bits elencati sopra appartengono al vecchio sito, ora in `_unused/old-site/`.
