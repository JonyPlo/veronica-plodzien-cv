import { copy } from "@/lib/copy";
import { Reveal } from "@/components/reveal";
import { DownloadCvButton } from "@/components/download-button";

interface ContactSectionProps {
  phone: string;
  phoneLink: string;
  whatsapp: string;
  email: string;
  location: string;
}

const linkClasses =
  "text-navy underline decoration-ink/25 transition-colors duration-200 hover:decoration-terracotta";

// Shared row structure for all three contact rows: on mobile the label sits
// above its value (smaller, secondary color); from sm up the label is a
// fixed-width column (never wraps) to the left of the value.
const rowClasses = "flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3";
const labelClasses =
  "text-[0.8125rem] text-ink-soft sm:w-24 sm:shrink-0 sm:text-base md:text-[0.9375rem]";

export function ContactSection({
  phone,
  phoneLink,
  whatsapp,
  email,
  location,
}: ContactSectionProps) {
  return (
    <section aria-labelledby="seccion-contacto" className="mt-16 pb-20 sm:mt-24">
      <Reveal>
        <div aria-hidden className="mb-4 h-px w-8 bg-terracotta" />
        <h2
          id="seccion-contacto"
          className="font-display text-3xl font-semibold text-navy sm:text-4xl"
        >
          {copy.sections.contact}
        </h2>
      </Reveal>

      <Reveal delay={0.08}>
        <address className="mt-8 space-y-4 not-italic">
          <div className={rowClasses}>
            <span className={labelClasses}>
              {copy.contact.phoneLabel}
            </span>
            <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-3">
              <a href={`tel:${phoneLink}`} className={linkClasses}>
                {phone}
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-9 items-center rounded-full border border-navy/30 px-3.5 text-sm font-medium text-navy transition-colors duration-200 hover:border-navy hover:bg-navy/5"
              >
                {copy.contact.whatsappButton}
              </a>
            </div>
          </div>
          <div className={rowClasses}>
            <span className={labelClasses}>
              {copy.contact.emailLabel}
            </span>
            <a href={`mailto:${email}`} className={linkClasses}>
              {email}
            </a>
          </div>
          <div className={rowClasses}>
            <span className={labelClasses}>
              {copy.contact.locationLabel}
            </span>
            <span>{location}</span>
          </div>
        </address>
        <div className="mt-8">
          <DownloadCvButton className="w-full sm:w-auto" />
        </div>
      </Reveal>
    </section>
  );
}
