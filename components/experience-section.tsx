"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { copy } from "@/lib/copy";
import { Reveal } from "@/components/reveal";

export interface ExperienceItem {
  period: string;
  position: string;
  company: string;
  description: string;
  current: boolean;
}

interface ExperienceSectionProps {
  items: ExperienceItem[];
}

export function ExperienceSection({ items }: ExperienceSectionProps) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  // The one authored moment: the spine draws itself as the story scrolls.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.85", "end 0.5"],
  });
  const drawn = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });

  return (
    <section
      aria-labelledby="seccion-experiencia"
      className="mt-16 sm:mt-24"
    >
      <Reveal>
        <div aria-hidden className="mb-4 h-px w-8 bg-terracotta" />
        <h2
          id="seccion-experiencia"
          className="font-display text-3xl font-semibold text-navy sm:text-4xl"
        >
          {copy.sections.experience}
        </h2>
      </Reveal>

      <div ref={listRef} className="relative mt-8">
        {/* Quiet guide, always present */}
        <div
          aria-hidden
          className="absolute bottom-2 left-[7px] top-1 w-px bg-ink/15"
        />
        {/* The drawn spine. Reduced motion: a static, fully drawn line —
            same element type as the animated branch so SSR stays coherent. */}
        {reduce ? (
          <div
            aria-hidden
            className="absolute bottom-2 left-[7px] top-1 w-px bg-navy"
          />
        ) : (
          <motion.div
            aria-hidden
            className="absolute bottom-2 left-[7px] top-1 w-px origin-top bg-navy"
            initial={{ scaleY: 0 }}
            style={{ scaleY: drawn }}
          />
        )}

        <ol className="space-y-10 sm:space-y-12">
          {items.map((item, index) => (
            <li key={item.company} className="relative pl-8">
              <span
                aria-hidden
                className={
                  item.current
                    ? "absolute left-0 top-1 h-3.5 w-3.5 rounded-full bg-terracotta"
                    : "absolute left-0 top-1 h-3.5 w-3.5 rounded-full border border-navy/40 bg-paper"
                }
              />
              <Reveal delay={index * 0.06}>
                <p className="text-sm font-medium tracking-wide text-ink-soft tabular-nums">
                  {item.period}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-semibold text-ink sm:text-2xl">
                  {item.position}
                </h3>
                <p className="mt-1 font-medium text-navy">{item.company}</p>
                <p className="mt-3 max-w-[62ch] leading-relaxed text-ink-soft">
                  {item.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
