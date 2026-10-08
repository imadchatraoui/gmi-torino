"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteButton } from "@/components/brand-experience";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/animate-ui/components/radix/sheet";
const navigation = [
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/attivita", label: "Attività" },
  { href: "/eventi", label: "Eventi" },
  { href: "/archivio", label: "Archivio" },
];
export function Header() {
  const pathname = usePathname();
  return (
    <>
      <a className="skip-link" href="#main">
        Vai al contenuto
      </a>
      <header className="site-header">
        <div className="header-inner wrap">
          <Link
            className="brand"
            href="/"
            aria-label="GMI Torino, pagina iniziale"
          >
            <img src="/media/gmi-torino.png" alt="" width="449" height="556" />
            <span className="brand-name">
              GMI TORINO<small>GIOVANI MUSULMANI D’ITALIA</small>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Navigazione principale">
            {navigation.map((n) => (
              <Link
                key={n.href}
                className="nav-link"
                href={n.href}
                aria-current={pathname?.startsWith(n.href) ? "page" : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <SiteButton asChild className="header-cta">
            <Link href="/contatti">Contatti</Link>
          </SiteButton>
          <Sheet>
            <SheetTrigger asChild>
              <SiteButton className="mobile-toggle" aria-label="Apri il menu">
                <Menu size={22} />
              </SiteButton>
            </SheetTrigger>
            <SheetContent showCloseButton={false} className="mobile-menu">
              <div className="mobile-menu-top">
                <SheetTitle>GMI Torino</SheetTitle>
                <SheetClose asChild>
                  <SiteButton
                    className="icon-button"
                    aria-label="Chiudi il menu"
                  >
                    <X size={22} />
                  </SiteButton>
                </SheetClose>
              </div>
              <SheetDescription>
                Giovani Musulmani d’Italia · Torino
              </SheetDescription>
              <nav aria-label="Navigazione mobile">
                {[
                  { href: "/", label: "Home" },
                  ...navigation,
                  { href: "/contatti", label: "Contatti" },
                ].map((n) => (
                  <SheetClose asChild key={n.href}>
                    <Link
                      href={n.href}
                      aria-current={pathname === n.href ? "page" : undefined}
                    >
                      {n.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <noscript>
          <nav
            className="nojs-nav wrap"
            aria-label="Navigazione senza JavaScript"
          >
            {navigation.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
            <a href="/contatti">Contatti</a>
          </nav>
        </noscript>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <h2>
              Una città.
              <br />
              La nostra comunità.
            </h2>
            <p>
              Giovani Musulmani d’Italia
              <br />
              Sezione di Torino
            </p>
          </div>
          <div className="footer-links">
            <div>
              <span className="footer-label">Esplora</span>
              {navigation.map((n) => (
                <Link key={n.href} href={n.href}>
                  {n.label}
                </Link>
              ))}
            </div>
            <div>
              <span className="footer-label">Restiamo vicini</span>
              <Link href="/contatti">Contatti</Link>
              <a
                href="https://gmitalia.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                GMI nazionale
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GMI Torino</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookie">Cookie</Link>
            <Link href="/note-legali">Note legali</Link>
          </div>
          <span>Giovani Musulmani d’Italia · Torino</span>
        </div>
      </div>
    </footer>
  );
}
