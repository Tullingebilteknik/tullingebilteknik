import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin/",
      },
    ],
    sitemap: "https://tullingebilteknik.se/sitemap.xml",
    host: "https://tullingebilteknik.se",
  };
}

// Note: LLM-friendly content map available at /llms.txt
