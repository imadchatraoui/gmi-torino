import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { events, gallery } from "@/lib/content";
import { SiteButton } from "@/components/brand-experience";
import { ContactInvitation } from "@/components/page-heading";
export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const e = events.find((e) => e.slug === slug);
  return {
    title: e?.title ?? "Evento non trovato",
    description: e?.subtitle,
    alternates: { canonical: `/eventi/${slug}` },
  };
}
export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const e = events.find((e) => e.slug === slug);
  if (!e) notFound();
  const program = gallery.filter(
    (i) =>
      i.eventId === e.slug && !["raccontarci", "save-the-date"].includes(i.id),
  );
  return (
    <main id="main">
      <section className="event-detail-hero wrap">
        <div>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/eventi">Eventi</Link>
            <span>/</span>
            <span>{e.title}</span>
          </div>
          <p className="eyebrow">
            {e.status === "archived"
              ? "Dal nostro archivio"
              : "Il prossimo incontro"}
          </p>
          <h1>{e.title}.</h1>
          <p className="event-subtitle">{e.subtitle}</p>
          <p className="event-summary">{e.description}</p>
          <dl className="event-facts">
            <div>
              <dt>
                <CalendarDays size={19} />
                Data
              </dt>
              <dd>
                <time dateTime={e.date ?? undefined}>{e.dateLabel}</time>
              </dd>
            </div>
            <div>
              <dt>
                <Clock3 size={19} />
                Orario
              </dt>
              <dd>{e.hours}</dd>
            </div>
            <div>
              <dt>
                <MapPin size={19} />
                Luogo
              </dt>
              <dd>
                {e.location}
                <span>{e.address}</span>
              </dd>
            </div>
          </dl>
          {e.registrationUrl && e.status === "upcoming" ? (
            <a
              className="button"
              href={e.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Partecipa all’incontro
            </a>
          ) : (
            <SiteButton asChild>
              <Link href="/archivio">Esplora l’archivio visivo</Link>
            </SiteButton>
          )}
        </div>
        <img
          className="event-detail-poster"
          src={e.image}
          alt={`Locandina ${e.title}: ${e.subtitle}`}
          width="1312"
          height="1632"
          fetchPriority="high"
        />
      </section>
      <section className="wrap program-section">
        <div className="section-top">
          <div>
            <p className="eyebrow">Le voci di Raccontarci</p>
            <h2>Il programma.</h2>
          </div>
          <p>
            Gli interventi e i laboratori raccontati nelle locandine
            dell’incontro.
          </p>
        </div>
        <div className="program-grid">
          {program.map((p, i) => (
            <article key={p.id}>
              <span className="program-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{p.title}</h3>
              <p>{p.subtitle}</p>
            </article>
          ))}
        </div>
      </section>
      <ContactInvitation />
    </main>
  );
}
