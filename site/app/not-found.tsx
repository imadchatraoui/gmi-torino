import { SiteButton } from "@/components/brand-experience";
import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found wrap">
      <p className="eyebrow">404 · Pagina non trovata</p>
      <h1>
        Ripartiamo
        <br />
        <span className="accent-text">da qui.</span>
      </h1>
      <p>
        Questa pagina non è disponibile. La nostra comunità ti aspetta sulla
        Home.
      </p>
      <SiteButton asChild>
        <Link href="/">Torna alla Home</Link>
      </SiteButton>
    </main>
  );
}
