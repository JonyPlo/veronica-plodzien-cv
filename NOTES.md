# NOTES — CV extraction and adjustments

Source repo: `C:\Users\Jony\Desktop\Curriculum-Vero` (CRA). Target: `C:\Users\Jony\Desktop\curriculum-vero-nuevo`.
Rounds 3–5: corrections and adjustments approved by the CV owner.
From round 5 on, this file is written in English; the visible CV text values (in `data/cv.json`) stay in Spanish, unmodified.

## Round 12 — pre-publish review + deploy prep (2026-10-03)

Owner request, run before deploying: (1) production build + a **mobile Lighthouse** audit, fixing anything that scores below 90 *without changing the design*; (2) hunt for CV text hardcoded outside `data/cv.json` / `lib/copy.ts`; (3) verify `public/cv.pdf` carries exactly the same text as the web, including the dynamic years; (4) confirm the remaining publish items (noindex, the OG env-var name, title/favicon, download filename); (5) record findings, pending items and the Vercel steps here. Verified against the production build served on a free port **3100** (`pnpm start` — never the dev server). No-vision session (`PI_PROVIDER` without image support), so every check is text/HTTP/DOM-based (Playwright assertions), not screenshots.

1. **Lighthouse (mobile) — all categories ≥ 90, nothing to fix.** Lighthouse 13.5.0, headless Playwright Chromium, `formFactor: mobile` (412×823), on `http://localhost:3100/`. No run warnings.
   - **Performance 95** — FCP 0.8 s, LCP 2.8 s (individual audit 82), TBT 90 ms, CLS 0, Speed Index 0.8 s, TTI 2.8 s.
   - **Accessibility 98**, **Best Practices 100**, **SEO 100**, **Agentic Browsing 100**.
   - The only sub-90 *individual* audit is **LCP (82)**: the hero portrait is already `loading="eager" fetchPriority="high"` and a 98 KB WebP, so there is no non-design way to make it faster — left as-is (honoring "without changing the design"). The other sub-90 entries are experimental *insights* (unused/legacy JS, render-blocking, image-delivery) that do not count toward the category scores. Raw JSON kept locally at `.impeccable/lh-mobile.json` (git-ignored).
2. **Hardcoded-text audit.** Grepped `app/`, `components/`, `lib/` for CV values (name, phone, email, companies, degrees, skills, location). All displayed text flows from `data/cv.json` (content) + `lib/copy.ts` (UI chrome) — no stray literals. **One leak found and fixed**: the doc comment in `lib/cv.ts` used the *real* phone number as its format example (`+54 381 501-7189` / `+5493815017189` / `5493815017189`); replaced with generic patterns (`+54 XXX XXX-XXXX` / `+54XXXXXXXXXXX` / `XXXXXXXXXXX`) so the number now lives only in the JSON.
3. **PDF ⇄ web content parity.** New dev script **`scripts/verify-pdf-content.ts`** (`node scripts/verify-pdf-content.ts [web-base-url]`, default `:3100`). It reuses the app's own `lib/cv.ts` + `lib/years.ts` (so markers resolve exactly as in production), extracts the PDF text layer with MuPDF (`page.toStructuredText({}).asText()`), and fetches the live web page, normalising whitespace on both. **35/35 fields present and identical in the PDF and the web** (name, profile, contact phone/email/location, all 4 experience entries' company/position/description/period, both education rows, all Informática rows) and the **dynamic years match: 17 años (2026−2009) and 11 años (2026−2015)**. The only string in the PDF but not on the web is the intentional flat contact header line (phone · email · location joined by `·`); each of its values matches the web individually. (The script prints a harmless Windows libuv `UV_HANDLE_CLOSING` assertion *after* the pass/fail line at shutdown — ignore it; the exit code is not the verdict, the printed `RESULT` line is.)
   - Enabling that script required **`"allowImportingTsExtensions": true`** in `tsconfig.json` (Node type-stripping imports `../lib/*.ts` by explicit extension; the flag is legal because `noEmit` is already set). Production build + type-check still pass with it.
   - `.gitignore` now also ignores **`.impeccable/lh-*`** (Lighthouse JSON/logs/Chrome profile — local audit artifacts; the committed `review/` and `critique/` snapshots are untouched).
4. **Publish checks** (production server on :3100):
   - `/` — 200; **zero console/page errors**; no horizontal overflow at 390/768/1440; tab title `Verónica Plodzien · Currículum vitae`; favicon link `/icon.svg`.
   - OG/Twitter meta all present; `og:image`/`og:url`/`twitter:url` resolve through `metadataBase` (currently `http://localhost:3000` because **`NEXT_PUBLIC_SITE_URL` is unset** — see pending below).
   - Both download buttons (hero + contact): `href="/cv.pdf"`, `download="Veronica-Plodzien-CV.pdf"`; the file actually served at `/cv.pdf` is **byte-identical to the committed `public/cv.pdf`** (same size and same SHA-256).
   - `/pdf` — 200 with `meta[name=robots] = noindex, nofollow`; `robots.txt` carries `Disallow: /pdf` (the second net, alongside the noindex meta).
5. **Pending (the only real one)** — **set `NEXT_PUBLIC_SITE_URL` to the real domain on Vercel.** It is a `NEXT_PUBLIC_*` variable, so it is **inlined at build time**: add it in the Vercel project's Environment Variables *before* the build, not just at runtime — otherwise `metadataBase` falls back to `http://localhost:3000` and the absolute og:url / og:image / twitter:url URLs are wrong (`.env.example` already documents it). No code change needed. Nothing else blocks publish. Known report-only carry-overs (deliberately unchanged, by design): the three contact-section links sit under 44 px tap targets on mobile and keep a 200 ms `transition-colors` focus fade (owner-protected Contact section, round 10); the reduced-motion hydration attribute-diff is dev-only (round 8).
6. **Deploy to Vercel (steps):**
   1. Push the repo to GitHub (if it has no remote yet): `git remote add origin <url>` then `git push -u origin main`.
   2. On vercel.com → **Add New → Project** → import that GitHub repo. Vercel auto-detects the **Next.js** framework and reads `packageManager` (pnpm) from the `packageManager` field.
   3. In **Settings → Environment Variables**, add **`NEXT_PUBLIC_SITE_URL`** = the final URL (for Production + Preview + Development), e.g. `https://<project>.vercel.app`. Save **before the first Production deploy** (it is read at build time).
   4. **Deploy**. After it finishes, note the actual domain; if you later attach a custom domain that differs, update `NEXT_PUBLIC_SITE_URL` to it and redeploy so the OG URLs stay correct.
   5. (Optional) **Settings → Domains** → add a custom domain and the DNS records Vercel prints.
   6. Confirm the PDF workflow: `.github/workflows/regenerate-pdf.yml` runs on the 1st of each month (06:00) and on demand; it needs Contents = "Read and write" in the repo's Actions token permissions (its header comment explains why). Once the domain is settled, the monthly run regenerates `public/cv.pdf` with that month's dynamic years.

