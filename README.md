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

`/cv.pdf` es por ahora un placeholder (HTTP 501). Cuando se implemente,
se servirá desde esa misma URL y se descargará como
`Veronica-Plodzien-CV.pdf`.

## Variables de entorno

Copiar `.env.example` a `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — URL pública del sitio; alimenta la metadata
  SEO / Open Graph.
