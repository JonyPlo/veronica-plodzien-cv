---
name: "Verónica Plodzien – Currículum Vitae"
description: "A quiet editorial dossier on cream paper: one reading column, an arch-framed face, and a career timeline that draws itself."
colors:
  paper: "#faf7f2"
  ink: "#1b1e26"
  ink-soft: "#525b6b"
  navy: "#1d3557"
  navy-deep: "#14263f"
  terracotta: "#b3502f"
typography:
  display:
    fontFamily: "Fraunces, 'Times New Roman', serif"
    fontSize: "clamp(2.75rem, 7vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Fraunces, 'Times New Roman', serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Fraunces, 'Times New Roman', serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "DM Sans, 'Arial', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, 'Arial', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: "0.025em"
rounded:
  arch-top: "999px"
  arch-bottom: "16px"
  pill: "9999px"
  favicon: "14px"
spacing:
  "0.5": "2px"
  "1": "4px"
  "1.5": "6px"
  "2.5": "10px"
  "3": "12px"
  "3.5": "14px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
  "20": "80px"
  "24": "96px"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.navy-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-secondary-hover:
    backgroundColor: "color-mix(in oklab, #1d3557 5%, transparent)"
    textColor: "{colors.navy}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "10px 12px"
  button-text-hover:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
  section-kicker:
    backgroundColor: "{colors.terracotta}"
    height: "1px"
    width: "32px"
  timeline-dot-current:
    backgroundColor: "{colors.terracotta}"
    rounded: "{rounded.pill}"
    size: "14px"
  timeline-dot-past:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    size: "14px"
  timeline-spine-drawn:
    backgroundColor: "{colors.navy}"
    width: "1px"
---

# Design System: Verónica Plodzien – Currículum Vitae

## Overview

**Creative North Star: "The Editorial Dossier"**

A quiet, warm, editorial dossier on cream paper. The page is one reading column and nothing else: it opens with the person — the portrait in its soft arch, the name in large Fraunces, a short profile, four ways to act — and then tells the career as a single drawn timeline, followed by education, a plain skills list, and contact. There are no cards, no boxes, no second background, and no icon systems; hierarchy is carried by type scale, hairlines, and generous whitespace. It is a document that looks typeset, not built.

The color discipline is the point: one strong color (deep navy) carries the identity, and a single warm accent (terracotta) appears only at the scale of hairlines, dots, and low-alpha tints. Motion is quiet and once-only — a staggered hero entrance, fade-up reveals as sections enter the view, and one authored moment: the timeline spine that draws itself as the story scrolls. Under `prefers-reduced-motion` everything becomes static and fully visible, which is a hard rule of the system, not an afterthought.

**Key Characteristics:**

- One reading column (max-width 42rem) on cream paper; section rhythm 64–96px, 32px between heading and body.
- One framed object on the whole page: the arch portrait, nowhere else.
- Terracotta strictly at decorative scale: 1px hairlines, the 14px "now" dot, low-alpha underline and selection tints, and the keyboard focus ring.
- Terracotta strictly at decorative scale: 1px hairlines, the 14px "now" dot, low-alpha underline and selection tints.
- Flat by default: exactly one soft diffuse shadow and one 1px ring, both under the arch.
- One authored motion (the self-drawing spine); all other motion is once-only fade-up.

## Colors

A warm neutral ground, one strong hue, one decorative accent — the palette of an ink-on-paper editorial.

### Primary

