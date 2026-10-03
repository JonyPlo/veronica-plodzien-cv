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

/**
 * The site URL comes from an env var, never hardcoded. Until the site is
 * deployed there is no domain, so local development uses the local origin
 * (otherwise Next warns and guesses it anyway). Set NEXT_PUBLIC_SITE_URL in
 * .env.local / at deploy time to emit correct absolute URLs in the
 * og/twitter tags.
 */
function resolveMetadataBase(): URL {
  if (!siteUrl) return new URL("http://localhost:3000");
  try {
    return new URL(siteUrl);
  } catch {
    console.warn(
      `[metadata] NEXT_PUBLIC_SITE_URL is not a valid URL ("${siteUrl}"); ` +
        "using the local origin instead.",
    );
    return new URL("http://localhost:3000");
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
      <body>{children}</body>
    </html>
  );
}
