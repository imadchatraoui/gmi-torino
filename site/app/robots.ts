import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: site.legal.reviewed ? "/" : undefined,
      disallow: site.legal.reviewed ? undefined : "/",
    },
    ...(site.canonicalUrl && site.legal.reviewed
      ? { sitemap: `${site.canonicalUrl}/sitemap.xml` }
      : {}),
  };
}
