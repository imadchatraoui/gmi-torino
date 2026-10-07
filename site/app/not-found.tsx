import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found wrap">
      <p className="eyebrow">404 · Pagina non trovata</p>
      <h1>
        Ripartiamo
        <br />
        <em>da qui.</em>
      </h1>
      <p>
        Questa pagina non è disponibile. La nostra comunità ti aspetta sulla
        Home.
      </p>
      <Link className="button" href="/">
        Torna alla Home
      </Link>
    </main>
  );
}
