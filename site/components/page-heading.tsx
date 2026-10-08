import Link from "next/link";
import { SiteButton } from "@/components/brand-experience";
export function PageHeading({
  label,
  title,
  secondLine,
  description,
}: {
  label: string;
  title: string;
  secondLine?: string;
  description: string;
}) {
  return (
    <section className="page-heading wrap">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{label}</span>
      </div>
      <p className="eyebrow">GMI Torino · {label}</p>
      <h1>
        {title}
        {secondLine && (
          <>
            <br />
            <span className="accent-text">{secondLine}</span>
          </>
        )}
      </h1>
      <p className="page-description">{description}</p>
    </section>
  );
}
export function ContactInvitation() {
  return (
    <section className="contact-invitation wrap">
      <div>
        <p className="eyebrow">Partecipa</p>
        <h2>Conosci GMI Torino.</h2>
      </div>
      <div>
        <p>
          Vuoi conoscere la comunità, proporre un’idea o collaborare a
          un’iniziativa?
        </p>
        <SiteButton asChild>
          <Link href="/contatti">Scrivici</Link>
        </SiteButton>
      </div>
    </section>
  );
}
