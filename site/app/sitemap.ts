import type { MetadataRoute } from "next";
import { site, events } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.canonicalUrl || !site.legal.reviewed) return [];
  const routes = [
    "",
    "/chi-siamo",
    "/attivita",
    "/eventi",
    "/archivio",
    "/contatti",
    "/privacy",
    "/cookie",
    "/note-legali",
    ...events.map((e) => `/eventi/${e.slug}`),
  ];
  return routes.map((r) => ({
    url: `${site.canonicalUrl}${r}`,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.6,
  }));
}
