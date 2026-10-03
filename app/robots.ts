import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The print view is a tool, not a destination: the page itself is
        // also marked noindex (metadata), so both layers agree.
        disallow: "/pdf",
      },
    ],
  };
}
