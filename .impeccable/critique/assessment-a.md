Method: single-agent design review (A) — dual-agent run, sequential

## Visuals status
All three r10-before captures (1440 / 768 / 608-CSS-px, 2×) show the page **with no stylesheet applied at all**: white ground, UA list markers (1.–4., •), italic `<address>` labels, blue underlined links, square-corner photo, "LlamarWhatsAppEscribir un mail" and "Celular+54 381 501-7189WhatsApp" run together, no arch, spine, hairlines, columns, or color. This is **not** a capture artifact: `curl :3100/_next/static/chunks/0bmw60nwchy2a.css → HTTP 500`. The running `next start --port 3100` (PID 1984) predates the 05:36 rebuild (BUILD_ID `8ulPxFoLsvMZtBrnvFU7A`): it serves a stale `index.html` referencing the deleted CSS hash, while the on-disk build's `index.html` references `0f3t0ly0edyl8.css`, which exists. **The design is currently absent for every visitor; the captures document a broken deploy, not the design** (mobile capture is 608 CSS px wide, not 390×2). The intended design was verified styled in the round 8/9 captures; my judgments below are based on the source code + DESIGN.md, with the deploy failure reported as P0-1.

## Specificity verdict
**Specific, not interchangeable — bluntly: this is a dossier, not a theme.** The composition is grounded in the product's actual subject: the arch portrait is the only framed object and the largest visual element (a person, not a logo); the self-drawing navy spine with the terracotta "now" dot turns four jobs into one career arc (current first, "11 años", kept honest by the shared year math); a single 720px reading column of flat hairlines reads as "typeset document," directly serving the "not built by a programmer" product principle. The only genuinely generic layer is the section chrome (32px hairline + Fraunces heading) — a pattern common across the editorial-minimal category — but it is subordinated to the arch + spine + face, which no other category (SaaS, store, portfolio) can reuse without looking wrong. Residual risk: remove the face and the page degrades into a stock "editorial" template — the face carries the identity.

## Heuristics
Scores evaluate the intended (styled) design; shipped-state failures are folded in where a visitor meets them.
| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of system status | 2 | Shipped :3100 500s on its only CSS (unstyled document); the primary CTA lands on a raw 501; even when styled, the LCP photo is lazy with no placeholder |
| 2 | Match between system & real world | 3 | Content is 100% real-world (face, Spanish, local phone, "Actualidad"); the 501 text page and the unstyled 500 state break that match |
| 3 | User control & freedom | 3 | No traps, modals, or forms; but the 501 page has no link back — the only escape is the browser Back button |
| 4 | Consistency & standards | 3 | Intended page is exemplary (one column, one accent scale, shared button, shared contact-row skeleton); the shipped state is its opposite (UA defaults: list markers, italic address, blue links, run-together rows) |
| 5 | Error prevention | 2 | The primary CTA is a dead end until the PDF lands; nothing on the page prevents it — only after-the-fact honesty |
| 6 | Recognition rather than recall | 4 | Everything needed is on one visible page; the phone number is readable text, not only a button |
| 7 | Flexibility of use | 3 | Four genuine action channels (call/WhatsApp/mail/PDF); keyboard order = reading order; no accelerators needed for a document |
| 8 | Aesthetic & minimalist design | 4 | Nothing irrelevant: no cards, one shadow, one decorative-accent scale; hierarchy via type + whitespace — genuinely excellent restraint |
| 9 | Recognize, diagnose, recover from errors | 2 | The 501 is honest and in-voice ("Volvé en unos días") but raw text/plain with no structure, no design, no return path; the 500-CSS state has no error UX at all |
| 10 | Help & documentation | 3 | The page is self-explanatory as a document; the one non-self-explanatory state (501) gives no guidance on when the PDF arrives or how to come back |
| | **Total (10/10 applicable — no n/a)** | **29/40** | |

## Cognitive load
0 of 8 failed (intended design): single focus (evaluate her + reach out) ✓; chunking ≤4 everywhere (hero 1+3, timeline 4, education 2, skills 2, contact 3) ✓; grouping via hairline + heading + row skeleton ✓; clear hierarchy name→profile→actions→timeline→contact ✓; one thing at a time (one column, linear read) ✓; decisions ≤4 per point (hero sits exactly at the ceiling: 1 primary + 3 equal secondaries — differentiated, acceptable) ✓; no working-memory recall (numbers/names in place) ✓; disclosure appropriate for a CV (nothing hidden; progressive disclosure would hurt) ✓.

