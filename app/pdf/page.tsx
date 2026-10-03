import Image from "next/image";
import { copy } from "@/lib/copy";
import { assetUrl, loadCv } from "@/lib/cv";
import { formatPeriod, resolveMarkers } from "@/lib/years";
import "./pdf.css";

/**
 * The print view: the CV as an A4 document, single column, no motion.
 *
 * It is a tool, not a destination: the generation script
 * (scripts/generate-pdf.ts) opens it on the production server and prints
 * it to public/cv.pdf, and it is marked noindex (metadata + robots.ts) so
 * it never shows up in search engines.
 *
 * The year math ({years_in_role}, {career_years}) is recomputed on every
 * revalidation, exactly like the web page (same `revalidate` literal).
 */
export const revalidate = 86400;

const cv = loadCv();

// Kept out of search engines: noindex on the page itself, and
// app/robots.ts disallows the route as well — both layers agree.
export const metadata = {
  title: copy.page.titlePdf(cv.name),
  robots: { index: false, follow: false },
};

export default function PdfPage() {
  const profile = resolveMarkers(cv.profile, { cv });

  const experienceItems = cv.experience.map((job) => ({
    current: job.current,
    period: formatPeriod(job.from, job.to, job.current, copy.timeline.current),
    position: job.position,
    company: job.company,
    description: resolveMarkers(job.description, { cv, job }),
  }));

  const educationItems = cv.education.map((edu) => ({
    period: formatPeriod(edu.from, edu.to, false, copy.timeline.current),
    degree: edu.degree,
    institution: edu.institution,
    level: edu.level,
  }));

  // Flat, visible contact line in the header (item: phone, email and
  // location must read as plain text when printed): the values are
  // themselves the link text, with no button or icon styling.
  const location = [
    cv.contact.city,
    cv.contact.province,
    cv.contact.country,
  ].join(", ");

  return (
    <div className="pdf-stage">
      <div className="pdf-sheet">
        <header className="pdf-header">
          <div className="pdf-header-top">
            {/* Small arch photo: the page's one framed object, kept on the
                print version (ring only — no shadow). */}
            <div className="pdf-photo">
              <Image
                src={assetUrl(cv.photo.web)}
                alt={copy.page.photoAlt(cv.name)}
                width={96}
                height={128}
              />
            </div>
            <div className="pdf-id">
              <h1>{cv.name}</h1>
              <div className="pdf-mark" aria-hidden />
              <address className="pdf-contact">
                <a href={`tel:${cv.contact.phoneLink}`}>{cv.contact.phone}</a>
                <span className="pdf-sep" aria-hidden>
                  ·
                </span>
                <a href={`mailto:${cv.contact.email}`}>{cv.contact.email}</a>
                <span className="pdf-sep" aria-hidden>
                  ·
                </span>
                <span>{location}</span>
              </address>
            </div>
          </div>
          <p className="pdf-profile">{profile}</p>
        </header>

        <section className="pdf-section" aria-labelledby="pdf-experiencia">
          {/* Hairline + heading stay together: a mark separated from its
              heading at a page break would look like a stray line. */}
          <div className="pdf-section-head">
            <div className="pdf-mark" aria-hidden />
            <h2 id="pdf-experiencia">{copy.sections.experience}</h2>
          </div>
          <ol className="pdf-xp">
            {experienceItems.map((item) => (
              <li
                key={item.company}
                className={
                  item.current ? "pdf-xp-item is-current" : "pdf-xp-item"
                }
              >
                <p className="pdf-period">{item.period}</p>
                <h3>{item.position}</h3>
                <p className="pdf-company">{item.company}</p>
                <p className="pdf-desc">{item.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="pdf-section" aria-labelledby="pdf-educacion">
          <div className="pdf-section-head">
            <div className="pdf-mark" aria-hidden />
            <h2 id="pdf-educacion">{copy.sections.education}</h2>
          </div>
          <ul>
            {educationItems.map((item) => (
              <li key={item.degree} className="pdf-edu-item">
                <p className="pdf-period">{item.period}</p>
                <h3>{item.degree}</h3>
                <p className="pdf-institution">{item.institution}</p>
                <p className="pdf-level">{item.level}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="pdf-section" aria-labelledby="pdf-informatica">
          <div className="pdf-section-head">
            <div className="pdf-mark" aria-hidden />
            <h2 id="pdf-informatica">{copy.sections.computerSkills}</h2>
          </div>
          <ul>
            {cv.computerSkills.map((skill) => (
              <li key={skill.name} className="pdf-skill">
                <span className="pdf-skill-name">{skill.name}</span>
                <span className="pdf-skill-level">{skill.level}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
