// Public site URL, resolved at request time (NOT a build-time constant, so it
// reflects the deployed domain without rebuilding). Set SITE_URL in production
// (Railway / custom domain). Falls back to Railway's public domain, then localhost.
// Note: this is intentionally a regular env var, not NEXT_PUBLIC_*, because
// NEXT_PUBLIC_* values are inlined at build time and can't pick up the runtime URL.
export function siteUrl(): string {
  const raw =
    process.env.SITE_URL ||
    (process.env.RAILWAY_PUBLIC_DOMAIN
      ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
      : "http://localhost:3000");
  return raw.replace(/\/$/, "");
}

export const BUSINESS = {
  name: "Soar Appliance Repair",
  legalName: "Soar Appliance Repair",
  tagline: "On-site appliance repair in Streamwood, IL & the greater Chicago area",
  // Geo for US/local SEO targeting.
  geo: { lat: 42.0256, lng: -88.1784 },
  region: "US-IL",
  areaServed: [
    "Streamwood",
    "Hoffman Estates",
    "Schaumburg",
    "Elgin",
    "Bartlett",
    "Hanover Park",
    "Roselle",
    "South Barrington",
    "Greater Chicago",
  ],
  priceRange: "$$",
  // Hours are illustrative — adjust to real availability.
  openingHours: "Mo-Sa 08:00-18:00",
  hours: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "18:00" },
  paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
  knowsAbout: [
    "Refrigerator repair",
    "Washer and dryer repair",
    "Dishwasher repair",
    "Oven and stove repair",
    "Microwave repair",
    "Garbage disposal repair",
    "HVAC and AC repair",
    "Water heater repair",
  ],
} as const;

// Compact FAQ — keyword-targeted for US local / "near me" / on-site search intent.
export const FAQ = [
  {
    q: "Do you come to my home to repair appliances?",
    a: "Yes. Soar Appliance Repair is a mobile, on-site service — our technicians come to your home and repair your appliance on the spot across Streamwood and the greater Chicago area.",
  },
  {
    q: "What areas do you serve?",
    a: "We provide on-site appliance repair in Streamwood, Hoffman Estates, Schaumburg, Elgin, Bartlett, Hanover Park, Roselle, South Barrington and the surrounding greater Chicago area.",
  },
  {
    q: "What appliances do you repair?",
    a: "We repair all major home appliances: refrigerators and freezers, washers and dryers, dishwashers, ovens, stoves and cooktops, microwaves, garbage disposals, HVAC and AC units, and water heaters.",
  },
  {
    q: "Can you offer same-day or fast appliance repair?",
    a: "We schedule visits as quickly as possible — often same-day or next-day depending on availability. Submit the request form or call (224) 442-2422 and we'll confirm the soonest appointment that fits your day.",
  },
  {
    q: "How do I book an appliance repair?",
    a: "Fill out the request form on this page with your details and the appliance issue, or call us at (224) 442-2422. We'll contact you to confirm a convenient on-site visit.",
  },
];

export const CONTACT = {
  phoneDisplay: "(224) 442-2422",
  phoneHref: "tel:+12244422422",
  phoneE164: "+12244422422",
  email: "appliance@soargroup.info",
  addressLine1: "6 Wild Rose Ct",
  city: "Streamwood",
  state: "IL",
  postalCode: "60107",
  country: "US",
  addressLine2: "Streamwood, IL 60107",
};

export const SERVICES = [
  { num: "01", name: "Refrigerators & Freezers", desc: "Cooling failures, leaks, and temperature problems." },
  { num: "02", name: "Washers & Dryers", desc: "Drainage, spin, heating, and noisy drums." },
  { num: "03", name: "Dishwashers", desc: "Drainage, leaks, and poor cleaning performance." },
  { num: "04", name: "Ovens, Stoves & Cooktops", desc: "Heating elements, igniters, and controls." },
  { num: "05", name: "Microwaves", desc: "Power loss, turntable, and door faults." },
  { num: "06", name: "Garbage Disposals", desc: "Jams, leaks, and motor replacements." },
  { num: "07", name: "HVAC & AC Units", desc: "Cooling, airflow, and thermostat repairs." },
  { num: "08", name: "Water Heaters", desc: "No hot water, leaks, and pressure issues." },
];

export const APPLIANCE_OPTIONS = [
  "Refrigerator / Freezer",
  "Washer / Dryer",
  "Dishwasher",
  "Oven / Stove / Cooktop",
  "Microwave",
  "Garbage Disposal",
  "HVAC / AC Unit",
  "Water Heater",
  "Other",
];
