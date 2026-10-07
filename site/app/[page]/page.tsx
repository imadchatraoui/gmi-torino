import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Camera, Globe, MapPin, CalendarDays } from "lucide-react";
import { PageHeading, ContactInvitation } from "@/components/page-heading";
import { GalleryRail, GalleryGrid } from "@/components/gallery";
import { activities, events, gallery, site } from "@/lib/content";

const pages: Record<string, { title: string; description: string }> = {
  "chi-siamo": {
    title: "Chi siamo",
    description:
      "La comunità di GMI Torino: identità, crescita e partecipazione alla vita della città.",
  },
  attivita: {
    title: "Le nostre attività",
    description:
      "Dialogo, cultura, formazione e cittadinanza: i temi che uniscono la nostra comunità.",
  },
  eventi: {
    title: "Eventi",
    description: "Gli incontri di GMI Torino e le storie del nostro archivio.",
  },
  archivio: {
    title: "Archivio visivo",
    description:
      "Fotografie e locandine degli eventi GMI Torino, in una galleria da esplorare.",
  },
  contatti: {
    title: "Contatti",
    description:
      "Contatta GMI Torino per partecipare, proporre un’idea o collaborare.",
  },
  privacy: {
    title: "Privacy",
    description: "Informazioni sui dati trattati dal sito GMI Torino.",
  },
  cookie: {
    title: "Cookie",
    description:
      "Informazioni sui cookie e sugli strumenti utilizzati dal sito GMI Torino.",
  },
  "note-legali": {
    title: "Note legali",
    description: "Responsabilità, contenuti e diritti sul sito GMI Torino.",
  },
};
export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return pages[page]
    ? { ...pages[page], alternates: { canonical: `/${page}` } }
    : { title: "Pagina non trovata" };
}
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (!pages[page]) notFound();
  if (page === "chi-siamo")
    return (
      <main id="main">
        <PageHeading
          label="Chi siamo"
          title="Le nostre radici."
          italic="Il nostro futuro, insieme."
          description="Siamo giovani, siamo una comunità, siamo parte di Torino. Le nostre differenze sono il punto da cui partire per costruire qualcosa di condiviso."
        />
        <section className="about-story wrap" data-reveal>
          <div className="about-wordmark" aria-hidden="true">
            <span>GMI</span>
            <em>Torino.</em>
            <p>
              Radici profonde.
              <br />
              Orizzonti comuni.
            </p>
          </div>
          <div>
            <p className="eyebrow">Una comunità che cresce</p>
            <h2>
              Le persone.
              <br />
              <em>Prima di tutto.</em>
            </h2>
            <p>
              GMI Torino è la sezione locale dei Giovani Musulmani d’Italia.
              Facciamo parte di una rete nazionale che promuove la crescita
              personale, la formazione e il contributo attivo dei giovani alla
              società.
            </p>
            <p>
              A Torino portiamo questa visione nel dialogo con la città: uno
              spazio per conoscerci, condividere esperienze e dare voce alle
              nuove generazioni musulmane.
            </p>
            <p>
              Identità e appartenenza non sono un punto d’arrivo. Sono un
              percorso da vivere insieme, attraverso occasioni concrete di
              incontro e apprendimento.
            </p>
            <a
              className="text-link"
              href={`${site.nationalUrl}chi-siamo`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conosci l’associazione nazionale
            </a>
          </div>
        </section>
        <section className="pillars-section wrap" data-reveal>
          <p className="eyebrow">Quello che ci guida</p>
          <div className="pillars-grid">
            <article>
              <span>01 / Identità</span>
              <h3>Conoscersi.</h3>
              <p>
                Valorizzare le proprie radici e trovare il proprio posto, con
                consapevolezza e fiducia.
              </p>
            </article>
            <article>
              <span>02 / Comunità</span>
              <h3>Incontrarsi.</h3>
              <p>
                Coltivare legami, ascoltare storie diverse e far crescere un
                senso di appartenenza condiviso.
              </p>
            </article>
            <article>
              <span>03 / Partecipazione</span>
              <h3>Contribuire.</h3>
              <p>
                Trasformare le idee in presenza attiva nella comunità e nella
                società italiana.
              </p>
            </article>
          </div>
        </section>
        <ContactInvitation />
      </main>
    );
  if (page === "attivita")
    return (
      <main id="main">
        <PageHeading
          label="Attività"
          title="Dalle idee"
          italic="agli incontri."
          description="L’identità si esplora, la cultura si condivide, la cittadinanza si vive. Questi sono i fili che attraversano le nostre iniziative."
        />
        <div className="wrap activity-list">
          {activities.map((a, i) => (
            <section
              key={a.number}
              className={`activity-detail ${i % 2 ? "reverse" : ""}`}
              data-reveal
            >
              <div className="activity-poster">
                <img
                  src={a.image}
                  alt={`Locandina di Raccontarci: ${i === 0 ? "La nostra voce" : i === 1 ? "Prima del logo" : "Giovani protagonisti"}`}
                  loading="lazy"
                  width="1179"
                  height="1470"
                />
              </div>
              <div>
                <p className="eyebrow">Percorso {a.number}</p>
                <h2>{a.title}</h2>
                <p className="lead">{a.text}</p>
                <p>{a.detail}</p>
                <Link className="text-link" href="/eventi/raccontarci">
                  Scopri il programma di Raccontarci
                </Link>
              </div>
            </section>
          ))}
        </div>
        <ContactInvitation />
      </main>
    );
  if (page === "eventi")
    return (
      <main id="main">
        <PageHeading
          label="Eventi"
          title="Ci incontriamo."
          italic="E qualcosa comincia."
          description="Spazi di dialogo, esperienze e nuove prospettive. Scopri gli incontri della nostra comunità."
        />
        <section className="wrap upcoming-section">
          <div className="section-top">
            <h2>I prossimi incontri</h2>
            <span className="eyebrow">Il calendario della comunità</span>
          </div>
          {events.some((e) => e.status === "upcoming") ? (
            <div className="events-list">
              {events
                .filter((e) => e.status === "upcoming")
                .map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
            </div>
          ) : (
            <div className="upcoming-empty">
              <CalendarDays size={32} strokeWidth={1} />
              <div>
                <h3>Le prossime date saranno pubblicate qui.</h3>
                <p>
                  Per gli aggiornamenti della sezione, seguici su Instagram.
                </p>
              </div>
              <a
                className="text-link"
                href={site.instagramUrl ?? site.nationalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Segui @gmi.torino
              </a>
            </div>
          )}
        </section>
        <section className="wrap events-archive" data-reveal>
          <p className="eyebrow">Dal nostro archivio</p>
          <h2>
            Incontri da <em>ricordare.</em>
          </h2>
          <div className="events-list">
            {events
              .filter((e) => e.status === "archived")
              .map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
          </div>
        </section>
        <ContactInvitation />
      </main>
    );
  if (page === "archivio")
    return (
      <main id="main">
        <PageHeading
          label="Archivio"
          title="Una traccia"
          italic="di ogni incontro."
          description="Le immagini, le voci e i temi della nostra comunità. Esplora le storie in movimento, poi fermati sui dettagli."
        />
        <GalleryRail items={gallery} />
        <section className="wrap archive-intro">
          <p className="eyebrow">L’archivio completo</p>
          <h2>
            Ogni immagine,
            <br />
            <em>una storia.</em>
          </h2>
          <p>
            Ritrova tutti i materiali degli eventi. Le locandine conservano i
            temi e i protagonisti degli incontri; le fotografie ne raccontano i
            momenti.
          </p>
        </section>
        <GalleryGrid items={gallery} />
        <ContactInvitation />
      </main>
    );
  if (page === "contatti")
    return (
      <main id="main">
        <PageHeading
          label="Contatti"
          title="Ogni legame"
          italic="inizia con un saluto."
          description="Vuoi partecipare, condividere una proposta o conoscere meglio GMI Torino? Siamo qui per incontrarti."
        />
        <section className="contact-grid wrap" data-reveal>
          <a
            className="contact-card primary"
            href={`mailto:${site.localEmail}`}
          >
            <Mail size={28} strokeWidth={1} />
            <p className="eyebrow">Scrivici</p>
            <h2>Parliamone.</h2>
            <span className="contact-address">{site.localEmail}</span>
            <p>Per informazioni, collaborazioni e proposte per la comunità.</p>
          </a>
          <a
            className="contact-card"
            href={site.instagramUrl ?? site.nationalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Camera size={28} strokeWidth={1} />
            <p className="eyebrow">La comunità, ogni giorno</p>
            <h2>Restiamo vicini.</h2>
            <span className="contact-address">@gmi.torino</span>
            <p>
              Segui gli aggiornamenti e le iniziative della sezione su
              Instagram.
            </p>
          </a>
          <a
            className="contact-card"
            href={site.nationalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe size={28} strokeWidth={1} />
            <p className="eyebrow">La nostra rete</p>
            <h2>GMI Italia.</h2>
            <span className="contact-address">gmitalia.org</span>
            <p>Conosci l’associazione nazionale e le altre sezioni.</p>
          </a>
        </section>
        <section className="wrap faq-section" data-reveal>
          <div>
            <p className="eyebrow">Prima di scriverci</p>
            <h2>
              Facciamo
              <br />
              <em>conoscenza.</em>
            </h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>Come posso conoscere le prossime attività?</summary>
              <p>
                Consulta la pagina Eventi e il profilo Instagram @gmi.torino.
                Puoi anche scriverci per chiedere informazioni sulle iniziative.
              </p>
            </details>
            <details>
              <summary>Posso proporre una collaborazione?</summary>
              <p>
                Sì. Scrivi a {site.localEmail} raccontandoci la tua idea,
                l’organizzazione di cui fai parte e come immagini la
                collaborazione.
              </p>
            </details>
            <details>
              <summary>Dove si svolgono gli incontri?</summary>
              <p>
                Il luogo è indicato nella pagina di ogni evento. La sede di un
                incontro non coincide necessariamente con la sede della sezione.
              </p>
            </details>
            <details>
              <summary>Come posso segnalare una foto o un contenuto?</summary>
              <p>
                Invia il collegamento alla pagina e una descrizione a{" "}
                {site.localEmail}. Per richieste relative ai tuoi dati, consulta
                anche l’informativa privacy.
              </p>
            </details>
          </div>
        </section>
      </main>
    );
  return <LegalPage page={page} />;
}
function EventCard({ event: e }: { event: (typeof events)[number] }) {
  return (
    <Link className="event-card" href={`/eventi/${e.slug}`}>
      <div className="event-card-image">
        <img
          src={e.image}
          alt={`Locandina ${e.title}`}
          loading="lazy"
          width="1312"
          height="1632"
        />
      </div>
      <div>
        <span className="event-status">
          {e.status === "archived" ? "In archivio" : "Prossimo incontro"}
        </span>
        <p className="event-date">
          <CalendarDays size={16} />
          <time dateTime={e.date ?? undefined}>{e.dateLabel}</time>
        </p>
        <h3>{e.title}</h3>
        <p>{e.subtitle}</p>
        <span className="event-location">
          <MapPin size={16} />
          {e.location} · Torino
        </span>
        <span className="text-link">Scopri l’incontro</span>
      </div>
    </Link>
  );
}
function LegalPage({ page }: { page: string }) {
  return (
    <main id="main">
      <PageHeading
        label={pages[page].title}
        title={pages[page].title}
        description={pages[page].description}
      />
      <article className="legal-content wrap">
        <p className="legal-updated">Ultimo aggiornamento: 7 ottobre 2026</p>
        {page === "privacy" ? (
          <>
            <h2>Chi gestisce il sito</h2>
            <p>
              Il sito è curato da {site.legal.controller}. Per informazioni sul
              trattamento dei dati e per esercitare i tuoi diritti puoi scrivere
              a{" "}
              <a href={`mailto:${site.legal.privacyEmail}`}>
                {site.legal.privacyEmail}
              </a>
              .
            </p>
            <h2>Quali dati sono trattati</h2>
            <p>
              Questo sito presenta le attività della sezione e i materiali dei
              suoi eventi. Non contiene moduli di iscrizione, newsletter,
              account dei visitatori o pagamenti. Non richiede informazioni
              sulle convinzioni religiose di chi lo visita.
            </p>
            <p>
              La piattaforma di hosting tratta i dati tecnici necessari a
              fornire il servizio, come indirizzo IP, richieste HTTP e
              informazioni sul dispositivo. Nella versione privata, la
              piattaforma gestisce anche l’autenticazione di accesso. Il
              trattamento tecnico del gestore dell’infrastruttura segue le sue
              condizioni e informative.
            </p>
            <h2>Se ci scrivi</h2>
            <p>
              Il collegamento email apre il tuo programma di posta. Se scegli di
              inviare un messaggio, trattiamo il tuo indirizzo, il contenuto e
              gli eventuali dati che condividi per rispondere alla richiesta. La
              base giuridica è l’esecuzione delle misure richieste
              dall’interessato o il legittimo interesse a gestire la
              corrispondenza, secondo il contenuto della richiesta. Non inviare
              documenti o dati particolari non necessari.
            </p>
            <p>
              I messaggi sono accessibili alle persone incaricate di gestire i
              contatti. Sono conservati per il tempo necessario a rispondere e
              gestire la richiesta; eventuali esigenze ulteriori devono avere
              una base giuridica specifica.
            </p>
            <h2>Immagini degli eventi</h2>
            <p>
              Le immagini pubblicate sono materiali forniti dalla sezione con
              autorizzazione all’uso. Se sei presente in un’immagine e vuoi
              chiedere informazioni, segnalare un problema o richiederne la
              rimozione, scrivici indicando la pagina e l’immagine interessata.
              La richiesta sarà valutata secondo la base giuridica applicabile
              alla pubblicazione.
            </p>
            <h2>Servizi esterni</h2>
            <p>
              I link a Instagram, al sito nazionale e al servizio di posta sono
              collegamenti esterni. Questi servizi non sono incorporati nelle
              pagine e non sono caricati automaticamente. Se li apri, si
              applicano le loro informative. Font, logo e immagini delle pagine
              sono serviti dal sito.
            </p>
            <h2>I tuoi diritti</h2>
            <p>
              Nei casi previsti dal GDPR puoi chiedere accesso, rettifica,
              cancellazione, limitazione, portabilità e opposizione al
              trattamento, oltre a revocare un eventuale consenso. Puoi
              presentare reclamo al{" "}
              <a
                href="https://www.garanteprivacy.it/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Garante per la protezione dei dati personali
              </a>
              . Le richieste sono gestite nei termini previsti dal regolamento.
            </p>
            <h2>Informazioni per la pubblicazione</h2>
            <p>
              Questa versione è un’anteprima riservata. Prima dell’apertura
              pubblica devono essere verificati i rapporti con i fornitori di
              hosting e posta, i tempi di conservazione dei log, i trasferimenti
              di dati e la corrispondenza dell’informativa con il trattamento
              effettivo.
            </p>
          </>
        ) : page === "cookie" ? (
          <>
            <h2>Scelte del sito</h2>
            <p>
              Il codice del sito non utilizza cookie di profilazione, pixel
              pubblicitari, strumenti di analytics o tecniche di fingerprinting.
              Non memorizza preferenze in localStorage e non incorpora contenuti
              social o mappe di terze parti.
            </p>
            <h2>Cookie tecnici della piattaforma</h2>
            <p>
              La piattaforma di hosting può utilizzare cookie tecnici necessari
              alla sicurezza e, nell’anteprima privata, all’autenticazione.
              Questi strumenti dipendono dalla configurazione della piattaforma
              e devono essere verificati prima della pubblicazione pubblica.
            </p>
            <h2>Perché non trovi un banner</h2>
            <p>
              Il sito non attiva strumenti di tracciamento che richiedono
              consenso. L’aggiunta di tali strumenti richiederà l’aggiornamento
              di questa informativa e il blocco dei trattamenti non tecnici fino
              a una scelta valida dell’utente.
            </p>
            <h2>Link esterni</h2>
            <p>
              Aprendo Instagram o altri collegamenti esterni, passi a servizi
              che possono usare cookie secondo le loro regole. Nessun contenuto
              di questi servizi viene caricato automaticamente nelle pagine del
              sito.
            </p>
            <p>
              Per domande scrivi a{" "}
              <a href={`mailto:${site.localEmail}`}>{site.localEmail}</a>.
              Consulta anche la <Link href="/privacy">pagina Privacy</Link> e le{" "}
              <a
                href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876"
                target="_blank"
                rel="noopener noreferrer"
              >
                linee guida del Garante
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <h2>Responsabile dei contenuti</h2>
            <p>
              {site.legal.controller}. Contatto:{" "}
              <a href={`mailto:${site.localEmail}`}>{site.localEmail}</a>.
            </p>
            <h2>La sezione e l’associazione nazionale</h2>
            <p>
              Questo sito presenta la sezione torinese. Il sito nazionale dei
              Giovani Musulmani d’Italia è{" "}
              <a
                href={site.nationalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                gmitalia.org
              </a>
              . Le informazioni istituzionali nazionali di riferimento
              provengono dalla sua{" "}
              <a
                href={`${site.nationalUrl}chi-siamo`}
                target="_blank"
                rel="noopener noreferrer"
              >
                pagina Chi siamo
              </a>
              .
            </p>
            <h2>Materiali e diritti</h2>
            <p>
              Logo e immagini sono forniti dalla sezione, che ne ha confermato
              l’autorizzazione alla pubblicazione. I diritti appartengono ai
              rispettivi titolari. La presenza di un contenuto nel sito non
              concede il diritto di riprodurlo o utilizzarlo per altri scopi.
              Per richieste di utilizzo, contatta la sezione.
            </p>
            <h2>Informazioni sugli eventi</h2>
            <p>
              Gli eventi in archivio sono documentati attraverso i materiali
              disponibili. I nomi e i temi degli interventi sono tratti dalle
              locandine fornite; la data completa di Raccontarci, 26 settembre
              2026, è stata confermata dalla sezione. Non sono aperte iscrizioni
              per gli eventi in archivio.
            </p>
            <h2>Segnalazioni</h2>
            <p>
              Per errori, problemi di accessibilità o richieste relative a
              un’immagine, scrivi a{" "}
              <a href={`mailto:${site.localEmail}`}>{site.localEmail}</a>{" "}
              indicando la pagina coinvolta. Puoi consultare il sito da
              tastiera; le animazioni rispettano la preferenza del dispositivo
              per il movimento ridotto.
            </p>
          </>
        )}
      </article>
    </main>
  );
}
