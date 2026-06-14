import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Resolve the URL at request time so it always reflects the deployed domain.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
