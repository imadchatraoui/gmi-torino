"use client";

import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Blur } from "@/components/animate-ui/primitives/effects/blur";
import {
  Button,
  type ButtonProps,
} from "@/components/animate-ui/primitives/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/animate-ui/components/radix/dialog";
import BlurText from "@/components/react-bits/BlurText";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
const Threads = lazy(() => import("@/components/react-bits/Threads"));

export function ExperienceProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function SiteButton(props: ButtonProps) {
  const reduced = useReducedMotion();
  return (
    <Button
      {...props}
      hoverScale={reduced ? 1 : 1.025}
      tapScale={reduced ? 1 : 0.97}
      className={props.className ?? "button"}
    />
  );
}

export function Surface({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <SpotlightCard
      className={className}
      spotlightColor={
        dark ? "rgba(214, 184, 121, 0.24)" : "rgba(150, 58, 75, 0.10)"
      }
    >
      {children}
    </SpotlightCard>
  );
}

class DecorationBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroThreads() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia(
      "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
    );
    const update = () => setEnabled(motion.matches);
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);
  return (
    <div className="hero-background" aria-hidden="true">
      <DecorationBoundary>
        <Suspense fallback={null}>
          {enabled && (
            <Threads
              color={[0.84, 0.72, 0.47]}
              amplitude={0.7}
              distance={0.12}
              enableMouseInteraction={false}
            />
          )}
        </Suspense>
      </DecorationBoundary>
    </div>
  );
}

export function BrandTitle() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAnimated(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return (
    <div className="brand-title">
      <h1 className={animated ? "sr-only" : ""}>
        <span className="hero-word">GMI</span>
        <span className="hero-word">TORINO.</span>
      </h1>
      {animated && (
        <div aria-hidden="true" className="animated-brand-title">
          <BlurText
            text="GMI"
            animateBy="letters"
            direction="bottom"
            delay={45}
            stepDuration={0.25}
            className="hero-word"
          />
          <BlurText
            text="TORINO."
            animateBy="letters"
            direction="bottom"
            delay={45}
            stepDuration={0.25}
            className="hero-word"
          />
        </div>
      )}
    </div>
  );
}

export function SiteIntro() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"build" | "shine">("build");
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    setOpen(true);
    const update = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const safetyTimer = window.setTimeout(() => setOpen(false), 12000);
    return () => window.clearTimeout(safetyTimer);
  }, [open]);
  useEffect(() => {
    if (!open || !ready) return;
    const timer = window.setTimeout(
      () => {
        if (phase === "build") {
          setReady(false);
          setPhase("shine");
        } else setOpen(false);
      },
      phase === "build" ? 3480 : 1920,
    );
    return () => window.clearTimeout(timer);
  }, [open, ready, phase]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="site-intro"
        showCloseButton={false}
        initial={false}
        animate={{ opacity: 1, filter: "none", transform: "none" }}
        exit={{ opacity: 0, filter: "blur(4px)", transform: "none" }}
        transition={{ duration: 0.35 }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document
            .querySelector<HTMLAnchorElement>(".brand")
            ?.focus({ preventScroll: true });
        }}
      >
        <DialogTitle className="sr-only">GMI Torino</DialogTitle>
        <DialogDescription className="sr-only">
          Animazione di apertura del logo. Puoi saltarla o premere Esc.
        </DialogDescription>
        <link rel="preload" as="image" href="/media/gmi-shine.gif" />
        <div className="intro-content">
          <div className="intro-gif-stage" aria-hidden="true">
            <img
              key={phase}
              onLoad={() => setReady(true)}
              onError={() => setOpen(false)}
              src={
                phase === "build"
                  ? "/media/gmi-build.gif"
                  : "/media/gmi-shine.gif"
              }
              alt=""
              width={617}
              height={704}
            />
          </div>
          <Blur initialBlur={5} transition={{ duration: 0.55 }}>
            <p className="intro-brand">GMI Torino</p>
          </Blur>
          <Fade delay={200} transition={{ duration: 0.6 }}>
            <p className="intro-caption">Giovani Musulmani d’Italia</p>
          </Fade>
        </div>
        <DialogClose asChild>
          <SiteButton className="intro-skip">Salta intro</SiteButton>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
