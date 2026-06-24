import { BUSINESS, CONTACT, FAQ, SERVICES, SOCIAL_PROFILES, siteUrl } from "@/lib/site";
import { AREA_NAMES, COUNTIES } from "@/lib/areas";

/**
 * JSON-LD for US/local SEO. An @graph with:
 *  - LocalBusiness  → local pack, Maps, knowledge panel, rich snippets
 *  - WebSite        → site name in results
 *  - FAQPage        → FAQ rich results for "near me / on-site" queries
 */
export default function StructuredData() {
  const SITE_URL = siteUrl();

  const business = {
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: BUSINESS.tagline,
    slogan: "Your appliances, repaired right the first time.",
    url: SITE_URL,
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    image: `${SITE_URL}/opengraph-image`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    // Links Google to the place on the map (use the real GBP/Maps URL once live).
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${CONTACT.addressLine1}, ${CONTACT.city}, ${CONTACT.state} ${CONTACT.postalCode}`
    )}`,
    // Ties this site to the same entity on Google/Facebook/etc. (see SOCIAL_PROFILES).
    ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: "USD",
    paymentAccepted: BUSINESS.paymentAccepted.join(", "),
    knowsAbout: BUSINESS.knowsAbout,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.addressLine1,
      addressLocality: CONTACT.city,
      addressRegion: CONTACT.state,
      postalCode: CONTACT.postalCode,
      addressCountry: CONTACT.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    // Full service-area list (invisible local-SEO signal — see lib/areas.ts).
    areaServed: AREA_NAMES.map((name) => ({ "@type": "City", name: `${name}, IL` })),
    containedInPlace: COUNTIES.map((c) => ({
      "@type": "AdministrativeArea",
      name: `${c} County, Illinois`,
    })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT.phoneE164,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["English"],
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: BUSINESS.hours.days,
      opens: BUSINESS.hours.opens,
      closes: BUSINESS.hours.closes,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Appliance Repair Services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name + " Repair",
          description: s.desc,
          areaServed: COUNTIES.map((c) => ({
            "@type": "AdministrativeArea",
            name: `${c} County, Illinois`,
          })),
          provider: { "@id": `${SITE_URL}/#business` },
        },
      })),
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS.name,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#business` },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [business, website, faq],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
