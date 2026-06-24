import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import { BUSINESS, CONTACT, siteUrl } from "@/lib/site";
import "./globals.css";

// Kept within Google's display limits — title ~52 chars, description ~158.
const TITLE = "On-Site Appliance Repair in Chicago & Suburbs | Soar";
const DESCRIPTION =
  "On-site appliance repair across Chicago & the suburbs — refrigerators, washers, dryers, ovens & dishwashers fixed in your home, often same-day. Call (224) 442-2422.";

export function generateMetadata(): Metadata {
  const SITE_URL = siteUrl();
  return {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Soar Appliance Repair",
  },
  description: DESCRIPTION,
  applicationName: BUSINESS.name,
  keywords: [
    "appliance repair Chicago suburbs",
    "appliance repair near me",
    "on-site appliance repair",
    "in-home appliance repair",
    "same day appliance repair",
    "Chicago appliance repair",
    "refrigerator repair Chicago suburbs",
    "washer and dryer repair Chicago",
    "dishwasher repair near me",
    "oven and cooktop repair",
    "dryer repair near me",
    "range and stove repair",
    "appliance repair Hoffman Estates",
    "appliance repair Schaumburg",
    "appliance repair Naperville",
    "appliance repair Aurora IL",
    "appliance repair Arlington Heights",
    "appliance repair Evanston",
    "appliance repair Oak Park",
    "appliance repair Wheaton",
    "appliance repair Elmhurst",
    "appliance repair Des Plaines",
    "appliance repair Orland Park",
    "appliance repair Palatine",
    "appliance repair Downers Grove",
    "appliance repair Skokie",
    "DuPage County appliance repair",
    "Cook County appliance repair",
  ],
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  category: "Home Services",
  alternates: {
    canonical: "/",
    languages: { "en-US": "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: BUSINESS.name,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, address: true, email: true },
  other: {
    // Geo targeting hints for US/local search engines.
    "geo.region": BUSINESS.region,
    "geo.placename": `${CONTACT.city}, ${CONTACT.state}`,
    "geo.position": `${BUSINESS.geo.lat};${BUSINESS.geo.lng}`,
    ICBM: `${BUSINESS.geo.lat}, ${BUSINESS.geo.lng}`,
  },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Preload the font CSS so it's discovered during HTML parse (faster FCP). */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap"
          rel="stylesheet"
        />
        <StructuredData />
      </head>
      <body>{children}</body>
    </html>
  );
}
