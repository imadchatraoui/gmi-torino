"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="not-found wrap">
      <p className="eyebrow">Un imprevisto</p>
      <h1>
        Riproviamo
        <br />
        <em>insieme.</em>
      </h1>
      <p>Non siamo riusciti a caricare questa pagina.</p>
      <button className="button" onClick={reset}>
        Riprova
      </button>
    </main>
  );
}
