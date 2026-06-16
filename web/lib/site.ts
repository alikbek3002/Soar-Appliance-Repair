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
    "Ice maker repair",
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
    a: "We repair major home appliances: refrigerators and freezers, washers and dryers, dishwashers, ovens, stoves and cooktops, and ice makers.",
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
  { num: "05", name: "Ice Makers", desc: "No ice, slow production, and leaks." },
];

// Customer testimonials shown in the "What our customers say" section.
// NOTE: these are realistic sample reviews for initial content — swap in real
// ones as they come in. They are intentionally NOT added to Review/AggregateRating
// JSON-LD, since Google's guidelines require review rich results to be genuine.
export const TESTIMONIALS = [
  {
    text: "Our fridge stopped cooling two days before we were hosting Thanksgiving — I was sure we'd lose all our food. I called in the morning and a technician was at the house by early afternoon. Turned out to be a relay, which he had right on his truck. We were back up and running before dinner.",
    name: "Megan R.",
    role: "Streamwood, IL",
  },
  {
    text: "Honest and to the point. Our dryer wasn't heating and, instead of pushing me toward a brand-new unit, he replaced the heating element and cleared out the vent. Charged exactly what he quoted me on the phone.",
    name: "David K.",
    role: "Hoffman Estates, IL",
  },
  {
    text: "I sent a request late at night and got a text back the next morning with a time window. The tech showed up on time, put on shoe covers, and explained what was wrong with the dishwasher in plain English. No upselling at all.",
    name: "Priya S.",
    role: "Schaumburg, IL",
  },
  {
    text: "Washer was leaking all over the laundry room. They came out the same day, traced it to a cracked hose, and had it fixed in under an hour. Clean, professional, and fair on price.",
    name: "Anthony M.",
    role: "Bartlett, IL",
  },
  {
    text: "I've had bad luck with repair people who never call back. These guys actually answered the phone, showed up when they said they would, and fixed our oven igniter on the first visit.",
    name: "Karen W.",
    role: "Elgin, IL",
  },
  {
    text: "Our ice maker quit and another company quoted me a week out. Soar had someone here in two days, found a frozen line, and showed me how to keep it from happening again.",
    name: "Marcus T.",
    role: "Hanover Park, IL",
  },
  {
    text: "Really knowledgeable and patient. He was upfront that a small repair made more sense than replacing our older fridge, and walked me through exactly why. Saved us a good chunk of money.",
    name: "Elena V.",
    role: "Roselle, IL",
  },
  {
    text: "Quick, friendly, and tidy. One burner on our stove wouldn't light — he had it going fast and checked the others while he was here. Felt like a neighbor helping out, not a sales pitch.",
    name: "James O.",
    role: "South Barrington, IL",
  },
  {
    text: "From the first call to the finished repair, the whole thing was easy. Clear pricing, on-time arrival, and the washer runs like new. I'd recommend them to anyone in the area.",
    name: "Nicole B.",
    role: "Streamwood, IL",
  },
];

export const APPLIANCE_OPTIONS = [
  "Refrigerator / Freezer",
  "Washer / Dryer",
  "Dishwasher",
  "Oven / Stove / Cooktop",
  "Ice Maker",
  "Other",
];