## Round 11b — PDF to one page (two-column bottom, print gray) (2026-10-03)

Owner request (scope: the PDF layout only — content, palette, and font sizes untouched): fit the PDF on **exactly one A4 page**: (1) "Educación" and "Informática" side by side below Experiencia (left ~60% / right ~40%), keeping the HTML order Experiencia → Educación → Informática for a correct reading order; (2) tighten the vertical rhythm as much as needed — descriptions ≥ 10pt, dates/labels ≥ 9pt; (3) the sheet margins may shrink, never below 14mm; (4) darken the gray used for descriptions and dates to at least 7:1 contrast on white so it prints crisply (titles and accent untouched); (5) regenerate, convert to image, verify exactly one page with no bad breaks or cramped text, and show the screenshot.

Changes (all in `app/pdf/` — the web page is untouched):
1. **Bottom block** (`page.tsx` + `pdf.css`): the Educación and Informática sections are wrapped in a `.pdf-bottom` grid — `grid-template-columns: 3fr 2fr` (≈60/40) with a 20 px column gap. DOM order stays Experiencia → Educación → Informática, and Chromium lays out the left column before the right, so the PDF reading order is unchanged (verified by text extraction, not assumed). The inner sections drop their own top margin — the grid carries the gap.
2. **Vertical rhythm** (`pdf.css`): section gap 24 → 16 px; heading → first entry 12 → 8 px; hairline → heading 8 → 6 px; entry gap 14 → 10 px; description top margin 5 → 3 px; period/h3/company margins 2 → 1 px; education row padding 9 → 6 px; skills row padding 7 → 5 px; profile margin 16 → 10 px. Line heights: description 1.5 → 1.4, body/company/institution 1.5 → 1.35, period 1.5 → 1.3, level/skills 1.45 → 1.35, heading 1.25 → 1.2. **Font sizes are untouched** — descriptions 10.5pt (above the 10pt floor), periods 9pt (on the 9pt floor), levels 9.5pt; only spacing moved.
3. **Sheet margins** 15 → **14 mm** (`@page` + the on-screen sheet padding) — the owner's floor. The wider content column also removed one line wrap.
4. **Print gray** (`pdf.css`): sheet-local token `--ink-soft-print: #444c59` (8.67:1 on white) replaces the web's ink-soft `#525b6b` (6.85:1 on white — fine on cream, too light to print) for descriptions, periods, levels and the contact line. Navy titles and terracotta marks are unchanged; the web page still uses its original tone.

Verified: regenerated `public/cv.pdf` = **exactly 1 page** (163 kB); MuPDF text extraction confirms the reading order (Experiencia → Educación → Informática, no interleaving) and all content strings (years 17/11 included); visual review of the 110 dpi PNG — no bad breaks, no cramped text, ~8 mm of slack left at the bottom of the sheet (a buffer against Chromium metric drift when the GitHub workflow regenerates it). Evidence: `.impeccable/review/r11b-pdf-page1.png`.

## Round 11 — real PDF: `/pdf` page + `public/cv.pdf` + download fix + CI (2026-10-03)

Owner request (full brief): the download button must deliver a real, selectable-text A4 PDF generated from the live content; no more 501; the PDF has no background color (white sheet) but keeps the site's typography and colors (navy text, terracotta for thin hairlines and small details); a flat contact line (phone + email + location as visible text) in the header with the profile right below; section order identical to the web; at most 2 pages; no buttons or icons inside the PDF; a `download` attribute with a clean name (no tildes: `Veronica-Plodzien-CV.pdf`); the page must not be indexed; a GitHub Actions workflow (cron 06:00 on the 1st of every month + manual) that regenerates and commits the PDF; verify via PNG conversion and check for bad page breaks.

