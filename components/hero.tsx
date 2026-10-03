"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { copy } from "@/lib/copy";

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
        className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
        variants={reduce ? undefined : parent}
        initial={reduce ? false : "hidden"}
        animate={reduce ? undefined : "show"}
      >
        {/* Photo: soft arch, the quiet center of the page */}
        <motion.div
          {...entrance}
          className="mx-auto w-44 sm:w-52 md:mx-0 md:w-full md:max-w-[17rem]"
        >
          <div className="overflow-hidden rounded-b-2xl rounded-t-[999px] shadow-[0_18px_40px_-22px_rgba(20,38,63,0.45)] ring-1 ring-ink/10">
            <Image
              src={props.photoSrc}
              alt={props.photoAlt}
              width={600}
              height={800}
              className="h-auto w-full"
            />
          </div>
        </motion.div>

        {/* Name, mark, profile, actions */}
        <div>
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
            className="mt-5 max-w-[65ch] text-lg leading-relaxed"
          >
            {props.profile}
          </motion.p>

          <motion.div
            {...entrance}
            className="mt-8 flex flex-wrap gap-2.5 sm:gap-3"
          >
            <a
              href={`tel:${props.phoneLink}`}
              className="inline-flex items-center rounded-full bg-navy px-5 py-2.5 font-medium text-paper transition-colors duration-200 hover:bg-navy-deep"
            >
              {copy.hero.call}
            </a>
            <a
              href={`https://wa.me/${props.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-navy/30 px-5 py-2.5 font-medium text-navy transition-colors duration-200 hover:border-navy hover:bg-navy/5"
            >
              {copy.hero.whatsapp}
            </a>
            <a
              href={`mailto:${props.email}`}
              className="inline-flex items-center rounded-full border border-navy/30 px-5 py-2.5 font-medium text-navy transition-colors duration-200 hover:border-navy hover:bg-navy/5"
            >
              {copy.hero.email}
            </a>
            <a
              href="/cv.pdf"
              className="inline-flex items-center rounded-full px-3 py-2.5 font-medium text-ink-soft transition-colors duration-200 hover:text-navy"
            >
              {copy.hero.downloadPdf}
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
