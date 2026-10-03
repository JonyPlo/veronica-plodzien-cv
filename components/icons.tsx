/**
 * Inline SVG glyphs for the UI. One functional glyph only (the download
 * action) — the page intentionally carries no decorative icon system.
 * Stroke style matches the type scale: 1.75 stroke, round caps, currentColor.
 */
export function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
