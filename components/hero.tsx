"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { copy } from "@/lib/copy";
import { DownloadCvButton } from "@/components/download-button";

interface HeroProps {
  name: string;
  photoSrc: string;
  photoAlt: string;
  profile: string;
  phone: string;
  phoneLink: string;
  whatsapp: string;
  email: string;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const parent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/**
 * Reduced-motion users get explicit final-state values instead of variants.
 * That matters beyond the media query: the SSR HTML carries the hidden
 * initial styles, and an empty `animate` never clears them, so without
 * explicit values the hero would stay invisible.
 */
function useEntrance() {
  const reduce = useReducedMotion();
  return reduce
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { variants: item, initial: "hidden", animate: "show" };
}

export function Hero(props: HeroProps) {
  const reduce = useReducedMotion();
  const entrance = useEntrance();

  return (
    <section className="pt-10 sm:pt-16 md:pt-20">
      <motion.div
        className="grid items-center gap-8 md:grid-cols-[17rem_1fr] md:gap-12 lg:grid-cols-[18rem_1fr] lg:gap-16"
        variants={reduce ? undefined : parent}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "show"}
      >
        {/* Photo: soft arch, the quiet center of the page. On phones it
            takes ~70% of the available width (capped at 260px); from md up
            it fills its grid track. */}
        <motion.div
          {...entrance}
          className="mx-auto w-[min(70%,260px)] md:mx-0 md:w-full"
        >
          <div className="overflow-hidden rounded-b-2xl rounded-t-[999px] shadow-[0_18px_40px_-22px_rgba(20,38,63,0.45)] ring-1 ring-ink/10">
            <Image
              src={props.photoSrc}
              alt={props.photoAlt}
              width={600}
              height={800}
              // The hero portrait is the page's LCP: load it eagerly with
              // high fetch priority. (Next 16: `priority` is deprecated;
              // eager + fetchPriority is the documented pattern.)
              loading="eager"
              fetchPriority="high"
              className="h-auto w-full"
            />
          </div>
        </motion.div>

        {/* Name, mark, profile, actions */}
        <div className="min-w-0 lg:max-w-[600px]">
          <motion.h1
            {...entrance}
            className="font-display text-[clamp(2.75rem,7vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.015em] text-navy"
          >
            {props.name}
          </motion.h1>

          <motion.div
            {...entrance}
            aria-hidden
            className="mt-5 h-px w-16 bg-terracotta"
          />

          <motion.p
            {...entrance}
            className="mt-5 max-w-[60ch] text-lg leading-relaxed"
          >
            {props.profile}
          </motion.p>

          <motion.div
            {...entrance}
            className="mt-8 flex flex-col gap-2.5 sm:gap-3"
          >
            {/* Row 1: the primary action — the PDF download */}
            <DownloadCvButton className="w-full sm:w-auto" />
            {/* Row 2: the three contact actions, one row, equal size and gap.
                md:px-4 (lg:px-5 restores) keeps "Escribir un mail" on one
                line inside the 768px two-column hero without touching the
                shared height or the gap between buttons. */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-nowrap sm:items-center sm:gap-3">
              <a
                href={`tel:${props.phoneLink}`}
                // The visible text ("Llamar") hides the number; the
                // accessible name says what the action actually does.
                aria-label={copy.hero.callA11y}
                className="inline-flex w-full items-center justify-center rounded-full border border-navy/30 px-5 py-2.5 font-medium text-navy transition-[background-color,border-color,color] duration-200 hover:border-navy hover:bg-navy/5 md:px-4 lg:px-5 sm:w-auto"
              >
                {copy.hero.call}
              </a>
              <a
                href={`https://wa.me/${props.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                // The visible text ("WhatsApp") is ambiguous for
                // screen-reader users; the name states the action and the
                // new-tab behavior.
                aria-label={`${copy.hero.whatsappA11y} ${copy.hero.whatsappNewTabCue}`}
                className="inline-flex w-full items-center justify-center rounded-full border border-navy/30 px-5 py-2.5 font-medium text-navy transition-[background-color,border-color,color] duration-200 hover:border-navy hover:bg-navy/5 md:px-4 lg:px-5 sm:w-auto"
              >
                {copy.hero.whatsapp}
              </a>
              <a
                href={`mailto:${props.email}`}
                className="inline-flex w-full items-center justify-center rounded-full border border-navy/30 px-5 py-2.5 font-medium text-navy transition-[background-color,border-color,color] duration-200 hover:border-navy hover:bg-navy/5 md:px-4 lg:px-5 sm:w-auto"
              >
                {copy.hero.email}
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
