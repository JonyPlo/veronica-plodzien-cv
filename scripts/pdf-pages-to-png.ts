/**
 * Render every page of a PDF to PNG (one file per page), for visual
 * review of generated documents (e.g. the CV PDF).
 *
 * Renderer: mupdf (Artifex MuPDF, prebuilt native binding — no system
 * tools required).
 *
 * Usage (from the project root):
 *   node scripts/pdf-pages-to-png.ts <pdf-path> <out-dir> [dpi]
 *
 * Example:
 *   node scripts/pdf-pages-to-png.ts public/cv.pdf .impeccable/review 110
 */
import { mkdirSync } from "node:fs";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import mupdf from "mupdf";

const [pdfPath, outDir, dpiArg] = process.argv.slice(2);
if (!pdfPath || !outDir) {
  console.error("usage: pdf-pages-to-png.ts <pdf-path> <out-dir> [dpi]");
  process.exit(2);
}

const dpi = Number(dpiArg ?? 110);
const base = path.basename(pdfPath).replace(/\.pdf$/i, "");

const doc = mupdf.Document.openDocument(
  readFileSync(path.resolve(pdfPath)),
  "application/pdf",
);
const count = doc.countPages();
console.log(`✓ ${count} page(s) in ${pdfPath} — rendering at ${dpi} dpi`);

mkdirSync(path.resolve(outDir), { recursive: true });
const scale = dpi / 72;

for (let i = 0; i < count; i += 1) {
  const page = doc.loadPage(i);
  const pixmap = page.toPixmap(
    mupdf.Matrix.scale(scale, scale),
    mupdf.ColorSpace.DeviceRGB,
    false,
  );
  const out = path.resolve(outDir, `${base}-page${i + 1}.png`);
  writeFileSync(out, pixmap.asPNG());
  console.log(`  page ${i + 1} → ${out} (${pixmap.getWidth()}×${pixmap.getHeight()})`);
}
