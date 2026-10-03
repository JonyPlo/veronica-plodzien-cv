import { copy } from "@/lib/copy";
import { loadCv } from "@/lib/cv";

// Standalone placeholder page for the not-yet-built PDF download.
//
// Colors mirror the design tokens in app/globals.css (this route emits
// standalone HTML and cannot import the stylesheet):
//   paper #faf7f2 · ink #1b1e26 · ink-soft #525b6b · navy #1d3557 ·
//   terracotta #b3502f.
// No font embedding: standalone route HTML uses the same system serif/sans
// stacks as the favicon (see DESIGN.md, favicon exemption) — Fraunces is
// only available through next/font inside the app shell.
//
// The HTTP status stays 501 (Not Implemented): the endpoint is honest about
// not being done, and the page simply gives the visitor a proper landing
// spot and a way back instead of a raw text dead end.
export async function GET() {
  const cv = loadCv();
  const title = copy.page.title(cv.name);

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${title}</title>
<style>
  body {
    margin: 0;
    background: #faf7f2;
    color: #1b1e26;
    font-family: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .wrap {
    max-width: 32rem;
    margin: 0 auto;
    padding: 24% 1.5rem 4rem;
    text-align: center;
  }
  .rule {
    width: 32px;
    height: 1px;
    margin: 0 auto 1.75rem;
    background: #b3502f;
  }
  h1 {
    margin: 0 0 1rem;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 2rem;
    line-height: 1.15;
    font-weight: 600;
    color: #1d3557;
  }
  .msg {
    margin: 0 0 2rem;
    font-size: 1.0625rem;
    line-height: 1.65;
    color: #525b6b;
  }
  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0.625rem 1.25rem;
    border: 1px solid rgba(29, 53, 87, 0.3);
    border-radius: 9999px;
    color: #1d3557;
    font-size: 0.9375rem;
    font-weight: 500;
    text-decoration: none;
    transition: background-color 200ms, border-color 200ms, color 200ms;
  }
  a:hover {
    border-color: #1d3557;
    background: rgba(29, 53, 87, 0.05);
  }
  a:focus-visible {
    outline: 2px solid #b3502f;
    outline-offset: 3px;
  }
</style>
</head>
<body>
<main class="wrap">
  <div class="rule" aria-hidden="true"></div>
  <h1>${copy.hero.downloadPdf}</h1>
  <p class="msg">${copy.pdfPlaceholder}</p>
  <a href="/">${copy.pdfPlaceholderBack}</a>
</main>
</body>
</html>`;

  return new Response(html, {
    status: 501,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
