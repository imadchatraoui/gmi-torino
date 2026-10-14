import { motion } from 'framer-motion';
import { useEffect } from 'react';
import TextLoop from '../TextLoop';
import './MenuPages.css';


const PAGE_ANIM = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

/* ==========================================
   PAGE: MENU (Piatti / Sapori)
   ========================================== */
const dishes = [
  {
    num: '01',
    name: 'Mediterranea',
    desc: 'Ricotta vegana, pomodorini datterini, melanzane alla griglia, scaglie di Grana Padano Kinara (caglio vegetale).',
  },
  {
    num: '02',
    name: 'Contadina',
    desc: 'Rucola, pomodorini datterini, crema di funghi fatta con formaggio Kinara stagionato piemontese (caglio vegetale).',
  },
];

export function PageMenu({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div {...PAGE_ANIM} className="page-inner">
      <div className="page-header">
        <button type="button" className="page-back" onClick={onClose} aria-label="Torna indietro">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="page-title">Il Menù</h1>
        <p className="page-subtitle">Sapori autentici, ingredienti selezionati</p>
      </div>

      <div className="page-scroll">
        <div className="menu-grid">
          {dishes.map((d, i) => (
            <motion.div
              key={i}
              className="dish-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <span className="dish-num">{d.num}</span>
              <div className="dish-info">
                <h3 className="dish-name">{d.name}</h3>
                <p className="dish-desc">{d.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="menu-note">
          <span style={{ color: '#D8A86C', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Alternativa Senza Lattosio (Posti limitati)</span>
          È possibile avere l'alternativa senza lattosio: al posto della ricotta e crema di funghi, offriamo mozzarella con caglio microbico.<br/><br/>
          Tutti i piatti rispettano le indicazioni halal.<br />
          Il menù è incluso nella quota di partecipazione.
        </p>
      </div>
    </motion.div>
  );
}


/* ==========================================
   PAGE: L'EVENTO
   ========================================== */
const timeline = [
  { time: '10:00 - 10:15', title: 'Accoglienza e registrazione', desc: '' },
  { time: '10:15 - 10:30', title: 'Saluti e apertura evento', desc: '' },
  { time: '10:30 - 11:00', title: 'La nostra voce', desc: 'Talk a cura di Dalia El Brashy' },
  { time: '11:05 - 11:40', title: 'Stesso sangue', desc: 'Talk a cura di Omar Chihi' },
  { time: '11:45 - 12:20', title: 'Indossare l\'identità', desc: 'Talk a cura di Hind Lafram' },
  { time: '12:30 - 13:50', title: 'Pranzo', desc: '' },
  { time: '14:00 - 15:00', title: 'Il gusto di appartenenza', desc: 'Intervengono: Badr Chatoui e le Veiled Spies' },
  { time: '15:05 - 16:05', title: 'Giovani protagonisti', desc: 'Intervengono: Raisa Labaran, Marzia Sica e Abdullahi Ahmed' },
  { time: '16:10 - 16:40', title: 'Coffee break', desc: '' },
  { time: '16:45 - 17:45', title: 'Movimento', desc: 'Intervista a Ilias Aouani' },
  { time: '17:50 - 19:10', title: 'Workshop 1 e 2', desc: 'Cambiare il racconto con Soaud Maddahi\nPrima del logo con Souad Studio' },
  { time: '19:15 - 19:30', title: 'Saluti finali', desc: '' },
];

export function PageEvento({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div {...PAGE_ANIM} className="page-inner">
      <div className="page-header">
        <button type="button" className="page-back" onClick={onClose} aria-label="Torna indietro">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="page-title">L&apos;Evento</h1>
        <p className="page-subtitle">Raccontarci · 26 settembre 2026</p>
      </div>

      <div className="page-scroll">
        <div className="event-info-cards">
          <div className="event-info-card">
            <svg className="event-info-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div>
              <p className="event-info-label">Quando</p>
              <p className="event-info-value">Sabato 26 settembre 2026<br/>10:00 – 19:30</p>
            </div>
          </div>
          <div className="event-info-card">
            <svg className="event-info-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <p className="event-info-label">Dove</p>
              <p className="event-info-value">Corso Vittorio Emanuele 23<br/>Sala conferenze Chiesa Valdese, Torino</p>
            </div>
          </div>
        </div>

        <h2 className="section-label">Programma della giornata</h2>
        <div className="timeline">
          {timeline.map((item, i) => (
            <div key={i} className="timeline-item">
              <span className="timeline-time">{item.time}</span>
              <span className="timeline-dash" />
              <div className="timeline-content">
                <div className="timeline-title">{item.title}</div>
                {item.desc && <div className="timeline-desc whitespace-pre-line">{item.desc}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="text-loop-wrapper">
          <TextLoop
            text="RACCONTARCI ✦ GMI ✦ TORINO ✦"
            shape="wave"
            speed={60}
            direction="forward"
            curviness={40}
            fontSize={26}
            fontWeight={700}
            letterSpacing={2}
            uppercase
            color="#D8A86C"
            ribbon
            ribbonColor="rgba(42,19,20,0.5)"
            ribbonWidth={40}
            pauseOnHover={false}
          />
        </div>
      </div>
    </motion.div>
  );
}


/* ==========================================
   PAGE: CHI SIAMO
   ========================================== */
export function PageChiSiamo({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div {...PAGE_ANIM} className="page-inner">
      <div className="page-header">
        <button type="button" className="page-back" onClick={onClose} aria-label="Torna indietro">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div
          className="page-title-glitch"
          style={{
            '--after-shadow': '-3px 0 #D8A86C',
            '--before-shadow': '3px 0 rgba(216,168,108,0.4)',
            '--after-duration': '4s',
            '--before-duration': '3s',
          }}
        >
          
            Chi Siamo
          
        </div>
        <p className="page-subtitle">Giovani Musulmani d&apos;Italia · Torino</p>
      </div>

      <div className="page-scroll">
        <div className="about-text" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <p>
            Siamo la sezione torinese dei Giovani Musulmani Italiani. Rappresentiamo un intreccio di generazioni e culture accomunate dalla fede e dal desiderio di contribuire attivamente alla società. Il nostro obiettivo è promuovere l'aggregazione dei giovani sul territorio cittadino affinché si sentano parte di una comunità coesa e solidale.
          </p>
          <p>
            Crediamo profondamente in un percorso di crescita che unisca la consapevolezza identitaria alla formazione. Vogliamo accompagnare le nuove generazioni nel diventare cittadini attivi nella società italiana e nella comunità islamica offrendo loro esperienze concrete in cui il protagonismo giovanile sia al centro di ogni iniziativa.
          </p>
          <p>
            Come cuore pulsante delle attività a livello locale organizziamo momenti di incontro e dialogo. Tutto nasce dal confronto diretto e dal contributo volontario dei nostri membri perché siamo convinti che la vera forza risieda nel costruire insieme uno spazio condiviso in cui ognuno possa scoprire il proprio potenziale.
          </p>
        </div>
      </div>
    </motion.div>
  );
}


/* ==========================================
   PAGE: CONTATTI
   ========================================== */
export function PageContatti({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div {...PAGE_ANIM} className="page-inner">
      <div className="page-header">
        <button type="button" className="page-back" onClick={onClose} aria-label="Torna indietro">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="page-title">Contatti</h1>
        <p className="page-subtitle">Siamo felici di risponderti</p>
      </div>

      <div className="page-scroll">
        <div className="contact-cards">
          <a href="mailto:gmitorino@gmail.com" className="contact-card">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <div>
              <p className="contact-label">Email</p>
              <p className="contact-value">gmitorino@gmail.com</p>
            </div>
          </a>
          <a href="https://gmitalia.org/" target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
            </span>
            <div>
              <p className="contact-label">Sito Web</p>
              <p className="contact-value">https://gmitalia.org/</p>
            </div>
          </a>
          <a href="https://instagram.com/gmi.torino" target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </span>
            <div>
              <p className="contact-label">Instagram</p>
              <p className="contact-value">@gmi.torino</p>
            </div>
          </a>
        </div>

        <div className="quran-verse">
          <p className="quran-text">
            &quot;O voi che credete, mangiate le buone cose di cui vi abbiamo provvisto e ringraziate Allah, se è Lui che adorate.&quot;
          </p>
          <p className="quran-ref">Corano, Surah Al-Baqarah (2:172-173)</p>
        </div>
      </div>
    </motion.div>
  );
}
