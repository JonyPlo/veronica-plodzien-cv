# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (latest stable, App Router), TypeScript, Tailwind CSS, pnpm — user-specified in the 2026-10-03 brief. Animation library: `motion`. Static-first page with daily ISR revalidation. Deployment target: [inferred] undetermined; code assumes any Node static host (Vercel-class) so daily revalidation works.

## Users

Primary: an HR recruiter (any industry) evaluating Verónica Plodzien for any kind of role. Situation (brief + [inferred]: most recruiters open it from a phone, in a few minutes, possibly in a noisy context); the job is to quickly form a confident, warm impression and decide whether to contact her.

## Product Purpose

A single-page web curriculum for Verónica Plodzien that transmits trust, warmth, and neatness ("confianza, calidez, prolijidad") and lets a recruiter act: call, WhatsApp, email, or download the PDF. Success = the recruiter finishes the page feeling the candidate is reliable and approachable, and knows exactly how to contact her. Explicitly NOT a developer-style portfolio; nothing on the page may look built by a programmer.

## Positioning

A personal, editorial, non-technical curriculum: the person (name, face, voice, real approved content) leads; the interface recedes into quiet paper-like typography. Dynamic year counts ("N años", "2015 – Actualidad") keep the document honest over time without any content edit, on both the web and the future PDF.

## Operating Context

- Content source of truth: `data/cv.json` (5 approved rounds, verbatim Spanish text — never rewritten, summarized, or "improved").
- Placeholder markers (`{career_years}`, `{years_in_role}`) are resolved at display time by shared logic (`lib/years.ts`); the current year is computed in the America/Argentina/Tucuman timezone.
- Web and the (future) PDF must share that same year logic so they never show different numbers.
- UI language: neutral Rioplatense Spanish, centralized in `lib/copy.ts` (English keys, Spanish values). All code, identifiers, files, and comments are in English; page `lang` is "es".
- Section order: Experiencia (timeline) → Educación → Informática → Contacto. Only sections with data are shown.
- The old CRA repo at `C:\Users\Jony\Desktop\Curriculum-Vero` is read-only content reference only — never run, install, or copy its look.

## Capabilities and Constraints

- Only sections with data are rendered (no empty sections; courses, certifications, languages, socials do not exist and must not be invented).
- No occupation title anywhere (the degree title lives only in Education); no industry-specific orientation.
- No invented text, claims, numbers, or assets.
- Single `h1` (the name); semantic HTML; good contrast; alt text on the photo.
- Site URL comes from an environment variable (`NEXT_PUBLIC_SITE_URL`), never hardcoded; SEO/Open Graph metadata with the candidate's name and a neutral description.
- Daily revalidation so year counts update without a redeploy.
- The "Descargar CV (PDF)" button points to `/cv.pdf`; the PDF itself is a later task. Download filename convention: `Veronica-Plodzien-CV.pdf` (Spanish, no tildes).
- WhatsApp button is included only because the number resolves with certainty (see Brand Commitments); the decision rule lives in NOTES.md round 6.

## Brand Commitments

- Palette: very soft cream ground (~#FAF7F2), near-black bluish text, deep navy as the primary color, one warm accent (terracotta/peach) used with strong moderation. Tokens live as CSS variables in `globals.css` because the PDF version will reuse them.
- Typography via `next/font`: a characterful serif (Fraunces) for the name and section titles; a readable sans (DM Sans) for body text. Inter is banned.
- Hero: large name (no title), the photo in a soft shape (arch or well-rounded corners), clear action buttons.
- The candidate's approved texts in `data/cv.json` are binding verbatim content.

## Evidence on Hand

- `data/cv.json` — final approved content (name, photo refs, profile, contact, 4 experience entries, 2 education entries, 2 computer skills).
- `public/img-perfil.jpg` (1200×1600 original) and `public/img-perfil-600x800.webp` (600×800, WebP q90) — the only photo assets.
- `NOTES.md` — full decision history (rounds 2–5).
- Phone facts: display `+54 381 501-7189`; `tel:` value `+5493815017189`; WhatsApp value `5493815017189` (= 549 + area code 381 + 5017189, no "15") → wa.me link is certain.
- Absences that must never be fabricated: no favicon asset, no social networks, no courses/certifications/languages, no occupation title, no second photo.

## Product Principles

1. Approved content is inviolable: design may frame it, never rewrite it.
2. Warm but never casual: the register is a trustworthy human being, not a corporate template and not a developer portfolio.
3. Mobile-first legibility: a recruiter on a phone should be able to read the whole CV in under a minute.
4. Restraint: one accent color, quiet motion, content always visible (reduced-motion respected), generous whitespace.
5. Web and PDF always agree: shared year-resolution logic, shared design tokens.

## Accessibility & Inclusion

Semantic HTML with a single `h1`; sufficient contrast (accent color is decorative-scale, never small body text on cream); alt text on the photo; all animations honor `prefers-reduced-motion` with content visible by default.
