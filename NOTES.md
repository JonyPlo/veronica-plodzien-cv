# NOTES — CV extraction and adjustments

Source repo: `C:\Users\Jony\Desktop\Curriculum-Vero` (CRA). Target: `C:\Users\Jony\Desktop\curriculum-vero-nuevo`.
Rounds 3–5: corrections and adjustments approved by the CV owner.
From round 5 on, this file is written in English; the visible CV text values (in `data/cv.json`) stay in Spanish, unmodified.

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
- `meta author` "Jonathan Ariel Plodzien" (developer, a different person).
- `public/favicon.ico` (site icon).
