import { copy } from "@/lib/copy";
import { Reveal } from "@/components/reveal";

interface ContactSectionProps {
  phone: string;
  phoneLink: string;
  whatsapp: string;
  email: string;
  location: string;
}

const linkClasses =
  "text-navy underline decoration-ink/25 transition-colors duration-200 hover:decoration-terracotta";

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
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span className="w-24 shrink-0 text-sm text-ink-soft">
              {copy.contact.phoneLabel}
            </span>
            <a href={`tel:${phoneLink}`} className={linkClasses}>
              {phone}
            </a>
          </p>
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span className="w-24 shrink-0 text-sm text-ink-soft">
              {copy.contact.whatsappLabel}
            </span>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className={linkClasses}
            >
              {phone}
            </a>
          </p>
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span className="w-24 shrink-0 text-sm text-ink-soft">
              {copy.contact.emailLabel}
            </span>
            <a href={`mailto:${email}`} className={linkClasses}>
              {email}
            </a>
          </p>
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span className="w-24 shrink-0 text-sm text-ink-soft">
              {copy.contact.locationLabel}
            </span>
            <span>{location}</span>
          </p>
        </address>
      </Reveal>
    </section>
  );
}
