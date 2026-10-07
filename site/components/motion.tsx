"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function Motion() {
  const path = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    nodes.forEach((n) => {
      if (n.getBoundingClientRect().top > window.innerHeight) {
        n.classList.add("will-reveal");
        observer.observe(n);
      }
    });
    let raf = 0;
    const update = () => {
      raf = 0;
      const art = document.querySelector<HTMLElement>(".hero-art");
      if (art) {
        const amount = Math.min(window.scrollY, 650) * 0.04;
        art.style.setProperty("--art-shift", `${amount}px`);
      }
    };
    const scroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(raf);
      nodes.forEach((n) => n.classList.remove("will-reveal"));
    };
  }, [path]);
  return null;
}