## Emotional journey
- **Peak:** the arch portrait + name (immediate warmth; face as the largest object), and — the story's real peak — the lactario entry ("preparar fórmulas de leche… de cada bebé"): the most human, distinctive moment. Credibility peak = the current job's "11 años" + "Actualidad" with the filled terracotta dot.
- **End (intended):** the Contacto close — warm, three channels, number visible; a good end if the user calls/emails/WhatsApps.
- **End (shipped):** the page's final element is the repeated "Descargar CV (PDF)" — clicking it (or arriving on :3100) lands on a raw 501 text page / an unstyled document. **Peak-end currently works against the page: its only broken surface is its final moment.**
- **Valleys:** the blank first paint on slow connections (opacity:0 SSR + lazy LCP); the Informática deflation (two "Nivel intermedio" rows) right before the close (approved content, fixed order — report only); the unstyled state reads as "abandoned/broken" — the exact opposite of the "prolijidad" promise.

## Strengths
1. **The arch portrait as the only framed object** (`hero.tsx`: `rounded-t-[999px]` + the page's single shadow + 1px ring) — a person, not an employee card; the face leads the hierarchy, the right trust order for a career-changer's dossier.
2. **The self-drawing timeline spine with the terracotta "now" dot** (`experience-section.tsx`) — turns a job list into a narrative arc that literally draws as you read; tabular-nums periods align like a typeset table; "current first + Actualidad + 11 años" makes the story legible at a glance. The page's signature, and specific to a CV.
3. **Bookend consistency** (`download-button.tsx` + contact row skeleton): the identical navy pill opens and closes the page; the three contact rows share one structure (label column / value / number once) — exemplary restraint that makes the document look typeset, serving the "not built by a programmer" principle.

## Priority issues
1. **P0 — The shipped page is unstyled: HTTP 500 on the sole CSS chunk (stale server vs. rebuilt `.next`).**
   What: `next start --port 3100` (PID 1984) predates the 05:36 rebuild; it serves a stale `index.html` referencing `0bmw60nwchy2a.css`, which no longer exists on disk (the on-disk build references `0f3t0ly0edyl8.css`, which does) → 500 → the unstyled document seen in all three r10-before captures.
   Why: the design literally does not exist for any visitor right now; the UA-default fallback (list markers, blue links, run-together rows, square photo) is the worst possible first impression for a product whose entire promise is "confianza, calidez, prolijidad."
   Fix: restart the server so it serves the current `.next` (the on-disk build is hash-consistent; re-verify with one styled capture plus a CSS-200 check). Operationally: rebuild-and-restart atomically, and gate every before/after capture on the stylesheet returning 200. (Report only — restarting the server is out of my mandate.)
2. **P0 — Both "Descargar CV (PDF)" instances navigate to a raw HTTP 501 text page** (`app/cv.pdf/route.ts`: 81 bytes of text/plain; verified live on :3100).
   Why: the page's strongest action (and its final element; on mobile the first full-width tap target) is a dead end on an off-system surface — the biggest trust gap, landing exactly at the end of the read.
   Fix (the button's presence/hierarchy is OFF-LIMITS, owner-approved; the *response* is not on that list): serve the placeholder as a minimal HTML page on the cream ground using existing tokens and the already-approved `copy.pdfPlaceholder` string, with one link back to the CV. No new colors, effects, or content — consistency/readability only.
3. **P1 — The no-JS / first-paint view hides the entire page.** SSR HTML ships every motion element with inline `opacity:0; transform:translateY(16–18px)` (hero photo, h1, profile, all four hero buttons, every section heading and body; spine at `scaleY(0)`) — only JS hydration reveals them (confirmed in the :3100 SSR output).
   Why: a *document* that is invisible without JS violates the system's own "content is never hidden by motion" rule for no-JS users, crawlers, printing, and slow-connection first paint (blank cream viewport before the face appears).
   Fix (already sketched in NOTES round 8, item 8(b)): render the visible state in SSR and arm the hidden initial values only client-side (useLayoutEffect). Zero visual change for JS users; also fixes printing.
4. **P1 — The hero photo (the LCP) is lazy-loaded.** `hero.tsx` `<Image>` defaults to `loading="lazy"` (visible in the SSR HTML); Next's own dev tool flagged it ("detected as the Largest Contentful Paint… add `loading=\"eager\"`").
   Why: on Casey's slow connection the face — the emotional anchor — is the last thing to arrive.
   Fix: `priority`/`fetchPriority="high"` on that one image. Performance fix, zero visual change.
5. **P1 — "Llamar" and "WhatsApp" have ambiguous accessible names; approved a11y strings are dead.** The `hero.tsx` links and the contact pill expose only "Llamar" / "WhatsApp"; `lib/copy.ts` defines `callA11y` ("Llamar al teléfono") and `whatsappA11y` ("Chatear por WhatsApp") but nothing references them; `target="_blank"` on wa.me is never announced.
   Why: a screen-reader user cannot tell whom to call or that a tab opens; the hero "Llamar" is indistinguishable from the contact number link (which correctly uses the number as its name — the pattern to copy).
   Fix: wire `aria-label` from the existing keys on the three hero links + the contact pill, and add a new-tab cue to the WhatsApp names. A11y only, no visual change (contact-row structure stays OFF-LIMITS; an aria-label is not a structural change).

## Persona red flags
**Jordan (recruiter, first-time visitor)**
- As shipped on :3100: a naked white document — numbered lists, blue underlined links, square photo, "LlamarWhatsAppEscribir un mail" jammed together, "Celular+54 381 501-7189WhatsApp" — reads as broken/abandoned before a word is read.
- Taps "Descargar CV (PDF)" (row 1, full-width on mobile) → raw 501 text page with no link back; forced to press Back at the moment of commitment.
- The weakest beat (Informática: two "Nivel intermedio" rows) lands right before the close — a mild deflation at the end (approved content, fixed section order — report only).
- The phone number is only visible at the bottom of the page; the hero offers a "Llamar" pill with the number hidden until Contacto.
**Sam (screen reader + keyboard-only, low vision)**
- Accessible names "Llamar" / "WhatsApp" carry no number and no destination cue; `callA11y`/`whatsappA11y` prepared but never wired; two indistinguishable "Llamar" targets (hero vs. the contact number link, which is correctly named).
- WhatsApp `target="_blank"` opens without announcement.
- If the 501 is reached: raw text page with no heading structure and no link back — a dead end for SR (and everyone).
- Low-vision floors: 13px mobile contact labels and 14px WhatsApp-pill text are the smallest on the page (AA-passing 6.4:1; font sizes OFF-LIMITS — report only).
- Positives: the terracotta 2px/3px-offset focus ring (4.9:1 on cream) is genuinely visible; h1→h2→h3 is clean; spine/dots are correctly `aria-hidden`; tab order = reading order; everything stays keyboard-operable even in the unstyled state.
**Casey (one-handed mobile, interrupted, slow connection)**
- Slow connection: the first viewport stays blank cream for seconds — SSR `opacity:0` content + lazy LCP photo + two woff2 preloads must all arrive before face/name appear; on a bad network the first thing seen is nothing.
- The contact "WhatsApp" pill is a 36px × 14px target immediately beside the number link — a small, mis-tap-prone zone at the moment of action (contact structure OFF-LIMITS — report only). The hero's 44px full-width buttons are well-built for a thumb.
- Interruption-safe: stateless page, scroll preserved after tel:/wa.me round-trips, refresh restores everything — a real strength.
- No back-to-top affordance on a ~3500px mobile page (minor).

## Minor observations
- `og:image` / `twitter:image` = `http://localhost:3000/...` in this build (`NEXT_PUBLIC_SITE_URL` unset; documented NOTES round 7 — set at deploy time, or social cards will 404).
- Dead class `first:pt-0` on the `index > 0` branch in `education-section.tsx` can never match (harmless code smell); trailing space in the `index === 0` className in `skills-section.tsx`.
- The `:focus-visible` ring inherits the pills' 200ms `transition-colors` (NOTES round 8, item 4(b)) — the focus indicator fades in instead of appearing instantly (WCAG 2.4.11 asks for immediate).
- DESIGN.md lists the "Terracotta strictly at decorative scale…" bullet twice in Key Characteristics.
- The favicon monogram uses a Times/Georgia stack, not Fraunces — a slight family mismatch with the page's display voice (favicon is exempt from the Two Voices rule per DESIGN.md).
- No print stylesheet: printing inherits the inline `opacity:0` — resolved automatically by the P1 no-JS-visible fix.
- dev.log: Next's dev tool already flags the hero image as LCP with `loading="lazy"` (corroborates issue 4); the reduced-motion hydration attribute diff (NOTES 8(b)) is dev-only and harmless in production.
