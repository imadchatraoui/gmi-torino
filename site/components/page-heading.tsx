import Link from "next/link";
export function PageHeading({
  label,
  title,
  italic,
  description,
}: {
  label: string;
  title: string;
  italic?: string;
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
        {italic && (
          <>
            <br />
            <em>{italic}</em>
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
        <p className="eyebrow">C’è spazio anche per te</p>
        <h2>
          Le prossime storie?
          <br />
          <em>Scriviamole insieme.</em>
        </h2>
      </div>
      <div>
        <p>
          Vuoi conoscere la comunità, proporre un’idea o collaborare a
          un’iniziativa?
        </p>
        <Link className="button" href="/contatti">
          Entra in contatto
        </Link>
      </div>
    </section>
  );
}
