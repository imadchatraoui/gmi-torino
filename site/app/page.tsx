import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { activities } from "@/lib/content";
import { ContactInvitation } from "@/components/page-heading";
import {
  BrandTitle,
  HeroThreads,
  Surface,
  SiteButton,
} from "@/components/brand-experience";

export default function Home() {
  return (
    <main id="main">
      <section className="brand-hero">
        <HeroThreads />
        <div className="brand-hero-inner wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              Giovani Musulmani d’Italia · Sezione di Torino
            </p>
            <BrandTitle />
            <p className="hero-subline">La nostra città. La nostra comunità.</p>
            <p className="hero-description">
              Uno spazio per i giovani musulmani a Torino: incontrarsi, formarsi
              e partecipare alla vita della città.
            </p>
            <div className="actions">
              <SiteButton asChild className="button gold">
                <Link href="/chi-siamo">Conosci la sezione</Link>
              </SiteButton>
              <SiteButton asChild className="button secondary">
                <Link href="/eventi">I nostri incontri</Link>
              </SiteButton>
            </div>
          </div>
          <Surface className="logo-stage" dark>
            <div className="logo-plinth">
              <img
                src="/media/gmi-torino.png"
                alt="Il logo di GMI Torino, con la Mole Antonelliana"
                width={449}
                height={556}
                fetchPriority="high"
              />
            </div>
            <p className="logo-stage-label">Giovani · Musulmani · Italiani</p>
          </Surface>
        </div>
        <div className="hero-meta wrap">
          <span>Sezione di Torino</span>
          <a
            href="https://instagram.com/gmi.torino"
            target="_blank"
            rel="noopener noreferrer"
          >
            @gmi.torino
          </a>
        </div>
      </section>
      <div className="values-strip">
        <div className="wrap">
          <span>Identità e dialogo</span>
          <span>Cultura e formazione</span>
          <span>Partecipazione e città</span>
        </div>
      </div>
      <section className="wrap intro-section">
        <p className="eyebrow">Chi siamo</p>
        <h2>
          Una rete nazionale.
          <br />
          <span className="accent-text">Una comunità a Torino.</span>
        </h2>
        <div>
          <p>
            Facciamo parte dei Giovani Musulmani d’Italia. A Torino condividiamo
            un percorso di crescita, confronto e partecipazione.
          </p>
          <p>
            Le iniziative della sezione mettono in relazione fede, identità e
            cittadinanza, con spazio per le domande e le esperienze di ognuno.
          </p>
          <Link className="text-link" href="/chi-siamo">
            La nostra associazione
          </Link>
        </div>
      </section>
      <section className="wrap activities-section">
        <div className="section-top">
          <div>
            <p className="eyebrow">Le attività</p>
            <h2>Da dove cominciamo.</h2>
          </div>
          <Link className="text-link" href="/attivita">
            Conosci i percorsi
          </Link>
        </div>
        <div className="activities-grid">
          {activities.map((a) => (
            <Surface className="activity-spotlight" key={a.number}>
              <Link className="activity-card" href="/attivita">
                <span>{a.number}</span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <span className="text-link">Scopri il percorso</span>
              </Link>
            </Surface>
          ))}
        </div>
      </section>
      <section className="featured-event">
        <div className="featured-grid wrap">
          <div>
            <p className="eyebrow">Dal nostro archivio</p>
            <h2>Raccontarci.</h2>
            <p className="lead">
              L’Italia, l’identità e le nuove generazioni musulmane.
            </p>
            <p className="hero-description">
              Una giornata di interventi e laboratori su identità, cultura e
              partecipazione. Il programma e le locandine sono disponibili
              nell’archivio.
            </p>
            <div className="featured-meta">
              <span>
                <CalendarDays size={18} />
                26 settembre 2026
              </span>
              <span>
                <MapPin size={18} />
                Torino
              </span>
            </div>
            <SiteButton asChild>
              <Link href="/eventi/raccontarci">Il programma dell’incontro</Link>
            </SiteButton>
          </div>
          <div className="featured-art">
            <img
              src="/media/IMG_raccontarci.webp"
              alt="Locandina dell’evento Raccontarci"
              width={1312}
              height={1632}
              loading="lazy"
            />
            <p>Raccontarci · 26 settembre 2026</p>
          </div>
        </div>
      </section>
      <section className="wrap archive-home-link">
        <h2>I materiali dei nostri incontri.</h2>
        <Link className="text-link" href="/archivio">
          Esplora l’archivio
        </Link>
      </section>
      <ContactInvitation />
    </main>
  );
}
