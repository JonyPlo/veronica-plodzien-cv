import { copy } from "@/lib/copy";
import { Reveal } from "@/components/reveal";

export interface SkillItem {
  name: string;
  level: string;
}

interface SkillsSectionProps {
  items: SkillItem[];
}

export function SkillsSection({ items }: SkillsSectionProps) {
  return (
    <section aria-labelledby="seccion-informatica" className="mt-16 sm:mt-24">
      <Reveal>
        <div aria-hidden className="mb-4 h-px w-8 bg-terracotta" />
        <h2
          id="seccion-informatica"
          className="font-display text-3xl font-semibold text-navy sm:text-4xl"
        >
          {copy.sections.computerSkills}
        </h2>
      </Reveal>

      <Reveal delay={0.08} className="mt-8">
        <ul>
          {items.map((item, index) => (
            <li
              key={item.name}
              className={`flex items-baseline justify-between gap-6 py-3.5 ${
                index > 0 ? "border-t border-ink/10" : ""
              }`}
            >
              <span className="font-medium">{item.name}</span>
              <span className="shrink-0 text-base text-ink-soft md:text-[0.9375rem]">
                {item.level}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
