# Currículum de Verónica Plodzien

Web CV de una página. El contenido vive en [`data/cv.json`](data/cv.json)
(textos aprobados, verbatim); esta app solo los renderiza.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Motion](https://motion.dev) para las animaciones
- pnpm

## Comandos

```bash
pnpm install
pnpm dev        # desarrollo
pnpm build      # build de producción
pnpm start      # servidor de producción
pnpm lint       # ESLint
pnpm generate:pdf  # regenera public/cv.pdf (build + Playwright/Chromium)
```

## Contenido y años dinámicos

- `data/cv.json` — única fuente de verdad (claves en inglés, valores en español).
- Los marcadores `{years_in_role}` y `{career_years}` se resuelven en
  [`lib/years.ts`](lib/years.ts) con el año actual en la zona horaria
  `America/Argentina/Tucuman`. Si hay una marca desconocida o un marcador
  mal usado, el build falla con un mensaje claro.
- La página se revalida cada día (`revalidate = 86400`): los años se
  recalculan sin redeploy.

## Textos de interfaza

Todos los textos de UI (etiquetas, botones, metadatos SEO) viven en
[`lib/copy.ts`](lib/copy.ts): claves en inglés, valores en español
rioplatense neutro. Los componentes no hardcodean español.

## PDF

`/cv.pdf` sirve el PDF real del currículum (A4, texto seleccionable,
máximo 2 páginas): el archivo vive en el repo como `public/cv.pdf` y el
botón “Descargar CV (PDF)” lo guarda como `Veronica-Plodzien-CV.pdf`
(atributo `download`, sin tildes).

El PDF se genera desde la página de impresión `/pdf` (noindex):
`pnpm generate:pdf` hace un build de producción e imprime la página con
Playwright/Chromium. Ejecutarlo cada vez que se edita `data/cv.json`
y commitear el `public/cv.pdf` resultante.

En GitHub, el workflow **“Regenerate PDF”** (`.github/workflows/`)
lleva a cabo lo mismo el día 1 de cada mes (06:00) y bajo demanda
(Actions → Run workflow), y commit + push solo si el PDF cambió. Requiere
permiso `contents: write` (el comentario al inicio del archivo explica
por qué y cómo).

## Variables de entorno

Copiar `.env.example` a `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — URL pública del sitio; alimenta la metadata
  SEO / Open Graph (og:image y twitter:image). Opcional en desarrollo local:
  sin ella se usa `http://localhost:3000` como origen. **Setearla al
  desplegar** para que los tags sociales apunten al dominio real.
