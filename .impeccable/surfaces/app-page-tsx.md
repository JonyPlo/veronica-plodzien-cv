---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: []
---

# Surface brief — app/page.tsx (single-page CV)

Scope: the whole public CV page (one route). Visitor mode: Persuade (a recruiter reads, decides, and acts — call, WhatsApp, email, or download the PDF). Audience: any HR recruiter, most often on a phone. Constraints: content only from `data/cv.json` (verbatim approved Spanish), no invented text, no occupation title, only sections with data, single `h1`, `lang="es"`, mobile-first, reduced-motion honored, daily revalidation for year math, UI copy centralized in `lib/copy.ts`.

## Direction contract

- THESIS: The CV as a quiet editorial dossier — the person first (name, face, voice), then the career as one drawn timeline on cream paper. It refuses the dense two-column template and the developer-portfolio look.
- OWN-WORLD: cream paper ground (#FAF7F2), blue-black ink, deep navy as the only strong color, terracotta used only as hairlines and small points; Fraunces for the name and section titles, DM Sans for everything else; an arch-topped portrait; charged whitespace (ma discipline, raised from the ikebana challenger); hierarchy carried by type scale and line breaks, not boxes (raised from the festival-lineup challenger); one reading column.
- STORY: The recruiter sees a real, approachable, neat person in the first viewport, follows a clean chronological career, and leaves confident with three obvious ways to reach her.
- FIRST VIEWPORT: Mobile: the arch photo leads, then the huge Fraunces name (the single h1), a terracotta hairline, a 3–4 line profile, then a stacked button group (Llamar as the one filled navy button; WhatsApp, email, PDF as quiet outlines). Desktop: photo left, name+profile+buttons right. Nothing else — no nav, no badges, no clutter.
- FORM: "Editorial dossier with a drawn timeline"
Seed: 88dbb5dc (direction roll, 2026-10-03, mode persuade). All three dealt
candidates (weather-sun, darkroom, ANSI-BBS) were rejected as incompatible
with the brief's pinned palette/type/audience; pick telemetry recorded. — grounded candidate 1 (brief-pinned; beats roll assignment index 6). Seed key: 88dbb5dc. Signature interaction: the timeline spine draws itself as the page scrolls, items fade up in a stagger, hover is a quiet darkening/lift; all of it disabled (content visible by default) under prefers-reduced-motion.
- FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
