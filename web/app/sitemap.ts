import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Resolve the URL at request time so it always reflects the deployed domain.
export const dynamic = "force-dynamic";

// Stable last-modified date (bump when the site's content meaningfully changes).
// Using a fixed date — not new Date() — so crawlers don't see the page as
// "changed" on every fetch, which dilutes the signal.
const LAST_MODIFIED = "2026-06-24";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl(),
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
