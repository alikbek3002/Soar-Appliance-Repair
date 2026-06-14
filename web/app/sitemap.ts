import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Resolve the URL at request time so it always reflects the deployed domain.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
