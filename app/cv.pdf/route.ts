import { copy } from "@/lib/copy";

/**
 * Placeholder for the PDF version. When the PDF is implemented it will be
 * served from this exact URL and named "Veronica-Plodzien-CV.pdf"
 * (see NOTES.md). Until then the route explains, in the product's own
 * voice, that the file is still being built.
 */
export async function GET() {
  return new Response(copy.pdfPlaceholder, {
    status: 501,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
