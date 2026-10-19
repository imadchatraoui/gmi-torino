// Dati per i motori di ricerca, generati in build da src/data/events.js (vite.config.js):
// schede evento schema.org nella home, robots.txt e sitemap.xml.
export const SITE = 'https://gmitorino.org'

// la sezione stessa: nome, logo e profili, così i motori di ricerca la riconoscono
export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GMI Torino',
  alternateName: 'Giovani Musulmani d’Italia · Torino',
  url: SITE,
  logo: `${SITE}/brand/gmi-torino-640.png`,
  email: 'gmitorino@gmail.com',
  sameAs: ['https://www.instagram.com/gmi.torino/'],
  parentOrganization: { '@type': 'Organization', name: 'Giovani Musulmani d’Italia', url: 'https://gmitalia.org' },
  address: { '@type': 'PostalAddress', addressLocality: 'Torino', addressCountry: 'IT' },
})

export function eventJsonLd(ev) {
  const price = parseFloat(String(ev.price ?? '').replace(',', '.'))
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: ev.name,
    startDate: ev.start,
    endDate: ev.end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: ev.venue,
      address: { '@type': 'PostalAddress', addressLocality: ev.city, addressCountry: 'IT' },
    },
    image: [`${SITE}/og-menu.jpg`],
    description: `${ev.name} di GMI Torino (Giovani Musulmani d’Italia).`,
    organizer: { '@type': 'Organization', name: 'GMI Torino', url: SITE },
    ...(Number.isFinite(price) && {
      offers: {
        '@type': 'Offer',
        price,
        priceCurrency: 'EUR',
        url: ev.signup?.url ?? `${SITE}/#eventi`,
        availability: 'https://schema.org/InStock',
      },
    }),
  }
}

export const robotsTxt = () => `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /corposunnah/\n\nSitemap: ${SITE}/sitemap.xml\n`

export const sitemapXml = (paths) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${SITE}${p}</loc></url>`)
    .join('\n')}\n</urlset>\n`
