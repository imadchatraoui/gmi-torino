import { site } from "@/lib/content";
import type { Metadata } from "next";
import "./globals.css";
import { Motion } from "@/components/motion";
import { Header, Footer } from "@/components/site-shell";
export const metadata: Metadata = {
  title: {
    default: "GMI Torino · Giovani Musulmani d’Italia",
    template: "%s · GMI Torino",
  },
  description:
    "La comunità dei Giovani Musulmani d’Italia a Torino. Identità, formazione, cittadinanza attiva, eventi e storie da condividere.",
  robots: { index: site.legal.reviewed, follow: site.legal.reviewed },
  metadataBase: new URL(site.canonicalUrl ?? site.nationalUrl),
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>
        <Header />
        {children}
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