- **Deep Navy** (#1d3557): the page's one strong color. It sets the name, every section heading, the company/institution names, the primary action, the timeline spine that draws, and the browser chrome (theme-color).
- **Navy Deep** (#14263f): the pressed state of the primary action, and the tint (at 45% alpha) of the arch's soft shadow.

### Secondary

- **Terracotta** (#b3502f): the decorative accent. It appears as 1px hairlines (the mark under the name and the mark above each section heading), as the filled "now" dot on the timeline, as the hover tint of contact-link underlines, as the keyboard focus ring (2px outline, 3px offset — 4.9:1 on the cream ground, above the 3:1 non-text minimum), and as the text-selection color at 24% alpha. It never sets body text, buttons, or large fills.

### Neutral

- **Cream Paper** (#faf7f2): the ground — the page background, and the fill of the timeline's "past" dots.
- **Ink** (#1b1e26): primary text (body and entry headings) and the source for every hairline at low alpha: list dividers at 10%, the timeline's quiet guide at 15%, link underlines at 25%, the arch ring at 10%.
- **Ink Soft** (#525b6b): secondary text — periods, descriptions, levels, contact labels, and the small "Abrir WhatsApp" link (6.4:1 on cream, well above AA).
- *Declared but dormant:* `--paper-deep` (#f1ebe1) is defined in the shared token file (the token file is the single source of truth for the web and its future PDF twin) but no element of the shipped web build references it.

### Named Rules

**The One Strong Color Rule.** Navy is the only strong hue on the page. Cream and the two inks carry the document; navy carries identity.

**The Decorative Scale Rule.** Terracotta lives only at the scale of hairline, dot, and low-alpha tint. Its rarity is the point; the moment it fills a surface or typesets text, it stops being an accent.

*Drift note:* the direction contract's first-viewport line said "terracotta only as a hairline and the 'now' dot"; the build additionally paints it on link-hover underlines, text selection (24%), and the keyboard focus ring. All three stay inside the decorative scale, so the recorded rule is the scale, and the contract's narrower list was a description of the first viewport, not a doctrine.

## Typography

**Display Font:** Fraunces (variable, weight 100–900; next/font synthesizes a "Fraunces Fallback" from local Times New Roman)
**Body Font:** DM Sans (variable, weight 100–1000; next/font synthesizes a "DM Sans Fallback" from local Arial)

**Character:** A characterful, slightly condensed old-style serif gives the person a voice; a quiet, wide humanist sans gives the document its trustworthiness. The serif never shouts — it only looks important.

### Hierarchy

- **Display** (600, clamp(2.75rem, 7vw, 3.75rem) — 44 to 60px, 1.04, tracking −0.015em): the name, the single `h1`. Navy. Nowhere else on the page.
- **Headline** (600, 1.875rem → 2.25rem at sm, 1.2 → 1.11): section titles. Navy. Always preceded by the 32px terracotta hairline.
- **Title** (600, 1.25rem → 1.5rem at sm, 1.4 → 1.33): entry headings — positions and degrees. Ink.
- **Body** (400, 1rem / 1.625 at base → 1.125rem / 1.65 at md; company and institution names at 1.0625rem at md; the hero profile fixed at 1.125rem): everything that is not a heading. The profile is capped at 60ch, entry descriptions at 62ch.
- **Label** (500, 1rem at base → 0.9375rem at md, 1.43, tracking +0.025em, tabular-nums): periods, levels, and contact labels. The mobile floor for all reading text is 16px.

### Named Rules

**The Two Voices Rule.** Fraunces is allowed on exactly three roles: the name, the section titles, and the entry headings. Every other character on the page is DM Sans — Inter is banned by the product.

**The Tabular Periods Rule.** Every period and date is set with tabular figures and +0.025em tracking, so the years of the timeline align vertically like a typeset table.

## Layout

The reading sections share one column: max-width 45rem (720px), centered, with 20px gutters that widen to 32px at sm (≥640px / 40rem). The hero is full-width on mobile and caps at 67.5rem (1080px), centered, at lg. The page top breathes 40 → 64 → 80px (base → sm → md; md = 768px / 48rem); sections follow each other at 64px, widening to 96px at sm; each section's body starts 32px below its heading; the page ends with 80px of paper.

The hero is the only two-column surface on the page: on mobile it is a stack (arch photo centered at 176px, 208px at sm), and at md it splits into a photo column and a text column — 17rem + 1fr with a 48px gap, 18rem + 1fr with 64px at lg — vertically centered, the portrait at 272px (288px at lg) on the left and the name/profile/actions on the right (the text column capped at 600px at lg). Everything else — the education entries, the skills name/level rows, the contact label/value rows — stays inside the reading column; their "two columns" are inline baseline rows, not layout grids.

The spacing rhythm rides the 4px grid; the steps the page actually uses: 2, 4, 6, 10, 12, 14, 16, 20, 24, 32, 40, 48, 64, 80, and 96px.

## Elevation & Depth

Flat by default. There are no cards, boxes, or panels on this page, and depth is conveyed by type scale, hairlines, and whitespace. There is exactly one shadow on the entire page, and exactly one ring; both serve the one framed object — the photo arch.

### Shadow Vocabulary

- **Arch ambient** (`box-shadow: 0 18px 40px -22px rgba(20, 38, 63, 0.45)`): the diffuse navy-tinted shadow (Navy Deep at 45%) under the portrait. Large blur, heavy negative spread — it reads as the paper lifting slightly, never as a hard drop.
- **Arch ring** (`box-shadow: 0 0 0 1px color-mix(in oklab, #1b1e26 10%, transparent)`): the 1px ink hairline around the arch that keeps the photo from bleeding into the ground.

### Named Rules

**The One Shadow Rule.** Surfaces are flat and never cast shadows. The only shadow in the system is the one under the arch.

**The One Frame Rule.** The arch is the only framed object on the page (ring + shadow). Everything else — every list, every section, every action — sits unframed on the paper. The favicon no longer echoes it: it is a separate brand mark — the serif "VP" monogram, cream on navy, in a 64px tile with 14px-rounded corners.

## Shapes

The form language is *arch, hairline, pill*. The portrait is cut as a soft arch — top corners at 999px (a full semicircle), bottom corners at 16px — the page's only frame and the world's one motif. Action buttons are full pills (fully rounded). Timeline markers are 14px circles centered on a 1px vertical spine. Everything else is square and unframed: list dividers are 1px hairlines at 10% ink, and section markers are 1px terracotta hairlines — 32px wide above each section heading, 64px under the name.

*Drift note:* PRODUCT.md's evidence list records "no favicon asset" among the absences; the build ships `app/icon.svg` as a serif "VP" monogram (cream on navy, 14px-rounded tile) — a brand mark requested by the owner, deliberately not the arch motif.

## Components

### Buttons — two tiers, two rows

- **Primary (Descargar CV (PDF)):** filled Deep Navy pill, 10px × 20px padding (44px tall), DM Sans at 500, paper (light) text, one inline download glyph (1.75 stroke, round caps). It opens row one of the hero alone and is repeated, unchanged, at the end of the contact section. Hover darkens to Navy Deep.
- **Secondary (Llamar, WhatsApp, Escribir un mail):** 1px border at 30% navy, navy text, the same pill, padding and height as the primary (44px); hover — border to solid navy, 5% navy wash. The three sit on one row in row two of the hero with equal size and equal 12px gap.
- Mobile (below sm): every button is full-width and stacked, the download first. All color changes transition over 200ms.

### Section heading

A 32px × 1px terracotta hairline, 16px of air, then the Fraunces navy headline (3xl → 4xl). The hairline is the entire section marker — no eyebrow text, no number, no icon.

### Timeline entry (signature)

A 14px dot centered on a 1px vertical spine (the spine sits 7px from the column's left edge; text begins 32px in). A quiet guide (ink at 15%) is always present; over it, the navy spine draws itself (scaleY, spring) as the section scrolls — the one authored moment of the page. The current entry's dot is filled terracotta; past dots are paper-filled with a 1px ring at 40% navy. Each entry, top to bottom: period (label), title (Fraunces), company (navy, 500), description (Ink Soft, 62ch, 1.625). Entries are spaced 40px apart, 48px at sm.

### List rows

Education and skills rows sit on 1px hairlines at 10% ink — never on the first row. Education: period → title → institution (navy) → level (label). Skills: a baseline-aligned name/level pair across the column (24px gap), 14px row padding.

### Contact links

Navy text with a 3px-offset underline, the underline at 25% ink; on hover the underline tints to terracotta. Labels sit in a fixed 96px column (16px base / 15px at md, Ink Soft). Teléfono and WhatsApp share one row: the number once (tel:), then the small Ink-Soft "Abrir WhatsApp" link (wa.me). The primary download button closes the section.

### Motion

The hero enters once on load: opacity and 18px rise over 600ms, ease `cubic-bezier(0.16, 1, 0.3, 1)`, 90ms stagger. Section bodies and entries fade up (16px, 550ms) once as they enter the view, staggered 60–80ms. The only scroll-driven animation is the spine's spring-drawn scaleY (scroll progress of the list, offset "start 0.85" → "end 0.5"; spring stiffness 60, damping 25). Under `prefers-reduced-motion` every one of these resolves to its static final state — reveals render visible, the spine ships fully drawn, smooth scrolling is off.

## Do's and Don'ts

### Do:

- **Do** ground every surface in Cream Paper (#faf7f2); the page has no second background.
- **Do** set hierarchy with type scale and whitespace — 32px from heading to body, 64–96px between sections, hairlines between rows.
- **Do** mark every section with the 32px terracotta hairline above its heading, and the 64px one under the name.
- **Do** keep the reading sections in a 720px (45rem) centered column; the hero spans up to 1080px (67.5rem) at lg and is the only two-column surface (from md).
- **Do** type every period, date, and year with tabular figures and +0.025em tracking.
- **Do** divide list rows with 1px hairlines at 10% ink, never on the first row.
- **Do** honor `prefers-reduced-motion` as a hard floor: reveals resolve to a static visible state, the spine is pre-drawn, smooth scrolling is off — content is never hidden by motion.
- **Do** keep terracotta at the scale of marks: 1px hairlines, 14px dots, tints at 24% alpha or below.

### Don't:

- **Don't** add cards, boxes, or panels — no surface is framed except the arch.
- **Don't** add shadows; the arch's diffuse one is the system's only shadow (and its 1px ring the only ring).
- **Don't** let terracotta type, fill, or border anything; its role is mark, not color.
- **Don't** introduce a second accent color, gradients, or decorative icon or glyph systems — the page carries no icon system; the single functional glyph (the download, on the PDF button) is the owner-requested exception.
- **Don't** set small-caps or uppercase eyebrow text above section headings; the hairline is the marker.
- **Don't** set the name anywhere but the single `h1`, or set Fraunces on any text that is not the name, a section title, or an entry heading.
