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

// Each service powers a photo tile in the services carousel. Clicking a tile
// opens a modal with the longer description, common issues we fix, and the
// brands/models we service. Swap `img` for your own photos in /public/services.
export const SERVICES = [
  {
    num: "01",
    name: "Refrigerators & Freezers",
    desc: "Cooling failures, leaks, and temperature problems.",
    img: "/services/fridge.jpg",
    issues: [
      "Not cooling or freezing properly",
      "Water leaking or pooling inside",
      "Frost buildup or a freezer that won't defrost",
      "Loud noises, a running compressor that won't stop",
      "Broken thermostats, fans, and door seals",
    ],
    brands: ["Samsung", "LG", "Whirlpool", "GE", "Frigidaire", "KitchenAid", "Bosch", "Sub-Zero", "Kenmore"],
  },
  {
    num: "02",
    name: "Washers & Dryers",
    desc: "Drainage, spin, heating, and noisy drums.",
    img: "/services/washer.jpg",
    issues: [
      "Washer won't drain, fill, or spin",
      "Dryer not heating or taking too long to dry",
      "Loud banging or grinding from the drum",
      "Leaks, error codes, and door/lid lock faults",
      "Worn belts, pumps, and heating elements",
    ],
    brands: ["Samsung", "LG", "Whirlpool", "GE", "Frigidaire", "Bosch", "Speed Queen", "Electrolux", "Kenmore"],
  },
  {
    num: "03",
    name: "Dishwashers",
    desc: "Drainage, leaks, and poor cleaning performance.",
    img: "/services/dishwasher.svg",
    issues: [
      "Dishes coming out dirty or filmy",
      "Won't drain or standing water in the bottom",
      "Leaking onto the floor",
      "Won't start, won't fill, or stops mid-cycle",
      "Faulty pumps, spray arms, and door latches",
    ],
    brands: ["Bosch", "Whirlpool", "KitchenAid", "Samsung", "LG", "GE", "Frigidaire", "Kenmore"],
  },
  {
    num: "04",
    name: "Ovens, Stoves & Cooktops",
    desc: "Heating elements, igniters, and controls.",
    img: "/services/oven.jpg",
    issues: [
      "Oven not heating or not reaching temperature",
      "Burner or igniter won't light (gas)",
      "Uneven baking and faulty temperature sensors",
      "Broken control boards, knobs, and displays",
      "Bad heating elements and bake/broil igniters",
    ],
    brands: ["GE", "Whirlpool", "Samsung", "LG", "Frigidaire", "KitchenAid", "Bosch", "Viking", "Kenmore"],
  },
  {
    num: "05",
    name: "Ice Makers",
    desc: "No ice, slow production, and leaks.",
    img: "/services/ice.jpg",
    issues: [
      "Not making ice or making too little",
      "Ice tastes or smells off",
      "Water leaking or freezing up the line",
      "Ice maker won't dispense or jams",
      "Faulty water valves, sensors, and ejector motors",
    ],
    brands: ["Whirlpool", "Samsung", "LG", "GE", "Frigidaire", "KitchenAid", "Scotsman", "U-Line", "Kenmore"],
  },
];

// Customer testimonials shown in the "What our customers say" section.
// NOTE: these are realistic sample reviews for initial content — swap in real
// ones as they come in. They are intentionally NOT added to Review/AggregateRating
// JSON-LD, since Google's guidelines require review rich results to be genuine.
export const TESTIMONIALS = [
  {
    text: "Our fridge died before Thanksgiving and they had it cooling again by dinner.",
    name: "Megan R.",
    role: "Streamwood, IL",
  },
  {
    text: "Fixed our dryer instead of selling us a new one — exactly the price quoted.",
    name: "David K.",
    role: "Hoffman Estates, IL",
  },
  {
    text: "On time, tidy, and explained the dishwasher problem with zero upselling.",
    name: "Priya S.",
    role: "Schaumburg, IL",
  },
  {
    text: "Came out the same day and fixed our leaking washer in under an hour.",
    name: "Anthony M.",
    role: "Bartlett, IL",
  },
  {
    text: "Showed up right on time and fixed the oven igniter on the first visit.",
    name: "Karen W.",
    role: "Elgin, IL",
  },
  {
    text: "Had someone out in two days and our ice maker has worked perfectly since.",
    name: "Marcus T.",
    role: "Hanover Park, IL",
  },
  {
    text: "Honest advice to repair instead of replace — saved us a lot of money.",
    name: "Elena V.",
    role: "Roselle, IL",
  },
  {
    text: "Quick and friendly — had our stove burner lit again in minutes.",
    name: "James O.",
    role: "South Barrington, IL",
  },
  {
    text: "Clear pricing, on-time arrival, and the washer runs like new.",
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
