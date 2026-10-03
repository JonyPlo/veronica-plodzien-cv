import { copy } from "@/lib/copy";
import { Reveal } from "@/components/reveal";

export interface EducationItem {
  period: string;
  degree: string;
  institution: string;
  level: string;
}

interface EducationSectionProps {
  items: EducationItem[];
}

export function EducationSection({ items }: EducationSectionProps) {
  return (
    <section aria-labelledby="seccion-educacion" className="mt-16 sm:mt-24">
      <Reveal>
        <div aria-hidden className="mb-4 h-px w-8 bg-terracotta" />
        <h2
          id="seccion-educacion"
          className="font-display text-3xl font-semibold text-navy sm:text-4xl"
        >
          {copy.sections.education}
        </h2>
      </Reveal>

      <Reveal delay={0.08} className="mt-8">
        <ul>
          {items.map((item, index) => (
            <li
              key={item.degree}
              className={index > 0 ? "border-t border-ink/10 py-5 first:pt-0" : "py-5"}
            >
              <p className="text-sm font-medium tracking-wide text-ink-soft tabular-nums">
                {item.period}
              </p>
              <h3 className="mt-1.5 font-display text-xl font-semibold text-ink sm:text-2xl">
                {item.degree}
              </h3>
              <p className="mt-1 font-medium text-navy">{item.institution}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{item.level}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
