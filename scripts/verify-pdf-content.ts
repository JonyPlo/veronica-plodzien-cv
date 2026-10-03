/**
 * Round-12 pre-publish check (read-only): verify that public/cv.pdf carries
 * exactly the same information as data/cv.json, with the same dynamic-year
 * math the web uses, and that those years match the live web page.
 *
 * Usage (from the project root):
 *   node scripts/verify-pdf-content.ts [web-base-url]   (default :3100)
 *
 * Uses the SAME lib/years.ts + lib/cv.ts as the app, so the markers are
 * resolved exactly as they are on the web and in the PDF page.
 */
import { readFileSync } from "node:fs";
import mupdf from "mupdf";
import { loadCv } from "../lib/cv.ts";
import { currentYearInTucuman, resolveMarkers, formatPeriod } from "../lib/years.ts";

const base = process.argv[2] ?? "http://localhost:3100/";
const copy = { current: "Actualidad" } as const;

const cv = loadCv();
const year = currentYearInTucuman();
const earliestFrom = Math.min(...cv.experience.map((j: { from: number }) => j.from));
const currentJob = cv.experience.find((j: { current: boolean }) => j.current);
if (!currentJob) throw new Error("no current job in cv.json");
const career = resolveMarkers("{career_years}", { cv });
const inRole = resolveMarkers("{years_in_role}", { cv, job: currentJob });

// ---- the strings the CV must contain, resolved exactly like the web ----
const expected: Record<string, string> = {
  name: cv.name,
  profile: resolveMarkers(cv.profile, { cv }),
  "contact.phone": cv.contact.phone,
  "contact.email": cv.contact.email,
  "contact.location": [
    cv.contact.city,
    cv.contact.province,
    cv.contact.country,
  ].join(", "),
};
for (const job of cv.experience) {
  expected[`xp.company.${job.company}`] = job.company;
  expected[`xp.position.${job.position}`] = job.position;
  expected[`xp.desc.${job.company}`] = resolveMarkers(job.description, { cv, job });
  expected[`xp.period.${job.company}`] = formatPeriod(
    job.from,
    job.to,
    job.current,
    copy.current,
  );
}
for (const edu of cv.education) {
  expected[`edu.degree.${edu.degree}`] = edu.degree;
  expected[`edu.institution.${edu.institution}`] = edu.institution;
  expected[`edu.level.${edu.level}`] = edu.level;
  expected[`edu.period.${edu.institution}`] = formatPeriod(
    edu.from,
    edu.to,
    false,
    copy.current,
  );
}
for (const s of cv.computerSkills) {
  expected[`skill.${s.name}`] = s.name;
  expected[`skill.level.${s.name}`] = s.level;
}

// ---- extract the PDF text (synchronous API) ----
const doc = mupdf.Document.openDocument(
  readFileSync("public/cv.pdf"),
  "application/pdf",
);
const pageCount = doc.countPages();
const pdfText = Array.from({ length: pageCount }, (_, i) =>
  String(doc.loadPage(i).toStructuredText({}).asText()),
).join("\n");

// ---- fetch the live web page text (strip tags) ----
const webHtml = await (await fetch(base)).text();
const webText = webHtml
  .replace(/<script[\s\S]*?<\/script>/g, " ")
  .replace(/<style[\s\S]*?<\/style>/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&");

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
const pdf = norm(pdfText);
const web = norm(webText);

console.log(`\n=== dynamic years (Tucumán, via lib/years.ts) ===`);
console.log(`  current year  = ${year}`);
console.log(`  career_years  = "${career}"   (${year} − ${earliestFrom})`);
console.log(`  years_in_role = "${inRole}"   (${year} − ${currentJob.from})`);
console.log(`  PDF pages     = ${pageCount}`);

let pass = 0;
let fail = 0;
const failLines: string[] = [];
for (const [label, value] of Object.entries(expected)) {
  const needle = norm(value);
  const inPdf = pdf.includes(needle);
  const inWeb = web.includes(needle);
  if (inPdf && inWeb) {
    pass += 1;
  } else {
    fail += 1;
    failLines.push(
      `  ✗ ${label}\n      value: "${value}"\n      pdf:${inPdf ? "✓" : "✗"}  web:${inWeb ? "✓" : "✗"}`,
    );
  }
}

// dynamic years specifically
for (const [label, value] of [
  ["career_years (profile)", career],
  ["years_in_role (current job)", inRole],
] as const) {
  const needle = norm(value);
  if (pdf.includes(needle) && web.includes(needle)) {
    pass += 1;
    console.log(`  ✓ years.${label} = "${value}"  (pdf ✓, web ✓)`);
  } else {
    fail += 1;
    console.log(
      `  ✗ years.${label} = "${value}"  (pdf ${pdf.includes(needle) ? "✓" : "✗"}, web ${web.includes(needle) ? "✓" : "✗"})`,
    );
  }
}

console.log(`\n=== field comparison (${pass} ok, ${fail} failing) ===`);
if (failLines.length) console.log(failLines.join("\n"));

// nothing extra in the PDF that the web doesn't also have
const pdfLines = Array.from(
  new Set(
    pdfText
      .split("\n")
      .map((l: string) => norm(l))
      .filter((l: string) => l.length > 0),
  ),
);
const webOnly: string[] = [];
for (const line of pdfLines) {
  if (!web.includes(line)) webOnly.push(line);
}
console.log(
  `\n=== PDF lines NOT found in the web text (should be empty) ===`,
);
if (webOnly.length) console.log(webOnly.map((l: string) => `  ? ${l}`).join("\n"));
else console.log("  (none)");

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
