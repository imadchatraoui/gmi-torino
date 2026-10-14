import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ASCIIText from './components/ASCIIText';
import ScrollReveal from './components/ScrollReveal';
import DriftWall from './components/DriftWall';
import MorphSlider from './components/MorphSlider';
import Accordion from './components/Accordion';
import { MenuToggle } from './components/ui/menu-toggle';
import TextLoop from './components/TextLoop';
import {
  PageMenu,
  PageEvento,

  PageChiSiamo,
  PageContatti
} from './components/pages/MenuPages';

// ==========================================
// ELEMENTI DRIFT WALL (React Bits 3D Wall)
// ==========================================
const DRIFT_ITEMS = [
  { image: '/IMG_6669.webp', title: 'Dalia' },
  { image: '/IMG_6670.webp', title: 'Mediterranea' },
  { image: '/IMG_raccontarci.webp', title: 'Contadina' },
  { image: '/IMG_6671.webp', title: 'Mediterranea' },
  { image: '/IMG_6672.webp', title: 'Contadina' },
  { image: '/IMG_savedate.webp', title: 'Mediterranea' },
  { image: '/IMG_6673.webp', title: 'Contadina' },
  { image: '/IMG_6674.webp', title: 'Mediterranea' },
  { image: '/cropped_gmi_singolo-removebg-preview.png', title: 'Logo GMI' },
  { image: '/IMG_6675.webp', title: 'Contadina' },
  { image: '/IMG_6676.webp', title: 'Mediterranea' },
];

// Accordion items — replace the old "info" section
const ACCORDION_ITEMS = [
  {
    title: 'Informazioni Generali',
    content: (
      <p>
        Una giornata di incontri, testimonianze, dialoghi e workshop dedicata alle nuove generazioni musulmane in Italia e al modo in cui scelgono di raccontare la propria identità.<br/><br/>
        Attraverso voce, cultura, moda, cibo, sport e impegno sociale, l’evento vuole creare uno spazio in cui i giovani possano essere protagonisti del racconto di sé stessi e del proprio ruolo nella società.
      </p>
    )
  },
  {
    title: 'Programma',
    content: (
      <ul style={{ paddingLeft: '0', listStyle: 'none', lineHeight: 1.8, margin: 0, fontSize: '0.85rem' }}>
        <li><strong style={{ color: '#D8A86C' }}>10:00 - 10:15</strong> – Accoglienza e registrazione</li>
        <li><strong style={{ color: '#D8A86C' }}>10:15 - 10:30</strong> – Saluti e apertura evento</li>
        <li><strong style={{ color: '#D8A86C' }}>10:30 - 11:00</strong> – La nostra voce (Talk di Dalia El Brashy)</li>
        <li><strong style={{ color: '#D8A86C' }}>11:05 - 11:40</strong> – Stesso sangue (Talk di Omar Chihi)</li>
        <li><strong style={{ color: '#D8A86C' }}>11:45 - 12:20</strong> – Indossare l'identità (Talk di Hind Lafram)</li>
        <li><strong style={{ color: '#D8A86C' }}>12:30 - 13:50</strong> – Pranzo</li>
        <li><strong style={{ color: '#D8A86C' }}>14:00 - 15:00</strong> – Il gusto di appartenenza (Badr Chatoui, Veiled Spies)</li>
        <li><strong style={{ color: '#D8A86C' }}>15:05 - 16:05</strong> – Giovani protagonisti (Raisa Labaran, Marzia Sica, Abdullahi Ahmed)</li>
        <li><strong style={{ color: '#D8A86C' }}>16:10 - 16:40</strong> – Coffee break</li>
        <li><strong style={{ color: '#D8A86C' }}>16:45 - 17:45</strong> – Movimento (Intervista a Ilias Aouani)</li>
        <li><strong style={{ color: '#D8A86C' }}>17:50 - 19:10</strong> – Workshop (Soaud Maddahi / Souad Studio)</li>
        <li><strong style={{ color: '#D8A86C' }}>19:15 - 19:30</strong> – Saluti finali</li>
      </ul>
    )
  }
];


