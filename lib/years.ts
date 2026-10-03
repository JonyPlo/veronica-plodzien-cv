import type { Cv, CvExperience } from "@/lib/cv";

/**
 * Shared year math for the web and the PDF — the single source of truth so
 * both can never show different numbers.
 *
 * Markers resolved (kept verbatim in data/cv.json, replaced here):
 *   {years_in_role} — only valid inside a job with "current": true and a
 *                     numeric "from"; otherwise the build fails.
 *   {career_years}  — current year minus the earliest "from" across all
 *                     experience entries.
 *
 * Any other `{marker}` in a rendered text fails the build with a clear
 * message instead of leaking to the UI.
 */

const TZ = "America/Argentina/Tucuman";

const MARKER_PATTERN = /\{([a-z_]+)\}/g;

export function fail(message: string): never {
  throw new Error(`[years] ${message}`);
}

/** Current calendar year in the candidate's timezone, never the server's. */
export function currentYearInTucuman(): number {
  const text = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
  }).format(new Date());
  const year = Number(text);
  if (!Number.isInteger(year) || year < 2000) {
    fail(`cannot resolve the current year in ${TZ}`);
  }
  return year;
}

/** Spanish count with the unit already agreed: "1 año", "11 años". */
export function formatYearSpan(years: number): string {
  if (years < 0) {
    fail(`negative year span (${years}); check the "from" values in data/cv.json`);
  }
  return years === 1 ? "1 año" : `${years} años`;
}

function earliestFrom(cv: Cv): number {
  if (cv.experience.length === 0) {
    fail("career_years: there is no experience data to measure from");
  }
  return Math.min(...cv.experience.map((job) => job.from));
}

/**
 * Replace every marker in a text. Pass the job when the text belongs to a
 * specific experience entry (required to resolve {years_in_role}).
 */
export function resolveMarkers(
  text: string,
  ctx: { cv: Cv; job?: CvExperience | null },
): string {
  const currentYear = currentYearInTucuman();
  return text.replace(MARKER_PATTERN, (match, marker: string) => {
    switch (marker) {
      case "career_years":
        return formatYearSpan(currentYear - earliestFrom(ctx.cv));
      case "years_in_role": {
        if (!ctx.job) {
          fail(`marker "${match}" outside of an experience entry`);
        }
        if (!ctx.job.current) {
          fail(
            `marker "${match}" is only valid for the current job; found in "${ctx.job.company}"`,
          );
        }
        if (ctx.job.to !== null) {
          fail(
            `marker "${match}" requires "to": null on the current job (${ctx.job.company})`,
          );
        }
        return formatYearSpan(currentYear - ctx.job.from);
      }
      default:
        fail(`unknown placeholder marker "${match}" in: "${text.slice(0, 60)}…"`);
    }
  });
}

/**
 * Compose a period from its numeric fields: "2015 – Actualidad",
 * "2012 – 2013". En dash per the approved content rules.
 */
export function formatPeriod(
  from: number,
  to: number | null,
  current: boolean,
  currentWord: string,
): string {
  if (to !== null) return `${from} – ${to}`;
  return `${from} – ${current ? currentWord : "???"}`;
}
