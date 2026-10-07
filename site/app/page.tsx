import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { GalleryRail } from "@/components/gallery";
import { ContactInvitation } from "@/components/page-heading";
import { activities, gallery } from "@/lib/content";
export default function Home() {
  return (
    <main id="main">
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-line" />
            Giovani Musulmani d’Italia · Torino
          </p>
          <h1>
            Radici profonde.
            <br />
            Orizzonti <em>comuni.</em>
          </h1>
          <p className="hero-description">
            Le nostre storie si incontrano qui. Uno spazio per crescere,
            condividere e costruire insieme la Torino di domani.
          </p>
          <div className="actions">
            <Link className="button" href="/chi-siamo">
              Conosci GMI Torino
            </Link>
            <Link className="text-link" href="/archivio">
              Esplora le nostre storie
            </Link>
          </div>
          <div className="hero-footnote">
            <span>Identità. Comunità. Partecipazione.</span>
            <span>45°04′ N / 7°41′ E</span>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Le locandine dell’evento Raccontarci"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-label">STORIE CHE CI UNISCONO</div>
          <img
            className="poster-back"
            src="/media/IMG_6671.webp"
            alt="Indossare l’identità, con Hind Lafram"
            width="1179"
            height="1476"
          />
          <img
            className="poster-front"
            src="/media/IMG_raccontarci.webp"
            alt="Raccontarci: l’Italia, l’identità e le nuove generazioni musulmane, 26 settembre a Torino"
            width="1312"
            height="1632"
            fetchPriority="high"
          />
          <div className="art-caption">
            <span>TORINO, INSIEME.</span>
            <span>Una città. Tante storie.</span>
          </div>
          <span className="art-index" aria-hidden="true">
            01 / GMI
          </span>
        </div>
      </section>
      <div className="values-strip">
        <div className="wrap">
          <span>Una comunità, molte voci.</span>
          <span>Fede e identità</span>
          <span>Formazione</span>
          <span>Cittadinanza attiva</span>
        </div>
      </div>
      <section className="wrap intro-section">
        <p className="eyebrow">Il nostro punto di partenza</p>
        <h2>
          Appartenere.
          <br />
          <em>E fare la differenza.</em>
        </h2>
        <div>
          <p>
            Siamo la sezione torinese dei Giovani Musulmani d’Italia. Crediamo
            nel valore dell’incontro e nel protagonismo delle nuove generazioni.
          </p>
          <p>
            La nostra fede, le nostre esperienze e il legame con la città
            diventano occasioni di dialogo e crescita condivisa.
          </p>
          <Link className="text-link" href="/chi-siamo">
            La nostra comunità
          </Link>
        </div>
      </section>
      <section className="wrap activities-section" data-reveal>
        <div className="section-top">
          <div>
            <p className="eyebrow">Quello che ci muove</p>
            <h2>
              Crescere è un verbo
              <br />
              <em>da vivere insieme.</em>
            </h2>
          </div>
          <Link className="text-link" href="/attivita">
            Tutte le attività
          </Link>
        </div>
        <div className="activities-grid">
          {activities.map((a) => (
            <Link className="activity-card" href="/attivita" key={a.number}>
              <span>{a.number}</span>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
              <span className="text-link">Scopri il percorso</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="featured-event">
        <div className="featured-grid wrap">
          <div data-reveal>
            <p className="eyebrow">Un incontro dal nostro archivio</p>
            <h2>
              Raccontarci<em>.</em>
            </h2>
            <p className="lead">
              L’Italia, l’identità e le nuove generazioni musulmane.
            </p>
            <p className="hero-description">
              Voci, esperienze e linguaggi diversi. Una giornata per esplorare
              ciò che siamo e immaginare ciò che possiamo costruire.
            </p>
            <div className="featured-meta">
              <span>
                <CalendarDays size={17} />
                26 settembre 2026
              </span>
              <span>
                <MapPin size={17} />
                Torino
              </span>
            </div>
            <Link className="button" href="/eventi/raccontarci">
              Rivivi l’incontro
            </Link>
          </div>
          <div className="featured-art" data-reveal>
            <img
              src="/media/IMG_savedate.webp"
              alt="Save the date di Raccontarci, 26 settembre"
              width="630"
              height="842"
              loading="lazy"
            />
            <div className="date-stamp">
              <strong>26</strong>
              <span>SET / 2026</span>
            </div>
          </div>
        </div>
      </section>
      <GalleryRail items={gallery} />
      <div className="wrap archive-home-link">
        <Link className="text-link" href="/archivio">
          Esplora tutto l’archivio
        </Link>
      </div>
      <ContactInvitation />
    </main>
  );
}