1. **`/pdf` is a page** (`app/pdf/page.tsx`, server component, `revalidate = 86400`), not a route handler: it inherits the root layout and therefore `next/font` (self-hosted Fraunces + DM Sans) — the 501 placeholder was a route handler and could not use `next/font` (why it fell back to system stacks). The PDF is now generated from the same self-hosted fonts as the web.
2. **The 501 route was removed** (`app/cv.pdf/route.ts` deleted — a route handler would have shadowed the public file). `public/cv.pdf` is now served directly at `/cv.pdf` by Next's static file serving.
3. **White sheet on purpose**: `@media print { body { background-color: #fff } }` + the sheet's on-screen frame (background/border/shadow/padding) dissolved in print, so `@page { size: A4; margin: 15mm }` is the single source of truth for size and margins (Playwright `preferCSSPageSize: true`, `printBackground: true`). On screen, `/pdf` shows the white sheet over a `--paper-deep` ground. The tokens still drive everything else: ink/navy text, terracotta hairlines, `--ink` at 10% for dividers.
4. **Typography explicit in pt** in `app/pdf/pdf.css` (Tailwind v4's preflight removed the browser defaults, so nothing is inherited): name 24pt Fraunces navy, section titles 14pt, item titles 11.5pt, body 10.5pt DM Sans, periods/levels 9pt tabular, 15px/1.45 body leading, 24px between sections, 14px between entries.
5. **Contact in the header**: phone as `+54 381 501-7189` (display value, no link — the web's `copy.contact.phoneDisplay`), email, “city, province, country”, separated by “·”. The phone string in `data/cv.json` already was the display format (checked against the `tel:` / `wa.me` numbers).
6. **Page-break discipline**: entries are `break-inside: avoid`; each section's hairline + heading live in `.pdf-section-head` (`break-inside: avoid` + `break-after: avoid`) so a hairline can never be stranded at the bottom of a page — the first generation had exactly that defect (the Educación hairline orphaned on page 1), found via the PNG review and fixed.
7. **`scripts/generate-pdf.ts`** (`pnpm generate:pdf`): production `pnpm build` → `pnpm start -p <free port>` (never the dev server) → polls until `/pdf` answers 200 → Playwright Chromium `page.pdf({ path: public/cv.pdf, printBackground: true, preferCSSPageSize: true })` after `document.fonts.ready` + images complete → kills the process tree (taskkill on Windows, SIGTERM to the group on Unix). Fails loudly if the PDF is missing/empty. Node ≥ 22 runs it natively (type stripping) — no tsx needed.
8. **`scripts/pdf-pages-to-png.ts`**: MuPDF renders each PDF page to PNG (ad-hoc CLI: `node scripts/pdf-pages-to-png.ts public/cv.pdf <dir> [dpi]`) for visual review. `sharp` was tried first and dropped: its Windows prebuild does not bundle poppler, so it cannot read PDFs; MuPDF's prebuild works and is the dependency for this task (`sharp` removed from devDependencies).
9. **GitHub Actions** (`.github/workflows/regenerate-pdf.yml`, “Regenerate PDF”): cron `0 6 1 1 *` + `workflow_dispatch`; workflow-level `permissions: { contents: write }` (the GITHUB_TOKEN is read-only by default — if the repo's Settings → Actions → Token permissions is “Read only”, that override wins and the push is rejected; set Contents to “Read and write” there, or keep the repo default “Token has read and write access”); pnpm/action-setup reads the `packageManager` field (pnpm 11.23.0); Node 24; `pnpm install --frozen-lockfile`; `pnpm exec playwright install --with-deps chromium`; `pnpm generate:pdf`; then commit + push `public/cv.pdf` only when the bytes changed, only on `main`, as github-actions[bot]. The three actions are pinned to their v4 SHAs (verified 2026-10-03).
10. **Verification** (fresh production build, production server on port 3100, Playwright from the shared install): `/cv.pdf` → 200 `application/pdf`, byte-identical to the committed file; `/pdf` → 200 with `<meta name="robots" content="noindex, nofollow">`; `robots.txt` carries `Disallow: /pdf` (second net, in addition to the noindex meta — the brief asked for the page not to be indexed, both signals together are the belt-and-braces version); hero button click downloads with `suggestedFilename = Veronica-Plodzien-CV.pdf`, byte-identical to the committed file; 0 console/page errors on `/` and `/pdf`. MuPDF text extraction: 2 A4 pages with a real selectable text layer (1774 + 299 chars), reading order name → contact → profile → experiencia → educación → informática; dynamic years verified inside the PDF (“17 años” profile, “11 años” café). Captures: `.impeccable/review/r11-pdf-page1.png`, `r11-pdf-page2.png`.
11. **Copy keys**: `pdfPlaceholder.*` removed (the 501 is gone); added `page.titlePdf(name)` (“Currículum vitae — {name}”) and `pdf.fileName` (used in the download attribute of both `DownloadCvButton`s).

## Round 10b — Informática rows (owner's pinpoint adjustment)

Owner request, scope-limited to the Informática section only:
1. **Row padding 0.75rem** (`components/skills-section.tsx`): each row got `py-3` (12px top and bottom), so the 1px `border-ink/10` separator sits centered with air on both sides; the same line now also closes the block (a `border-b` on the last row, identical to the separator).
2. **Sizes**: tool name `text-base md:text-[1.0625rem]` (16px mobile floor → **17px** desktop); "Nivel intermedio" already `text-base md:text-[0.9375rem]` (16 → **15px**), unchanged. Contrast re-verified in the browser: name 15.59:1, level 6.41:1 on the paper ground (both ≥ 4.5:1).
3. **Root cause of the "rows too close" look**: the previous `py-3.5` had **never been compiled** — Tailwind v4's scanner misses class names directly glued to a `${` interpolation in a template literal (the candidate token becomes `py-3.5${…`), so the rows rendered with 0 padding silently. Fixed by building the className from clean string concatenation of quoted literals (every token now scannable); the built CSS now contains `.py-3{padding-block:calc(var(--spacing) * 3)}`. **Gotcha to remember: never glue a class token to `${` in Tailwind v4.**
4. **Verified**: clean production build; production server on :3100 (owner's servers untouched); measured on the live page — 12px/12px row padding at both 1440 and 390, 17/15px (desktop) and 16/16px (mobile) sizes, separator 1px + closing 1px line both `ink/10`, 0 overflow, 0 console errors. Captures: `.impeccable/review/r10b-informatica-desktop.png`, `r10b-informatica-mobile.png`.

## Round 10 changes — critique + polish pass (hierarchy, readability, consistency)

Owner request: run the impeccable skill — **critique first, then polish** — applying only changes that improve hierarchy, readability, or consistency. No new effects or animations. Off-limits (report-only, never touched): the hero's button hierarchy and photo/text alignment, the Contact section, and all font sizes.

**Critique** (dual assessment, per the skill; the project's one-subagent rule overrode the skill's parallel requirement, so A and B ran sequentially as isolated subagents — neither saw the other's output):
- **A — design review** (`.impeccable/critique/assessment-a.md`): 29/40 heuristics, 0/8 cognitive-load deductions, specificity verdict "specific and opinionated", 3 strengths, 5 priority issues: P0-1 no deploy artifact, P0-2 the 501 dead end, P1-3 no-JS blank page, P1-4 lazy-loaded LCP image, P1-5 missing accessible names.
- **B — detector + browser evidence**: 0 console errors, 0 overflow at 390/768/1440, clean heading order, 6/6 contrast pairs pass, focus ring 8/8, reduced-motion all visible, no-JS = 16 elements stuck at `opacity:0` (the blank-page gap); the 9 `design-system-font-size` findings were false positives (responsive steps documented in prose but missing from the YAML ramp).

**Applied (polish):**
1. **No-JS floor** (`app/layout.tsx`): a `<noscript>` at the top of `<body>` with a static CSS constant forcing every animation-hidden element (`opacity:0`, the spine's `scaleY(0)`) into its final visible state. Browsers activate it only when scripting is disabled (inert for JS users, and it also fixes no-JS printing). Rejected alternatives: the `.no-js` class toggle (React 19 hydration recovery reverts pre-hydration class changes) and a manual `<head>` (forbidden in the App Router root layout). React serializes `<noscript>` children as text, so the raw `<style>` requires `dangerouslySetInnerHTML` on a module-level constant (no user input — the one remaining pi-lens flag is that name-based false positive, documented in-file).
2. **`/cv.pdf` becomes a real page** (`app/cv.pdf/route.ts`): the 501 still stands (the PDF is genuinely not built), but the body is now an on-brand minimal HTML document instead of raw text — inline CSS mirroring the design tokens (paper/ink/ink-soft/navy/terracotta), `noindex`, the site title, the approved placeholder line verbatim, and one outlined back-link. System font stacks (Georgia serif + platform sans) per the new **Standalone Surfaces Rule** in DESIGN.md — `next/font` cannot reach a standalone route (same exemption as the favicon). New copy key `pdfPlaceholderBack`: "Volver al currículum".
3. **Hero LCP** (`components/hero.tsx`): the portrait now loads `loading="eager"` + `fetchPriority="high"` (the Next 16 pattern — `priority` is deprecated in this version). SSR-verified on the `<img>`.
4. **Hero accessible names** (`components/hero.tsx`): `tel:` link gets `aria-label="Llamar al teléfono"` (the visible text hides the number); the `wa.me` link gets `aria-label="Chatear por WhatsApp (se abre en una nueva pestaña)"` — new copy key `whatsappNewTabCue` — and `rel="noopener noreferrer"` (noreferrer alone is the documented anti-pattern). The mailto link keeps its visible text as its name. No visible text changed; two new a11y strings disclosed here.
5. **Instant focus ring** (`components/hero.tsx`, `components/download-button.tsx`): the hero trio + shared download button now transition `background-color, border-color, color` instead of the whole `transition-colors` group, so `outline-color` is never in a 200ms fade — the terracotta ring appears immediately (WCAG 2.4.11). Measured at 100ms post-Tab: final 2px / 3px-offset terracotta. The contact section's value links deliberately keep `transition-colors` (off-limits area — reported, not changed).
6. **Class hygiene**: `education-section.tsx` lost a dead `first:pt-0`; `skills-section.tsx`'s template literal no longer emits a trailing space when no border applies.
7. **Owner edits adopted as the round's baseline** (made during the round, kept as-is): the hero trio is now plain `<a>` sharing the primary pill's sizing (no per-pill stagger) instead of three `motion.a`; the download button is full-width on mobile (`w-full sm:w-auto`).
8. **DESIGN.md synced**: YAML ramp gained the four responsive steps actually used in code (body-md 1.125rem, company-md 1.0625rem, label-md 0.9375rem, label-mobile 0.8125rem) and the standalone-serif/standalone-sans stacks; the stale `label: 0.875rem` was corrected to 1rem (matches the prose); duplicated Terracotta bullet removed; new **Standalone Surfaces Rule**; Motion section gained the no-JS floor paragraph and the transition-scope note; Layout notes the LCP loading pattern. **Detector after the update: 0 anti-patterns, 0 advisories.**
9. **`app/layout.tsx` metadata**: `resolveMetadataBase`'s local origin moved to a module-level `constantUrl()` guard (build-time constant, loud failure on a malformed literal) — resolves the pi-lens "unguarded throwing call" flag.
10. **Verified** (fresh production build, zero warnings; production server on :3100 — the owner's dev server was never touched): no-JS (JS disabled) full document visible — 0 hidden elements, spine at final state, mobile capture; JS desktop — 0 console errors, 0 overflow, every section renders (gotcha: `whileInView` reveals only arm on real scrolling — the first fullPage capture at scroll 0 showed blank sections, a capture-method artifact, fixed by scrolling before capture); 501 page — status 501, `text/html; charset=utf-8`, `noindex`, token colors, 66px back-link target; SSR HTML carries the `noscript`, `loading="eager"`/`fetchpriority="high"`, both `aria-label`s, and `noopener`; reduced motion — 0 hidden elements, 0 errors. Captures: `.impeccable/review/r10-nojs-mobile.png`, `r10-after-desktop.png`, `r10-501-page.png`, `r10-reduced-motion.png`, `r10-focus-100ms.png`.
11. **Report-only (off-limits, for a future round)**: three contact-section links have tap targets under 44px on mobile (the 36px WhatsApp pill, the tel value, the mailto value); the contact value links' 200ms `transition-colors` makes the focus ring fade (they sit inside the owner-protected Contact section); the dev-only reduced-motion hydration attribute-diff (known since round 8; production logs nothing) — follow-up candidate remains "visible first paint + `useLayoutEffect` arming".
12. **Critique snapshot**: full report stored via `impeccable critique-storage` (slug `app-page-tsx`); A's assessment at `.impeccable/critique/assessment-a.md`, B's evidence inline in the subagent output.

## Round 9 changes — contact rows and mobile hero photo (owner's final adjustments)

Requested by the owner; **only the contact section and the mobile hero photo** — nothing else in the design.

1. **Contact: three rows, one shared structure** (`components/contact-section.tsx`): the round-8 merged “Teléfono / WhatsApp” row (a two-line label + a text-link “Abrir WhatsApp”) is replaced by three consistently-built rows — **Celular / Email / Ubicación** — sharing a single skeleton: on mobile the label sits above its value (13px, Ink Soft), from `sm` up the label takes a fixed 96px column (none of the three labels wraps) and the value sits to its right. This removes the previous mobile inconsistency (phone label wrapped to two lines, Email rendered as a two-column row, Ubicación stacked — all by accident of `flex-wrap`).
2. **Celular row**: the number appears once (`tel:` link) plus a small outlined **“WhatsApp” pill** (`wa.me`; new copy key `whatsappButton`) — 36px minimum height (`min-h-9`), 14px navy text, 1px border at 30% navy, the secondary pills' hover language. Desktop: beside the number, center-aligned; mobile: below the number, left-aligned. Copy keys `phoneWhatsappLabel` / `whatsappOpen` removed; `phoneLabel` repurposed to “Celular”. The section-closing download button is unchanged.
3. **Mobile hero photo** (`components/hero.tsx`): width `w-44 sm:w-52` (176/208px) → `w-[min(70%,260px)]` — ~70% of the available width (245px at a 390px viewport), capped at 260px from sm (640) up to md, so it grows monotonically into the md grid track (272/288px). Stays centered (`mx-auto`); the arch (`rounded-t-[999px]`, clamping to a semicircle) and its ring/shadow are untouched.
4. **Verified** against a fresh production build served on port **3100** (the owner's dev server was left alone — at verification time nothing was listening on 3000–3199, so the capture port was free): Playwright, reduced-motion — no horizontal overflow at 390/1440; all three desktop labels single-line (23px each) with values sharing one left edge; the pill is exactly 36px, beside the number on desktop and below + left-aligned on mobile; every mobile row label-above-value; the photo measures 245×327 centered; zero console/page errors. Captures: `.impeccable/review/round9-contact-desktop.png`, `round9-contact-mobile.png`, `round9-hero-mobile.png` (full-page desktop/mobile refreshed too).
5. `DESIGN.md` synced (contact rows + pill, contact-label sizes, hero photo sizing, Ink Soft line); `.gitignore` now ignores all `.impeccable/*.log`.

## Round 8 changes — final polish pass (button hierarchy, contact merge, focus, favicon, title)

Requested by the owner; **layout/finish only** — no palette, type-family, font-size, content, or new-animation changes.

1. **Hero button reorganization** (`components/hero.tsx`): hierarchy inverted vs round 7 — **row 1: “Descargar CV (PDF)” as the primary button** (navy fill, paper text, inline download glyph); **row 2: the contact trio as outline pills** (Llamar / WhatsApp / Escribir un mail), all equal height (44/46px, `py-2.5`) with the same 12px gaps as before. New shared `components/download-button.tsx` (`DownloadCvButton`, href `/cv.pdf`) + `components/icons.tsx` (18px stroke download glyph, `currentColor`) so the hero and contact sections use the identical button. Mobile: everything full-width and stacked, download first. The hero grid is now `items-center` (photo vertically centered vs the text block) per the new explicit request, replacing round 7's top-align.
2. **768px wrap fix**: at the `md` band (768–1023px, content column 384px) the trio's combined width exceeded its column and “Escribir un mail” wrapped to two lines (70px tall). Fix: `md:px-4 lg:px-5` on the trio — slightly narrower horizontal padding *only in the md band* (heights, corner radii and gaps unchanged); the text never wraps again.
3. **Contact section** (`components/contact-section.tsx`): **Teléfono and WhatsApp merged into one row** — label “Teléfono / WhatsApp”, the number once (`tel:` link) followed by a small **“Abrir WhatsApp”** link (`wa.me`) in ink-soft. New copy keys `phoneWhatsappLabel` / `whatsappOpen`; the now-unused `whatsappLabel` key was removed. The **download button (same shared component) now closes the section**, after Ubicación.
4. **Focus ring, globally visible** (`app/globals.css`): `:focus-visible` switched from navy to **terracotta** (`2px solid var(--terracotta)`, 3px offset — the offset keeps the ring on the page ground, so it reads even around the navy-filled button). Contrast of terracotta on cream ≈ 4.9:1, above the 3:1 non-text minimum. Note: the pills' existing `transition-colors` (200ms) includes `outline-color`, so the ring fades in — any measurement of the focused state must wait past the transition (caught during verification: a 0ms read saw the ring at its paper start value).
5. **Favicon** (`app/icon.svg`): replaced the arch motif with a **serif “VP” monogram** — cream letters on a navy tile, 14px corners (Georgia/Times New Roman stack, no font embedding).
6. **Tab title** (`lib/copy.ts`): “Verónica Plodzien **·** Currículum vitae” — middot separator (typographically cleaner than the en-dash) and lowercase “vitae” per the owner's string.
7. **Verified** (production build, `pnpm start`, Playwright, reduced-motion): 390 and 768 — no horizontal overflow (scrollWidth = innerWidth), all pill buttons ≥ 44px, trio on one row at 768 (stacked at 390 as designed); keyboard focus shows the 2px terracotta ring with 3px offset; `/icon.svg` serves the monogram (200, svg); title correct on both sizes; zero page errors and **zero console issues in production**. Reduced-motion screenshots: `.impeccable/review/app-page-desktop.png` (1440×2986), `app-page-mobile.png` (390×3585).
8. **Gotchas found while verifying**: (a) a stale **dev** server was still bound to :3000 when the production server failed to start (EADDRINUSE race with a delayed `taskkill`) — the first screenshots therefore came from `next dev`, whose red “1 Issue” badge is dev-only UI, not app content; the true production page shows no badge and no console issues. (b) A **hydration attribute-diff warning appears only in dev, only for reduced-motion users**: the SSR HTML persists the hidden initial styles (opacity 0 / translateY) for the reveal wrappers, while the client reduce-branch writes the visible values, so React dev logs an attribute mismatch and patches client-side. Content is never hidden (the reduce branch is explicit) and **production logs nothing**; left as-is in this round (no animation-mechanic changes), candidate follow-up = render visible on first paint and arm the motion element in `useLayoutEffect`.
9. `DESIGN.md` synced (favicon monogram, terracotta focus ring, two-tier buttons, merged contact row, 720/1080 layout, rem sizes, single-glyph exception).

## Round 7 changes — desktop layout pass (widths, hero, type sizes, dev issue)

Requested by the owner; **layout-only** — no palette, type-family, content, or animation changes.

1. **Column widths** (`app/page.tsx`): the single 672px column is now two wrappers — the hero is full-width on mobile and capped at **1080px** centered (`lg:max-w-[67.5rem]`); the reading sections (Experiencia, Educación, Informática, Contacto) share a **720px** column (`max-w-[45rem]`). Mobile keeps the original 20px gutters.
2. **Hero, two columns on md+** (`components/hero.tsx`): grid `md:grid-cols-[17rem_1fr] lg:grid-cols-[18rem_1fr]`. Tailwind v4 gotcha: the first attempt used commas (`[17rem,1fr]`), which produced the invalid CSS `grid-template-columns:17rem,1fr` — the browser ignored it and the page rendered single-column; caught by the screenshot pass and fixed with underscores. Photo left, slightly larger (272px md / 288px lg); name + hairline + profile + buttons in the right column (`min-w-0 lg:max-w-[600px]`), **top-aligned** (`items-start`) so the name starts at the photo's top line; at lg the right margin equals the 64px gap (balanced breathing room).
3. **Buttons**: the three contact pills (Llamar / WhatsApp / Escribir un mail) always sit on one row from `sm:` up (stack only on phones); **Descargar CV (PDF) is now a real secondary button** — soft navy fill (`bg-navy/10`, 25%-opacity border, text navy, no icon to keep the text-only-pill consistency) — on its own line directly below.
4. **Profile measure** 65ch → **60ch** (owner request).
5. **Type sizes, rem-based** (16px floor for reading text on mobile; desktop bumps via `md:`): descriptions `1rem → md:1.125rem` (18px, line-height 1.65); company/institution `md:1.0625rem` (17px); periods, levels and secondary labels `1rem → md:0.9375rem` (16px phone / 15px desktop). H3 position/degree headings unchanged (20/24px).
6. **Contrast**: measured in the browser (Playwright, WCAG relative-luminance on rendered nodes): gray `#525b6b` on cream `#faf7f2` = **6.41:1** — passes 4.5:1 even at 15px, so no color was darkened. All four distinct color/background pairs on the page pass.
7. **The dev “1 issue”**: Next 16 printed `⚠ metadataBase property in metadata export is not set … using "http://localhost:3000"` — `NEXT_PUBLIC_SITE_URL` is unset (site not deployed yet), so `metadataBase` was `undefined` and Next guessed. Fix: `resolveMetadataBase()` now always returns a URL (the env var when set, otherwise the local origin; malformed → warning + local origin). Same URLs as before, zero warnings in dev and `pnpm build`; README documents that the real domain goes in `.env.local` at deploy time.
8. **Verified**: clean production build; Playwright reduced-motion screenshots 1440×2930 and 390×3501; zero console/page errors.
9. `.impeccable/dev.log` added to `.gitignore` (alongside `server.log`).

## Round 6 changes — new visual build (the web app)

The content work (rounds 1–5) closed this file; round 6 documents the build of the new single-page CV on top of the finalized `data/cv.json`.

1. **Stack** (per the user's brief): Next.js **16.3.8** (App Router, TypeScript, Turbopack), **React 19.2.8**, **Tailwind CSS 4.3.3**, **motion 13.5.0** (motion.dev), **pnpm 11.23.0**, Node 24. Scaffolded via `create-next-app` into a temp folder (`cv-scaffold-tmp` on the Desktop — never `C:\tmp`) because the target dir was non-empty, then moved in; `tsconfig.json` was dropped in the move and restored from the scaffold's git commit.
2. **Direction** (impeccable craft flow, code-led — no image generation available): concept seed **88dbb5dc**; all three dealt candidates rejected (weather-sun: amber clashes with the pinned palette; darkroom: inverts the cream ground; ANSI-BBS: violates "no programmer vibe"). The direction is **brief-pinned**: FORM = "Editorial dossier with a drawn timeline" (contract in `.impeccable/surfaces/app-page-tsx.md`).
3. **Design system**: tokens as CSS variables in `app/globals.css` (paper `#faf7f2`, ink `#1b1e26` / soft `#525b6b`, navy `#1d3557` / deep `#14263f`, terracotta `#b3502f` at decorative scale only), mapped to Tailwind v4 utilities via `@theme inline`. Fraunces (name + headings) and DM Sans (everything else) via `next/font/google`. Recorded after the build in **`DESIGN.md`** + `.impeccable/design.json` (impeccable documenter).
4. **Sections** (server-rendered, order per PRODUCT.md): Hero (arch photo `rounded-t-[999px]`, single `<h1>` name, terracotta hairline, profile, 4 buttons: Llamar `tel:`, WhatsApp `wa.me`, mail `mailto:`, Descargar CV (PDF) → `/cv.pdf`), Experiencia (timeline: quiet guide + navy spine that draws itself on scroll, terracotta dot on the current job, en-dash periods, current first), Educación, Informática (plain name/level rows), Contacto (`<address>`, tel/wa/meil links + location). No occupation title anywhere; no empty sections (education/skills render only if present in the JSON).
5. **Buttons are text-only pills** (no glyph icons — there is no consistent one-stroke WhatsApp glyph; the icon file was deleted after the finish review). The favicon is an authored `app/icon.svg` echoing the arch motif (navy arch + terracotta dot on cream); the scaffold's `favicon.ico` was removed. (This intentionally departs from PRODUCT.md's "no favicon" absence note — the build wins, recorded in DESIGN.md.)
6. **Dynamic years** (`lib/years.ts`): current year computed in the **America/Argentina/Tucumán** timezone; `{career_years}` = current year − earliest experience year (2009 → **17** in 2026); `{years_in_role}` = current year − current job's `from` (2015 → **11**); unknown markers fail the build with a clear message. Page revalidates daily (`export const revalidate = 86400` — must be a literal: Next 16 extracts segment-config exports statically and rejects arithmetic).
7. **`/cv.pdf`**: placeholder route returning **501** ("...volveré con el PDF en unos días") — the real PDF generation (suggested filename `Veronica-Plodzien-CV.pdf`) is a future round.
8. **SEO/OG**: `<html lang="es">`, title/description from `lib/copy.ts`, locale `es_AR`, og:image/twitter:image = `/img-perfil-600x800.webp` (served from the root — the repo path `public/...` 404s; found by the finish review). `metadataBase` comes from the optional env var **`NEXT_PUBLIC_SITE_URL`** (`.env.example`); absent → relative URLs (a warning is logged), malformed → warning + fallback, never a build failure.
9. **Motion** (subtle, per brief): hero staggered entrance, once-only scroll reveals (ease `cubic-bezier(0.16,1,0.3,1)`), the one authored moment = the timeline spine drawing via `useScroll` + `useSpring`. **Reduced motion is a hard floor**: `prefers-reduced-motion: reduce` renders static final states (pre-drawn spine, no animation, content always visible).
10. **Bug found in the browser pass**: Motion's SSR writes the hidden initial state (`opacity:0`) into the HTML; the reduced-motion branch (no animation) never cleared it, leaving the hero invisible for reduced-motion users. Fix: every reduce branch now passes explicit final-state values (and the spine keeps the same element type in both branches) so the visible state is written on mount. Verified with Playwright (reduced-motion + normal, desktop 1440 + mobile 390).
11. **Review** (impeccable finish review, builtin `reviewer` substituting the missing custom agent): detector zero findings; review → 3 fixes (og:image 404 path; button icon asymmetry; profile measure 52ch → 65ch per the 65–75ch band) → verdict pass → **"Ready to ship"**. Review captures kept in `.impeccable/review/`.
12. **Environment notes**: during the session the user's editor/formatter reformatted several components (Prettier) and improved small-text contrast (`text-sm text-ink-soft`) — adopted as the baseline, no reverts. The impeccable skill's `scripts/` dir is a self-referencing junction; its engine (0.1.5) runs via `sh scripts/impeccable <verb>` (there is no standalone `detector.mjs`; `detect` is a CLI verb).
13. **Git**: the project directory is a git repo initialized by the scaffold (single commit); `data/`, `NOTES.md`, `PRODUCT.md`, `.impeccable/`, and the two profile images were untracked at build time — a clean baseline commit is still pending.

## Round 5 changes

1. **Schema keys renamed to English** (values untouched): `nombre` → `name`, `perfil` → `profile`, `foto` → `photo`, `contacto` → `contact` (`ciudad` → `city`, `provincia` → `province`, `pais` → `country`, `telefono` → `phone`, `telefono_tel` → `phone_link`, `email` → `email`, `whatsapp` → `whatsapp`), `experiencia` → `experience` (`desde` → `from`, `hasta` → `to`, `actual` → `current`, `empresa` → `company`, `puesto` → `position`, `descripcion` → `description`), `educacion` → `education` (`nivel` → `level`, `institucion` → `institution`, `titulo` → `degree`), `informatica` → `computer_skills` (`nombre` → `name`, `nivel` → `level`).
2. **Placeholders renamed**: `{anios_puesto}` → `{years_in_role}` (Café a los Mandarines description), `{anios_trayectoria}` → `{career_years}` (profile). Still resolved at display time.
3. **Education**: string `periodo` replaced by numeric `from`/`to` — "2007 - 2010" → `from: 2007, to: 2010`; "2002 - 2006" → `from: 2002, to: 2006`.
4. **Institution value (approved change)**: "Instituto Superior JIM" → **"Instituto JIM (Nivel Superior)"**. `degree` unchanged ("Técnica Superior en Nutrición").
5. **NOTAS.md → NOTES.md**, content translated to English.

## Round 4 changes

1. **Experience — period → numeric fields**: `periodo` field removed; replaced by numeric `desde`/`to` fields, `hasta: null` for the current job (which keeps `actual: true`). The period text ("2015 – Actualidad", "2012 – 2013", "2011 – 2012", "2009 – 2010") is no longer stored: the UI composes it from the fields using an en dash.
   - Before → After:
     - Café a los Mandarines: `"periodo": "2015 – Actualidad"` → `"desde": 2015, "hasta": null` (keeps `actual: true`)
     - Hospital del Niño Jesús: `"periodo": "2012 – 2013"` → `"desde": 2012, "hasta": 2013`
     - Aegis Argentina: `"periodo": "2011 – 2012"` → `"desde": 2011, "hasta": 2012`
     - Alma by Nika: `"periodo": "2009 – 2010"` → `"desde": 2009, "hasta": 2010`
2. **Café a los Mandarines description**: "desde hace 11 años" → "desde hace {anios_puesto}".
3. **Profile**: V2 → **V3** (full texts in the Reference section). Diff: "Tengo 11 años de experiencia en atención al público, manejo de caja y tareas administrativas" → "Cuento con {anios_trayectoria} de trayectoria laboral, con experiencia en atención al público, ventas, manejo de caja y tareas administrativas".
4. **Placeholders**: `{anios_puesto}` and `{anios_trayectoria}` are kept verbatim in the JSON (not replaced by numbers); they are resolved when the content is displayed (next step). Result: no literal year count remains in the JSON (the old "11 años" went away with the placeholders).

## Round 3 changes

1. **name**: "VERONICA PLODZIEN" → **"Verónica Plodzien"** (accent, normal case; the design decides the display casing).
2. **`profesion`**: field removed from the JSON. The title "Técnica Superior en Nutrición" stays **only in Education** (not used as an occupation title in the hero or anywhere else).
3. **contact.telefono**: "+54 381 5017 189" → **"+54 381 501-7189"** (display). New fields: **`telefono_tel`: "+5493815017189"** (for `tel:` links) and **`whatsapp`: "5493815017189"** (for `wa.me`).
4. **Periods (experience)**: hyphen → en dash:
   - "2015 - Presente" → **"2015 – Actualidad"** (`actual: true` kept)
   - "2012 - 2013" → "2012 – 2013"
   - "2011 - 2012" → "2011 – 2012"
   - "2009 - 2010" → "2009 – 2010"
   - ⚠️ **Education periods untouched** ("2007 - 2010", "2002 - 2006"): that round's rule 7 protected the education section. (Superseded in round 5: education periods became numeric `from`/`to`.)
5. **Capitalization (education)**:
   - "Técnica superior en Nutrición" → **"Técnica Superior en Nutrición"** (degree)
   - "Instituto superior JIM" → **"Instituto Superior JIM"** (institution; later adjusted in round 5)
6. **Experience descriptions**: replaced by the approved literal texts (before → after in the expandable blocks below).
7. **Untouched** (rule 7): `perfil`, `email`, city/province/country, `foto`, `informatica` section, `puesto` fields.
   - Note: the instruction header said "Encargada, Lactario", but it was read as a label: the `puesto` field kept "Encargada (Lactario)".

<details>
<summary>6.1 Café a los Mandarines (Cajera / Vendedora)</summary>

**Before:**
> Trabajé durante 9 años como cajera y vendedora en la bombonería. Me encargaba de atender a los clientes, colaborar con mis compañeros de equipo y también manejar tareas administrativas, como hacer depósitos bancarios. ¡Fue una experiencia que me enseñó mucho sobre atención al público y trabajo en equipo!

**After:**
> Me desempeño como cajera y vendedora desde hace 11 años. Atiendo a los clientes, colaboro con mis compañeros y me encargo de tareas administrativas, como los depósitos bancarios. Es una experiencia que me enseñó mucho sobre atención al público y trabajo en equipo.

</details>

<details>
<summary>6.2 Hospital del Niño Jesús (Encargada (Lactario))</summary>

**Before:**
> Mi tarea principal era preparar fórmulas de leche adaptadas a las necesidades específicas de los bebés. Esta experiencia me permitió desarrollar habilidades en la preparación precisa de fórmulas para asegurar su correcta nutrición.

**After:**
> Mi tarea principal era preparar fórmulas de leche adaptadas a las necesidades específicas de cada bebé. Esta experiencia me permitió desarrollar la precisión necesaria para asegurar su correcta nutrición.

</details>

<details>
<summary>6.3 Aegis Argentina (Agente telefónico)</summary>

**Before:**
> En el call center trabajé en el área del Banco Francés, y mi tarea consistía en contactar a clientes para ofrecerles tarjetas de crédito, siempre con el objetivo de cumplir con las metas establecidas por mis superiores. Esta experiencia me permitió desarrollar habilidades en comunicación telefónica y en técnicas de ventas efectivas.

**After:**
> En el call center trabajé en el área del Banco Francés. Mi tarea consistía en contactar a clientes para ofrecerles tarjetas de crédito, siempre con el objetivo de cumplir las metas establecidas por mis superiores. Esta experiencia me permitió desarrollar habilidades de comunicación telefónica y técnicas de venta efectivas.

</details>

<details>
<summary>6.4 Alma by Nika (Vendedora)</summary>

**Before:**
> Trabajé vendiendo ropa femenina, donde me encargaba de ayudar a los clientes a encontrar lo que buscaban y hacer recomendaciones. Mi trabajo consistía en ofrecer un buen servicio y asegurarme de que los clientes salieran satisfechos con sus compras.

**After:**
> Vendía ropa femenina: ayudaba a los clientes a encontrar lo que buscaban y les hacía recomendaciones. Mi trabajo consistía en ofrecer un buen servicio y asegurarme de que los clientes salieran satisfechos con sus compras.

</details>

## Round 2 changes

1. **Profile — investigation**: the long text ("...responsable... prolija y detallista... empática... 11 años...") **does not exist in the repo**: not in the working tree nor in the 8 commits of `main` (= `origin/main`; `git grep` for "empática"/"prolija"/"responsable"/"11 años" across the whole history: 0 hits). The only profile in the repo is the short one in **`src/Components/Aside/OrangeBox/OrangeBox.js`** (`<p className='description'>`), and **it was already extracted in round 1** (it appears in the first `cv.json`). The longer version must come from a different, non-committed copy of the CV. Both texts are stored below as reference.
   - **Other repo text not included**: only site metadata in `public/index.html` (`<title>` "Veronica Plodzien - Curriculum", og:title "Curriculum Vitae", og:description "Web site about my curriculum vitae", keywords "curriculum, vitae, interview", theme-color). Website metadata, not CV content.
2. **`perfil`** replaced by the provided literal V2 text (reference below).
3. **Address**: 3 lines → structured `contacto.ciudad / .provincia / .pais` → "San Miguel de Tucumán, Tucumán, Argentina" on one line, no trailing period.
4. **Social networks**: conflict between rules 4 and 11. **Decision: `redes` field removed from the JSON** (rule 11 won); the UI does not show a social section.
5. **og:url / twitter:url / meta author**: ignored entirely (no references left in the JSON).
6. **Dates**: years kept as-is; **`"actual": true`** added to the "2015 - Presente" item.
7. **OFFICE → `informatica`**: "Microsoft Excel" and "Microsoft Word", both "Nivel intermedio"; the "Presente" period removed.
8. **Spelling** (obvious errors only, before → after):
   - "los bebes" → "los bebés" (Hospital del Niño Jesús)
   - "mi tarea Consistía" → "mi tarea consistía" (Aegis Argentina)
   - "Hospital del niño Jesús" → "Hospital del Niño Jesús" (proper-noun capitalization)
   - "San Martin" → "San Martín" (missing accent)
   - Not touched then: "Instituto superior JIM" (resolved in round 3, item 5; further adjusted in round 5, item 4).
9. **Photo**: original kept untouched at `public/img-perfil.jpg` + new `public/img-perfil-600x800.webp` (600×800, WebP q90, ~96 KB, LANCZOS resize from 1200×1600). Both paths in `foto`.
10. **Favicon**: not copied (site icon, not a CV asset).
11. **No empty sections** in the JSON (no courses, certifications, languages, or social networks).
12. **Generic focus**: no new occupation titles, no invented text. (The remaining `profesion` was removed in round 3, item 2.)

## Reference — profile texts

**V1 — the version that exists in the repo** (`src/Components/Aside/OrangeBox/OrangeBox.js`):
> Soy una persona comprometida, siempre puntual y con gusto por el trabajo en equipo. Me enfoco en asegurar que todo salga bien y en colaborar con los demás para lograr los mejores resultados posibles.

**V2 — provided in round 2** (not found in the repo; replaced by V3 in round 4):
> Soy una persona comprometida, responsable y siempre puntual, con gusto por el trabajo en equipo. Me caracterizo por ser prolija y detallista, y por brindar una atención cercana y empática. Tengo 11 años de experiencia en atención al público, manejo de caja y tareas administrativas, y me enfoco en que todo salga bien y en colaborar con los demás para lograr los mejores resultados.

**V3 — the version applied in `cv.json` (round 4):**
> Soy una persona comprometida, responsable y siempre puntual, con gusto por el trabajo en equipo. Me caracterizo por ser prolija y detallista, y por brindar una atención cercana y empática. Cuento con {anios_trayectoria} de trayectoria laboral, con experiencia en atención al público, ventas, manejo de caja y tareas administrativas, y me enfoco en que todo salga bien y en colaborar con los demás para lograr los mejores resultados.
>
> (Round 5: placeholder `{anios_trayectoria}` renamed to `{career_years}`.)

## Data from the original CV that is intentionally NOT in the JSON

- Site metadata: title, og tags, keywords, theme-color from `public/index.html`.
- `meta author` “Jonathan Ariel Plodzien” (developer, a different person).
- `public/favicon.ico` (site icon).

## Maintenance

- **Regenerating the PDF**: `pnpm generate:pdf` — rebuilds the production app, prints `/pdf` to A4 with Playwright/Chromium, and overwrites `public/cv.pdf`. Run it whenever `data/cv.json` changes, or when a year marker rolls over (`{career_years}` / `{years_in_role}` are computed from the current date — that is why the GitHub workflow runs on the 1st of each month), then commit the resulting `public/cv.pdf` (and any text changes).
- **On GitHub**: the **“Regenerate PDF”** workflow (`.github/workflows/regenerate-pdf.yml`) does the same on a schedule (cron `0 6 1 1 *`) or on demand (Actions → Run workflow) and commits the PDF itself. It needs Contents = “Read and write” in the repo's token permissions (the file's header comment explains why and where).
- **Visual review of the PDF**: `node scripts/pdf-pages-to-png.ts public/cv.pdf .impeccable/review 110` renders the pages to PNG (MuPDF).
- **`scripts/`**: plain Node scripts run through Node's native TypeScript type-stripping (Node ≥ 22); they sit inside the project's ESLint scope and pass it as-is (no special config).
- **Old CRA repo**: `C:\Users\Jony\Desktop\Curriculum-Vero` (read-only; never install or run it) — its git history holds the original literal texts from every round if a phrase ever needs to be recovered verbatim.
