import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BUSINESS.name,
    short_name: "Soar Repair",
    description: BUSINESS.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6f7",
    theme_color: "#3a444d",
    lang: "en-US",
    icons: [
      { src: "/icon", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
