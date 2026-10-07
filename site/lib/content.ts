import galleryData from "@/content/gallery.json";
import eventData from "@/content/events.json";
import siteData from "@/content/site.json";
export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  alt: string;
  kind: "poster" | "photo";
  eventId: string | null;
  dateLabel: string;
};
export type EventItem = {
  slug: string;
  title: string;
  subtitle: string;
  date: string | null;
  dateLabel: string;
  status: "upcoming" | "archived";
  location: string;
  address: string;
  hours: string;
  image: string;
  description: string;
  registrationUrl: string | null;
  topics: string[];
};
export const gallery = galleryData as GalleryItem[];
export const events = eventData as EventItem[];
export const site = siteData;
export const activities = [
  {
    number: "01",
    title: "Identità e dialogo",
    text: "Conoscere le proprie radici, ascoltare esperienze diverse e trovare le parole per raccontarsi.",
    detail:
      "Fede, cultura e appartenenza diventano temi da esplorare insieme, dando spazio alle domande e al confronto.",
    image: "/media/IMG_6669.webp",
  },
  {
    number: "02",
    title: "Cultura e formazione",
    text: "Imparare attraverso l’incontro. Idee, laboratori e creatività per dare forma a nuove prospettive.",
    detail:
      "Il programma di Raccontarci mette in relazione linguaggi diversi: dalla moda al cibo, dallo sport al modo in cui costruiamo la nostra identità.",
    image: "/media/IMG_6675.webp",
  },
  {
    number: "03",
    title: "Partecipazione e città",
    text: "Essere parte della comunità significa anche contribuire alla vita della città che condividiamo.",
    detail:
      "Cittadinanza e spazio pubblico sono occasioni per riflettere sul ruolo delle nuove generazioni e sul valore della partecipazione.",
    image: "/media/IMG_6674.webp",
  },
];
