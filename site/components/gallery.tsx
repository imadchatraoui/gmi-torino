"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { GalleryItem } from "@/lib/content";

function Lightbox({
  items,
  selected,
  onSelect,
  returnFocus,
}: {
  items: GalleryItem[];
  selected: number | null;
  onSelect: (n: number | null) => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
}) {
  const item = selected === null ? null : items[selected];
  const move = useCallback(
    (direction: number) => {
      if (selected !== null)
        onSelect((selected + direction + items.length) % items.length);
    },
    [selected, items.length, onSelect],
  );
  useEffect(() => {
    if (selected === null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [selected, move]);
  return (
    <Dialog
      open={!!item}
      onOpenChange={(open) => {
        if (!open) onSelect(null);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="lightbox"
        onCloseAutoFocus={(event) => {
          if (returnFocus.current?.isConnected) {
            event.preventDefault();
            returnFocus.current.focus({ preventScroll: true });
          }
        }}
      >
        {item && (
          <>
            <div className="lightbox-top">
              <div>
                <DialogTitle>{item.title}</DialogTitle>
                <DialogDescription>
                  {item.dateLabel} ·{" "}
                  {item.kind === "photo" ? "Fotografia" : "Locandina"}
                </DialogDescription>
              </div>
              <DialogClose asChild>
                <button className="icon-button" aria-label="Chiudi l’immagine">
                  <X size={22} />
                </button>
              </DialogClose>
            </div>
            <div className="lightbox-image">
              <img src={item.src} alt={item.alt} />
            </div>
            <div className="lightbox-bottom">
              <button
                className="icon-button"
                aria-label="Immagine precedente"
                onClick={() => move(-1)}
              >
                <ChevronLeft size={24} />
              </button>
              <p>
                {item.subtitle}
                <span>
                  {(selected ?? 0) + 1} / {items.length}
                </span>
              </p>
              <button
                className="icon-button"
                aria-label="Immagine successiva"
                onClick={() => move(1)}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
function ImageCard({
  item,
  index,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  onOpen: (element: HTMLButtonElement) => void;
}) {
  return (
    <button
      className="gallery-card"
      onClick={(event) => onOpen(event.currentTarget)}
      aria-label={`Apri ${item.title}`}
    >
      <div className="gallery-image">
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          width="1179"
          height="1470"
        />
        <span className="gallery-zoom">
          <Maximize2 size={17} />
        </span>
        <span className="gallery-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="gallery-caption">
        <span className="gallery-date">{item.dateLabel}</span>
        <h3>{item.title}</h3>
        <p>{item.subtitle}</p>
      </div>
    </button>
  );
}
export function GalleryRail({ items }: { items: GalleryItem[] }) {
  const opener = useRef<HTMLButtonElement | null>(null);
  const section = useRef<HTMLElement>(null),
    rail = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false),
    [active, setActive] = useState(0),
    [progress, setProgress] = useState(0),
    [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    const container = section.current,
      track = rail.current;
    if (!container || !track) return;
    const mq = window.matchMedia(
      "(min-width: 1000px) and (min-height: 650px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let enabled = false,
      frame = 0;
    const read = () => {
      const max = track.scrollWidth - track.clientWidth;
      const fraction = max > 0 ? track.scrollLeft / max : 0;
      setProgress(fraction);
      setActive(
        Math.min(
          items.length - 1,
          Math.max(0, Math.round(fraction * (items.length - 1))),
        ),
      );
    };
    const apply = () => {
      frame = 0;
      if (!enabled) return;
      const top = container.getBoundingClientRect().top + window.scrollY;
      const range = container.offsetHeight - (window.innerHeight - 98);
      const fraction = Math.max(
        0,
        Math.min(1, (window.scrollY - top + 98) / Math.max(1, range)),
      );
      track.scrollLeft = (track.scrollWidth - track.clientWidth) * fraction;
      read();
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const resize = () => {
      enabled = mq.matches;
      setPinned(enabled);
      const max = track.scrollWidth - track.clientWidth;
      container.style.setProperty(
        "--rail-height",
        `${window.innerHeight + max * 0.72}px`,
      );
      if (enabled) scroll();
      else read();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(track);
    mq.addEventListener("change", resize);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);
    track.addEventListener("scroll", read, { passive: true });
    resize();
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", resize);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
      track.removeEventListener("scroll", read);
      cancelAnimationFrame(frame);
    };
  }, [items.length]);
  const go = (index: number) => {
    const track = rail.current,
      container = section.current;
    if (!track || !container) return;
    const max = track.scrollWidth - track.clientWidth;
    const left =
      max * Math.min(1, Math.max(0, index / Math.max(1, items.length - 1)));
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (pinned) {
      const start = container.getBoundingClientRect().top + window.scrollY - 98;
      const range = container.offsetHeight - (window.innerHeight - 98);
      window.scrollTo({
        top: start + (max > 0 ? left / max : 0) * range,
        behavior: reduce ? "instant" : "smooth",
      });
    } else {
      track.scrollTo({ left, behavior: reduce ? "instant" : "smooth" });
    }
  };
  const current = items[active];
  return (
    <section
      ref={section}
      className={`rail-section ${pinned ? "is-pinned" : ""}`}
      aria-labelledby="rail-title"
    >
      <div className="rail-pin">
        <div className="wrap">
          <div className="section-top">
            <div>
              <p className="eyebrow">Il nostro archivio visivo</p>
              <h2 id="rail-title">
                Le storie restano.
                <br />
                <em>Continua a scorrere.</em>
              </h2>
            </div>
            <p className="rail-instruction">
              {pinned
                ? "Scorri la pagina e attraversa le nostre storie."
                : "Scorri le immagini, oppure usa i comandi."}
              <br />
              Ogni incontro lascia una traccia.
            </p>
          </div>
          <div
            ref={rail}
            className="rail-scroll"
            role="region"
            aria-roledescription="galleria"
            aria-label="Archivio visivo degli eventi"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.target !== e.currentTarget) return;
              if (e.key === "ArrowRight") {
                e.preventDefault();
                go(active + 1);
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                go(active - 1);
              }
              if (e.key === "Home") {
                e.preventDefault();
                go(0);
              }
              if (e.key === "End") {
                e.preventDefault();
                go(items.length - 1);
              }
            }}
          >
            {items.map((item, i) => (
              <ImageCard
                key={item.id}
                item={item}
                index={i}
                onOpen={(element) => {
                  opener.current = element;
                  setSelected(i);
                }}
              />
            ))}
          </div>
          <div className="rail-bottom">
            <div className="rail-current" aria-live="polite" aria-atomic="true">
              <span>{current?.dateLabel}</span>
              <p>{current?.title}</p>
            </div>
            <div className="rail-progress" aria-hidden="true">
              <span style={{ width: `${Math.max(2, progress * 100)}%` }} />
            </div>
            <span className="rail-count">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
            <div className="gallery-controls">
              <button
                className="icon-button"
                aria-label="Scorri indietro nell’archivio"
                disabled={progress <= 0.001}
                onClick={() => go(active - 1)}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className="icon-button"
                aria-label="Scorri avanti nell’archivio"
                disabled={progress >= 0.999}
                onClick={() => go(active + 1)}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Lightbox
        items={items}
        selected={selected}
        onSelect={setSelected}
        returnFocus={opener}
      />
    </section>
  );
}
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const opener = useRef<HTMLButtonElement | null>(null);
  const [kind, setKind] = useState("all"),
    [selected, setSelected] = useState<number | null>(null);
  const visible = items.filter((i) => kind === "all" || i.kind === kind);
  return (
    <div className="wrap archive-grid-section">
      <Tabs
        value={kind}
        onValueChange={(value) => {
          setSelected(null);
          setKind(value);
        }}
      >
        <div className="archive-toolbar">
          <TabsList className="archive-tabs">
            <TabsTrigger value="all">
              Tutto <span>{items.length}</span>
            </TabsTrigger>
            <TabsTrigger value="photo">
              Fotografie{" "}
              <span>{items.filter((i) => i.kind === "photo").length}</span>
            </TabsTrigger>
            <TabsTrigger value="poster">
              Locandine{" "}
              <span>{items.filter((i) => i.kind === "poster").length}</span>
            </TabsTrigger>
          </TabsList>
          <span className="archive-hint">Apri un’immagine per esplorarla</span>
        </div>
        {["all", "photo", "poster"].map((value) => (
          <TabsContent key={value} value={value}>
            {visible.length ? (
              <div className="gallery-grid">
                {visible.map((item, i) => (
                  <ImageCard
                    key={item.id}
                    item={item}
                    index={i}
                    onOpen={(element) => {
                      opener.current = element;
                      setSelected(i);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p className="eyebrow">Le storie continuano</p>
                <h2>
                  Le fotografie
                  <br />
                  <em>arrivano qui.</em>
                </h2>
                <p>
                  L’archivio si arricchirà con le immagini dei nostri incontri.
                  Nel frattempo, scopri le locandine e i temi di Raccontarci.
                </p>
                <button className="button" onClick={() => setKind("poster")}>
                  Esplora le locandine
                </button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <Lightbox
        items={visible}
        selected={selected}
        onSelect={setSelected}
        returnFocus={opener}
      />
    </div>
  );
}
