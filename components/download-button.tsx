import { copy } from "@/lib/copy";
import { DownloadIcon } from "@/components/icons";

interface DownloadCvButtonProps {
  /** Extra classes, e.g. `w-full sm:w-auto` for responsive width. */
  className?: string;
}

/**
 * The page's primary action: the PDF download. Navy fill, light text, one
 * inline download glyph. Shared by the hero (top row) and the end of the
 * contact section so both instances stay in sync.
 *
 * The href is the static PDF generated into public/ by `pnpm generate:pdf`
 * (committed to the repo; see NOTES.md, Maintenance). The `download`
 * attribute carries the approved file name, so the browser saves it as
 * "Veronica-Plodzien-CV.pdf" instead of the raw URL name.
 */
export function DownloadCvButton({ className = "" }: DownloadCvButtonProps) {
  return (
    <a
      href="/cv.pdf"
      download={copy.pdf.fileName}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-2.5 font-medium text-paper transition-[background-color,border-color,color] duration-200 hover:bg-navy-deep ${className}`}
    >
      <DownloadIcon />
      {copy.hero.downloadPdf}
    </a>
  );
}
