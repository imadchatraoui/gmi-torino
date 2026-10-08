"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Fade } from "@/components/animate-ui/primitives/effects/fade";
import { Surface, SiteButton } from "@/components/brand-experience";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/animate-ui/components/radix/dialog";
import clipData from "@/content/hero-videos.json";

type HeroClip = {
  id: string;
  title: string;
  description: string;
  src: string;
  poster: string;
  author: string;
  sourceUrl: string;
  licenseUrl: string;
  demo: boolean;
};

const clips = (clipData as HeroClip[]).slice(0, 3);

function ClipPreview({ clip, active }: { clip: HeroClip; active: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (active) setLoaded(true);
  }, [active]);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (active && loaded && !failed) {
      element.play().catch(() => {
        // Keep the poster when the browser disallows inline playback.
      });
    } else element.pause();
    return () => element.pause();
  }, [active, loaded, failed]);
  return (
    <span className="mosaic-video-shape">
      <img src={clip.poster} alt="" width={480} height={480} />
      {!failed && (
        <video
          ref={video}
          src={loaded ? clip.src : undefined}
          poster={clip.poster}
          muted
          playsInline
          loop
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
        />
      )}
      <span className="mosaic-play"><Play size={18} fill="currentColor" /></span>
    </span>
  );
}

function ClipPlayer({ clip }: { clip: HeroClip }) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = video.current;
    return () => element?.pause();
  }, []);
  return failed ? (
    <p className="mosaic-video-error" role="status">
      Il video non è disponibile in questo momento.
    </p>
  ) : (
    <video
      ref={video}
      className="mosaic-full-video"
      src={clip.src}
      poster={clip.poster}
      controls
      muted
      playsInline
      preload="metadata"
      aria-label={clip.description}
      onError={() => setFailed(true)}
    />
  );
}

export function TorinoMosaic() {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [automatic, setAutomatic] = useState(false);
  const [paused, setPaused] = useState(false);
  const [preview, setPreview] = useState(0);
  const [selected, setSelected] = useState<HeroClip | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 851px) and (prefers-reduced-motion: no-preference)");
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean };
    }).connection;
    const update = () => setAutomatic(mq.matches && !connection?.saveData);
    const updateVisibility = () => setVisible(document.visibilityState === "visible");
    update();
    updateVisibility();
    mq.addEventListener("change", update);
    connection?.addEventListener("change", update);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    if (stage.current) observer.observe(stage.current);
    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
      connection?.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);
  const playing = automatic && inView && visible && !paused && !selected && !reduced;
  return (
    <div className="torino-mosaic" ref={stage}>
      <Fade className="mole-art" initial={false} transition={{ duration: 0.9 }}>
        <img
          src="/media/mole-geometrie-oro.png"
          alt="Illustrazione della Mole Antonelliana in oro, incorniciata da geometrie a otto punte"
          width={1254}
          height={1254}
          fetchPriority="high"
        />
      </Fade>
      <div className="mosaic-ornament mosaic-ornament-left" aria-hidden="true" />
      <div className="mosaic-ornament mosaic-ornament-right" aria-hidden="true" />
      {clips.map((clip, index) => (
        <SiteButton
          key={clip.id}
          className={`mosaic-window mosaic-window-${index}`}
          aria-label={`Apri ${clip.demo ? "il video dimostrativo" : "il video"}: ${clip.title}`}
          aria-haspopup="dialog"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setPreview(index);
          }}
          onFocus={() => setPreview(index)}
          onClick={(event) => {
            trigger.current = event.currentTarget;
            setSelected(clip);
          }}
        >
          <ClipPreview clip={clip} active={playing && preview === index} />
        </SiteButton>
      ))}
      <Surface className="mosaic-logo" dark>
        <div className="logo-plinth">
          <img
            src="/media/gmi-torino.png"
            alt="Il logo di GMI Torino"
            width={449}
            height={556}
            fetchPriority="high"
          />
        </div>
      </Surface>
      <div className="mosaic-footer">
        <p className="mosaic-caption">Giovani · Musulmani · Italiani</p>
        {clips.length > 0 && (
          <div className="mosaic-video-meta">
            {clips.some((clip) => clip.demo) && <span>Clip dimostrative</span>}
            {automatic && (
              <SiteButton
                className="mosaic-motion-toggle"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? "Riprendi le anteprime video" : "Metti in pausa le anteprime video"}
                aria-pressed={paused}
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
                {paused ? "Riprendi" : "Pausa"}
              </SiteButton>
            )}
          </div>
        )}
      </div>
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent
          className="mosaic-dialog"
          showCloseButton={false}
          initial={false}
          animate={{ opacity: 1, filter: "none", transform: "none" }}
          exit={{ opacity: 0, filter: "none", transform: "none" }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            trigger.current?.focus({ preventScroll: true });
          }}
        >
          {selected && (
            <>
              <div className="mosaic-dialog-heading">
                <div>
                  <DialogTitle>{selected.title}</DialogTitle>
                  <DialogDescription>
                    {selected.demo ? "Clip dimostrativa di repertorio. Non riprende un incontro di GMI Torino." : selected.description}
                  </DialogDescription>
                </div>
                <DialogClose asChild>
                  <SiteButton className="icon-button" aria-label="Chiudi il video"><X size={20} /></SiteButton>
                </DialogClose>
              </div>
              <ClipPlayer key={selected.id} clip={selected} />
              {selected.demo && (
                <p className="mosaic-video-credit">
                  Video da <a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer">{selected.author}</a>
                  {" · "}<a href={selected.licenseUrl} target="_blank" rel="noopener noreferrer">Licenza</a>
                  {" · "}Riproduzione senza audio
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
