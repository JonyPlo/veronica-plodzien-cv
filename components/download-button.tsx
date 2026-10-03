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
 */
export function DownloadCvButton({ className = "" }: DownloadCvButtonProps) {
  return (
    <a
      href="/cv.pdf"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-2.5 font-medium text-paper transition-colors duration-200 hover:bg-navy-deep ${className}`}
    >
      <DownloadIcon />
      {copy.hero.downloadPdf}
    </a>
  );
}