// Nav menu items
const NAV_ITEMS = [
  { label: 'Menu',      page: 'menu' },
  { label: "L'Evento",  page: 'evento' },
  { label: 'Chi Siamo', page: 'chisiamo' },
  { label: 'Contatti',  page: 'contatti' },
];

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [headerAnimating, setHeaderAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState(null); // null | 'menu' | 'evento' | 'chisiamo' | 'contatti'
  const [heroVisible, setHeroVisible] = useState(true);
  const [activeSliderIndex, setActiveSliderIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setHeroVisible(window.scrollY < (window.innerHeight || document.documentElement.clientHeight) * 1.2);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rendiamo i componenti pesanti della Hero solo se visibili e se nessuna sub-page è attiva a schermo intero
  const shouldRenderHero = heroVisible && !activePage;

  useEffect(() => {
    if (imageLoaded) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setTimeout(() => { ScrollTrigger.refresh(); }, 1100);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [imageLoaded]);

  const handleHeaderClick = () => {
    setHeaderAnimating(true);
    setTimeout(() => { window.location.reload(); }, 3000);
  };

  const openPage = (page) => {
    setMenuOpen(false);
    setTimeout(() => setActivePage(page), 350); // wait for menu exit animation
  };

  const closePage = () => setActivePage(null);

  // Elemento per il MorphSlider
  const menuItems = useMemo(() => [
    { 
      image: '/contadina.webp',  
      caption: (
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-lg sm:text-xl text-[#D8A86C] font-bold uppercase tracking-wider">Contadina</span>
          <span className="text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-2xl text-center">
            Rucola, pomodorini datterini, crema di funghi fatta con formaggio Kinara stagionato piemontese (caglio vegetale).
          </span>
        </div>
      )
    },
    { 
      image: '/mediterranea.webp',    
      caption: (
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-lg sm:text-xl text-[#D8A86C] font-bold uppercase tracking-wider">Mediterranea</span>
          <span className="text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-2xl text-center">
            Ricotta vegana, pomodorini datterini, melanzane alla griglia, formaggio stagionato di Kinara (caglio vegetale).
          </span>
        </div>
      )
    }
  ], []);

  const lockScroll = showSplash || menuOpen || !!activePage;

  return (
    <main className={`relative w-full min-h-[100dvh] bg-[#2A1314] flex flex-col ${lockScroll ? 'h-[100dvh] overflow-hidden' : 'overflow-x-hidden'}`}>

      {/* =========================================
          HEADER: LOGO & MENU TOGGLE (FIXED, Z-[80])
          ========================================= */}
      {/* LOGO IN ALTO A SINISTRA */}
      <motion.div
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[80] cursor-pointer pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        onClick={handleHeaderClick}
      >
        <img
          src={headerAnimating ? '/animato gif.gif' : '/cropped_gmi_singolo-removebg-preview.png'}
          alt="GMI Torino Logo"
          className="w-10 h-auto sm:w-12 object-contain"
        />
      </motion.div>

      {/* MENU TOGGLE IN ALTO A DESTRA */}
      <motion.div
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[80] pointer-events-auto text-[#D8A86C]"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <MenuToggle open={menuOpen} onOpenChange={setMenuOpen} strokeWidth={2.5} />
      </motion.div>

      {/* =========================================
          SEZIONE HERO FISSA
          ========================================= */}
      <section className="fixed inset-0 w-full h-full overflow-hidden flex flex-col pointer-events-none z-0">

        {/* DRIFT WALL DI SFONDO */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: showSplash ? 0 : 0.4 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <DriftWall
            items={DRIFT_ITEMS}
            columns={3}
            tileWidth={150}
            tileHeight={132}
            gap={18}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={36}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={54}
            fade={0.65}
            dim={0.42}
            overlayColor="#713336"
            paused={!shouldRenderHero}
          />
        </motion.div>

        {/* TESTO ASCII 3D */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: showSplash ? 0 : 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="w-full h-full flex items-center justify-center transform-gpu">
            <ASCIIText
              text="MENU"
              enableWaves={true}
              asciiFontSize={9}
              textFontSize={80}
              planeBaseHeight={5.8}
              textColor="#D8A86C"
              paused={!shouldRenderHero}
            />
          </div>
        </motion.div>

        {/* INDICATORE SCROLL */}
        <motion.div
          className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: showSplash || menuOpen ? 0 : 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="ico">
            <div className="circle circle-top" />
            <div className="circle circle-main" />
            <div className="circle circle-bottom" />
            <svg className="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 612" style={{ enableBackground: 'new 0 0 612 612' }} xmlSpace="preserve">
              <defs>
                <clipPath id="cut-off-arrow"><circle cx="306" cy="306" r="287" /></clipPath>
                <filter id="goo">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                  <feBlend in="SourceGraphic" in2="goo" />
                </filter>
              </defs>
              <path className="st-arrow" d="M317.5,487.6c0.3-0.3,0.4-0.7,0.7-1.1l112.6-112.6c6.3-6.3,6.3-16.5,0-22.7c-6.3-6.3-16.5-6.3-22.7,0 l-86,86V136.1c0-8.9-7.3-16.2-16.2-16.2c-8.9,0-16.2,7.3-16.2,16.2v301.1l-86-86c-6.3-6.3-16.5-6.3-22.7,0 c-6.3,6.3-6.3,16.5,0,22.7l112.7,112.7c0.3,0.3,0.4,0.7,0.7,1c0.5,0.5,1.2,0.5,1.7,0.9c1.7,1.4,3.6,2.3,5.6,2.9 c0.8,0.2,1.5,0.4,2.3,0.4C308.8,492.6,313.8,491.3,317.5,487.6z" />
            </svg>
          </div>
        </motion.div>

      </section>

      {/* =========================================
          CONTENUTO SCROLLABILE (sopra la Hero)
          ========================================= */}
      <section className="relative w-full min-h-screen bg-[#2A1314] z-20 mt-[100svh] md:mt-[100vh] pt-20 md:pt-28 flex flex-col items-center justify-start shadow-[0_-20px_40px_rgba(42,19,20,1)]">

        <div className="px-4 sm:px-6 w-full flex flex-col items-center">

          {/* Testo animato con ScrollReveal */}
          <div className="w-full max-w-4xl mx-auto mb-16 text-center">
            <ScrollReveal
              baseOpacity={0.5}
              enableBlur={true}
              baseRotation={2}
              blurStrength={9}
              wordAnimationEnd="bottom center"
              rotationEnd="bottom center"
            >
              Benvenuti in GMI Torino. Preparati a vivere un'esperienza sensoriale
              fatta di ingredienti rigorosamente selezionati, pura tradizione e
              una vera passione per l'eccellenza.
            </ScrollReveal>
          </div>

          {/* MorphSlider Container */}
          <div className="w-full max-w-4xl flex flex-col gap-5 mb-20 md:mb-28">
            <div className="w-full aspect-[4/3] md:aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-[#D8A86C]/20">
              <MorphSlider
                items={menuItems}
                transition="melt"
                intensity={0.55}
                aberration={0.35}
                drift={0.4}
                autoplay={true}
                autoplayDelay={9}
                overlayColor="#2A1314"
                duration={1.1}
                ease="power2.inOut"
                scale={2.4}
                loop={true}
                radius={16}
                showCaptions={false}
                showControls={true}
                showIndicators={true}
                onIndexChange={setActiveSliderIndex}
              />
            </div>
            
            {/* External Caption (Under the image) */}
            <div className="w-full text-center px-4 flex flex-col items-center">
              {menuItems[activeSliderIndex]?.caption}
              
              <p className="mt-5 text-[11px] sm:text-[13px] text-white/50 max-w-xl italic">
                * Alternativa senza lattosio disponibile su richiesta (mozzarella con caglio microbico). Posti limitati.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full bg-[#1A0B0C] text-[#D8A86C] pt-16 pb-20 px-4 sm:px-6 md:px-12 flex flex-col items-center text-center relative overflow-hidden border-t border-[#D8A86C]/10 rounded-t-[32px] sm:rounded-t-[40px]">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-10">

            {/* TextLoop Banner */}
            <div className="w-full h-[90px] sm:h-[120px] md:h-[150px] -mt-6">
              <TextLoop
                text="RACCONTARCI ✦ GMI ✦ TORINO"
                shape="wave"
                speed={70}
                direction="forward"
                curviness={50}
                fontSize={35}
                fontWeight={700}
                letterSpacing={5}
                uppercase
                color="#D8A86C"
                ribbon
                ribbonColor="rgba(42,19,20,0.5)"
                ribbonWidth={60}
                pauseOnHover={false}
              />
            </div>

            {/* Title */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-1 text-white">Evento GMI Torino</h2>
              <p className="text-base sm:text-lg md:text-xl text-[#D8A86C] uppercase tracking-widest">26 settembre 2026</p>
            </div>

            {/* Accordion — replaces the old info block */}
            <div className="w-full text-left">
              <Accordion items={ACCORDION_ITEMS} />
            </div>

            {/* Verso del Corano (Fisso in basso) */}
            <div className="w-full max-w-2xl text-center mt-12 mb-6 px-4 mx-auto border-t border-[#D8A86C]/10 pt-10">
              <p className="italic text-sm sm:text-base leading-relaxed mb-3 text-[rgba(255,255,255,0.85)]">
                "O voi che credete, mangiate le buone cose di cui vi abbiamo provvisto e ringraziate
                Allah, se è Lui che adorate."
              </p>
              <p className="text-[10px] sm:text-xs text-[#D8A86C] tracking-[0.15em] uppercase opacity-80">
                Corano, Surah Al-Baqarah · 2:172-173
              </p>
            </div>

            {/* Footer bottom */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-xs opacity-40 tracking-widest uppercase">
                Giovani Musulmani d'Italia APS · Torino · © 2026
              </p>
              <p className="text-[10px] text-white opacity-80 tracking-[0.15em] uppercase">
                Made with ❤️ by a muslim
              </p>
            </div>
          </div>
        </footer>
      </section>


      {/* =========================================
          FULLSCREEN MENU OVERLAY
          ========================================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[65] bg-[#1A0B0C] flex flex-col items-center justify-center p-8 pointer-events-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <nav className="flex flex-col gap-6 sm:gap-8 text-center text-[#D8A86C]">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.page}
                  type="button"
                  className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-widest hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                  onClick={() => openPage(item.page)}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
            <div className="absolute bottom-10 opacity-40 text-xs tracking-widest uppercase text-[#D8A86C]">
              GMI Torino © 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* =========================================
          FULLSCREEN PAGE OVERLAY (sub-pages)
          ========================================= */}
      <AnimatePresence>
        {activePage && (
          <motion.div
            className="fixed inset-0 z-[90] bg-[#100608] pointer-events-auto flex flex-col"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: '0%' }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {activePage === 'menu'     && <PageMenu      onClose={closePage} />}
            {activePage === 'evento'   && <PageEvento    onClose={closePage} />}
            {activePage === 'chisiamo' && <PageChiSiamo  onClose={closePage} />}
            {activePage === 'contatti' && <PageContatti  onClose={closePage} />}
          </motion.div>
        )}
      </AnimatePresence>


      {/* =========================================
          SPLASH SCREEN
          ========================================= */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-[#2A1314]"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onAnimationComplete={(definition) => {
              // Quando l'animazione di uscita è completa (opacity 0), forziamo il browser a svuotare l'immagine
              if (definition.opacity === 0) {
                const img = document.getElementById('splash-img');
                if (img) img.src = '';
              }
            }}
          >
            <motion.img
              id="splash-img"
              src="/cropped gmi.webp"
              alt="GMI Torino"
              className="w-56 sm:w-64 h-auto object-contain"
              onLoad={() => setImageLoaded(true)}
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 0.7 : 0.9, y: 30 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

export default App;
