"use client";
import { SiteButton } from "@/components/brand-experience";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="not-found wrap">
      <p className="eyebrow">Un imprevisto</p>
      <h1>
        Riproviamo
        <br />
        <span className="accent-text">insieme.</span>
      </h1>
      <p>Non siamo riusciti a caricare questa pagina.</p>
      <SiteButton className="button" onClick={reset}>
        Riprova
      </SiteButton>
    </main>
  );
}
