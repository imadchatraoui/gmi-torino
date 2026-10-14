<div align="center">
  <img src="public/cropped_gmi_singolo-removebg-preview.png" alt="GMI Torino Logo" width="120" />
  <h1>GMI Torino · Immersive Event Experience</h1>
  <p>A breathtaking, mobile-first web application designed for the <strong>Giovani Musulmani d'Italia (Torino)</strong> event.</p>

  <div>
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
  </div>
</div>

---

## Overview

Built to deliver a premium, fluid, and highly interactive user experience through advanced WebGL rendering and physics-based animations. The project abandons standard flat UI paradigms in favor of immersive 3D textures, animated typography, and dynamic transitions, while remaining heavily optimized for mobile devices.

## Key Features

- **Immersive 3D Graphics:** Utilizes `Three.js` and `OGL` for stunning visual effects (like the interactive `DriftWall` background and `MorphSlider` melt transitions).
- **ASCII WebGL Text:** Custom-built hardware-accelerated text renderer that converts typography into animated ASCII art.
- **Silky Smooth UI:** Powered by `Framer Motion` and `GSAP` for scroll-linked animations, text reveals, and seamless page overlays.
- **Extreme Mobile Optimization:** Dynamically mounts/unmounts heavy Canvas/WebGL components using `IntersectionObserver` to preserve battery life and maintain 60FPS on smartphones.
- **Dark & Elegant Aesthetics:** Carefully crafted palette featuring deep crimsons (`#2A1314`) and rich gold (`#D8A86C`), avoiding generic "AI-generated" looks.

## 🛠️ Architecture & Performance

This project relies heavily on hardware-accelerated graphics. To ensure it runs perfectly on mid-range smartphones without overheating:
- **Zero-DOM-Leak:** WebGL contexts and textures are forcefully disposed of when components unmount (`CanvAscii.dispose()`, `DriftWall` observer disconnects).
- **Viewport Culling:** Heavy components (`DriftWall`, `MorphSlider`, `ASCIIText`) are completely unmounted from the React Tree when scrolled out of view.
- **Aggressive Caching:** Animated assets (like WebP) are systematically paused/cleared in the background to avoid Firefox/Safari endless memory-loop bugs.

## 📂 Project Structure

```text
src/
├── components/
│   ├── ASCIIText.jsx      # WebGL ASCII Text Renderer
│   ├── DriftWall.jsx      # 3D Parallax Image Wall
│   ├── MorphSlider.jsx    # OGL WebGL Image Transition Slider
│   ├── GlitchText.jsx     # CSS Glitch Effect
│   ├── pages/             # Overlay Sub-Pages (Menu, Evento, Chi Siamo, Contatti)
│   └── ui/                # Reusable UI Elements
├── App.jsx                # Main Application & Router logic
├── index.css              # Global styles & Tailwind entry
└── main.jsx               # Entry Point
```

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- `npm`, `yarn`, or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/menu-gmi.git
   cd menu-gmi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🤝 Context & Credits
Developed for **Giovani Musulmani d'Italia (Sezione Torino)**.
Designed with love, pairing modern interactive coding techniques with custom photography and authentic storytelling.
