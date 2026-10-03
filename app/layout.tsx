import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { copy } from "@/lib/copy";
import { loadCv, assetUrl } from "@/lib/cv";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const cv = loadCv();

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// The only origin this app can produce. Guarded on purpose: this is a
// build-time constant, so an invalid literal must fail loudly at module
// load (build time) rather than be silently swallowed.
function constantUrl(raw: string): URL {
  try {
    return new URL(raw);
  } catch {
    throw new Error(`Invalid constant URL: ${raw}`);
  }
}
const localOrigin = constantUrl("http://localhost:3000");

/**
 * The site URL comes from an env var, never hardcoded. Until the site is
 * deployed there is no domain, so local development uses the local origin
 * (otherwise Next warns and guesses it anyway). Set NEXT_PUBLIC_SITE_URL in
 * .env.local / at deploy time to emit correct absolute URLs in the
 * og/twitter tags.
 */
function resolveMetadataBase(): URL {
  if (!siteUrl) return localOrigin;
  try {
    return new URL(siteUrl);
  } catch {
    console.warn(
      `[metadata] NEXT_PUBLIC_SITE_URL is not a valid URL ("${siteUrl}"); ` +
        "using the local origin instead.",
    );
    return localOrigin;
  }
}

const ogImage = {
  // public/ assets are served from the root: /img-... — never the repo path.
  url: assetUrl(cv.photo.web),
  width: 600,
  height: 800,
  alt: copy.page.photoAlt(cv.name),
};

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: copy.page.title(cv.name),
  description: copy.page.description(cv.name),
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: cv.name,
    title: copy.page.title(cv.name),
    description: copy.page.description(cv.name),
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: copy.page.title(cv.name),
    description: copy.page.description(cv.name),
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d3557",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable} antialiased`}>
      <body>
        {/* No-JS fallback: the motion entrance/reveal animations ship
            `opacity:0` (and the timeline spine ships `scaleY(0)`) inline in
            the SSR HTML. Without JavaScript nothing would ever clear those,
            so a no-JS visitor — or a no-JS print — would see a blank page.
            Browsers activate the style below only when scripting is
            disabled (it is inert otherwise), forcing every element the
            animations hide into its final visible state. */}
        <noscript dangerouslySetInnerHTML={{ __html: NO_JS_FALLBACK_STYLE }} />
        {children}
      </body>
    </html>
  );
}

// Static by construction: this string is the exact no-JS fallback CSS and
// never contains user input or interpolation, so there is nothing to
// sanitize. dangerouslySetInnerHTML is the only way React emits raw markup
// inside <noscript> (its children are serialized as text), which is why
// the classic noscript pattern uses it.
const NO_JS_FALLBACK_STYLE =
  "<style>[style*=\"opacity:0\"],[style*=\"scaleY(0)\"]{opacity:1!important;transform:none!important}</style>";
