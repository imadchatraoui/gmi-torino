// Import newly supplied event photographs from the repository root.
// Dates are taken only from a YYYY-MM-DD filename, never from filesystem times.
import {
  readdir,
  readFile,
  writeFile,
  copyFile,
  mkdir,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../../", import.meta.url));
const target = fileURLToPath(new URL("../public/media/", import.meta.url));
const galleryPath = fileURLToPath(
  new URL("../content/gallery.json", import.meta.url),
);
const data = JSON.parse(await readFile(galleryPath, "utf8"));
await mkdir(target, { recursive: true });
const names = await readdir(root);
let count = 0;
for (const filename of names.sort()) {
  if (
    !/\.(jpe?g|png|webp|avif)$/i.test(filename) ||
    /(logo|cropped|gmi_singolo)/i.test(filename)
  )
    continue;
  const existing = data.find(
    (i) => (i.sourceFile ?? path.basename(i.src)) === filename,
  );
  if (existing) {
    await copyFile(
      path.join(root, filename),
      path.join(target, path.basename(existing.src)),
    );
    continue;
  }
  let id =
    filename
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `foto-${data.length + 1}`;
  if (data.some((i) => i.id === id)) id += `-${data.length + 1}`;
  const match = filename.match(/(20\d{2})[-_](\d{2})[-_](\d{2})/);
  let dateLabel = "Dall’archivio";
  if (match) {
    const date = new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00Z`);
    if (
      !Number.isNaN(date.valueOf()) &&
      date.toISOString().slice(0, 10) === `${match[1]}-${match[2]}-${match[3]}`
    )
      dateLabel = new Intl.DateTimeFormat("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Rome",
      }).format(date);
  }
  const safeName = `${id}${path.extname(filename).toLowerCase()}`;
  await copyFile(path.join(root, filename), path.join(target, safeName));
  data.push({
    id,
    sourceFile: filename,
    src: `/media/${safeName}`,
    title: "Un momento insieme",
    subtitle: "Archivio fotografico · GMI Torino",
    alt: "Fotografia di un incontro della comunità GMI Torino",
    kind: "photo",
    eventId: null,
    dateLabel,
  });
  count++;
}
await writeFile(galleryPath, JSON.stringify(data, null, 2) + "\n");
console.log(
  `Archivio aggiornato: ${count} nuove immagini, ${data.length} materiali totali.`,
);
