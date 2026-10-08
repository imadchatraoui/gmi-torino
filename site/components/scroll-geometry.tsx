"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";

const HeroProgress = createContext<MotionValue<number> | null>(null);

export function useMotionDistance() {
  const reduced = useReducedMotion();
  const [distance, setDistance] = useState(0.35);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 851px)");
    const update = () => setDistance(media.matches ? 1 : 0.35);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced ? 0 : distance;
}

export function Rosette({ className = "" }: { className?: string }) {
  return (
    <svg className={`geometry-rosette ${className}`} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.8">
        {[0, 45, 90, 135].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 200 200)`}>
            <rect x="70" y="70" width="260" height="260" />
            <path d="M200 16 254 146 384 200 254 254 200 384 146 254 16 200 146 146Z" />
            <path d="M70 70 330 330M70 330 330 70" opacity=".35" />
          </g>
        ))}
        <circle cx="200" cy="200" r="182" opacity=".4" />
        <circle cx="200" cy="200" r="76" />
        <path d="M200 92 232 124 276 124 276 168 308 200 276 232 276 276 232 276 200 308 168 276 124 276 124 232 92 200 124 168 124 124 168 124Z" />
      </g>
    </svg>
  );
}

export function GeometryPage({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const distance = useMotionDistance();
  const rotate = useTransform(progress, [0, 1], [0, 95 * distance]);
  const counter = useTransform(progress, [0, 1], [22, 22 - 120 * distance]);
  const lift = useTransform(progress, [0, 1], [0, -180 * distance]);
  return (
    <div className="geometry-page" ref={root}>
      <Fade initial={false} className="geometry-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="geometry-field" aria-hidden="true">
        <Fade initial={false} className="field-rosette field-rosette-one" style={{ rotate, y: lift }}><Rosette /></Fade>
        <Fade initial={false} className="field-rosette field-rosette-two" style={{ rotate: counter }}><Rosette /></Fade>
        <Fade initial={false} className="field-rosette field-rosette-three" style={{ rotate }}><Rosette /></Fade>
        <Fade initial={false} className="field-rosette field-rosette-four" style={{ rotate: counter }}><Rosette /></Fade>
      </div>
      {children}
    </div>
  );
}

export function HeroScene({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30 });
  return (
    <section className="brand-hero hero-scroll-scene" ref={root}>
      <HeroProgress.Provider value={progress}>
        <div className="hero-sticky-composition">{children}</div>
      </HeroProgress.Provider>
    </section>
  );
}

export function useHeroProgress() {
  const progress = useContext(HeroProgress);
  if (!progress) throw new Error("The Torino mosaic belongs inside HeroScene.");
  return progress;
}

export function ScrollFigure({ children, className = "", reverse = false }: {
  children: ReactNode; className?: string; reverse?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28 });
  const distance = useMotionDistance();
  const sign = reverse ? -1 : 1;
  const rotate = useTransform(progress, [0, 1], [-10 * distance * sign, 10 * distance * sign]);
  const y = useTransform(progress, [0, 1], [55 * distance * sign, -55 * distance * sign]);
  const scale = useTransform(progress, [0, 0.5, 1], [1 - 0.06 * distance, 1, 1 - 0.06 * distance]);
  return (
    <div ref={root} className={`scroll-figure ${className}`}>
      <Fade initial={false} className="scroll-figure-motion" style={{ rotate, y, scale }}>{children}</Fade>
    </div>
  );
}
