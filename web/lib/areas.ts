// ── Service-area data (SEO only, not rendered as visible UI) ───────────────
// The full list of communities Soar Appliance Repair serves. Used purely for
// invisible local-SEO signals: the LocalBusiness `areaServed` / `containedInPlace`
// JSON-LD in components/StructuredData.tsx. Nothing here renders on the page.
// Communities across Cook, DuPage, Kane, Lake, Will and Kendall counties.

export type Area = {
  name: string;   // display name, e.g. "Oak Park"
  county: string; // primary county (no "County" suffix), e.g. "Cook"
};

export const AREAS: Area[] = [
  { name: "Addison", county: "DuPage" },
  { name: "Arlington Heights", county: "Cook" },
  { name: "Aurora", county: "Kane" },
  { name: "Bartlett", county: "DuPage" },
  { name: "Batavia", county: "Kane" },
  { name: "Berwyn", county: "Cook" },
  { name: "Bloomingdale", county: "DuPage" },
  { name: "Bolingbrook", county: "Will" },
  { name: "Brookfield", county: "Cook" },
  { name: "Buffalo Grove", county: "Lake" },
  { name: "Burr Ridge", county: "DuPage" },
  { name: "Carol Stream", county: "DuPage" },
  { name: "Chicago", county: "Cook" },
  { name: "Cicero", county: "Cook" },
  { name: "Clarendon Hills", county: "DuPage" },
  { name: "Darien", county: "DuPage" },
  { name: "Deerfield", county: "Lake" },
  { name: "Des Plaines", county: "Cook" },
  { name: "Downers Grove", county: "DuPage" },
  { name: "Elmhurst", county: "DuPage" },
  { name: "Elk Grove Village", county: "Cook" },
  { name: "Evanston", county: "Cook" },
  { name: "Forest Park", county: "Cook" },
  { name: "Franklin Park", county: "Cook" },
  { name: "Geneva", county: "Kane" },
  { name: "Glen Ellyn", county: "DuPage" },
  { name: "Glenview", county: "Cook" },
  { name: "Glendale Heights", county: "DuPage" },
  { name: "Hanover Park", county: "Cook" },
  { name: "Harwood Heights", county: "Cook" },
  { name: "Hinsdale", county: "DuPage" },
  { name: "Hodgkins", county: "Cook" },
  { name: "Hoffman Estates", county: "Cook" },
  { name: "Itasca", county: "DuPage" },
  { name: "Joliet", county: "Will" },
  { name: "La Grange", county: "Cook" },
  { name: "La Grange Park", county: "Cook" },
  { name: "Lemont", county: "Cook" },
  { name: "Lisle", county: "DuPage" },
  { name: "Lombard", county: "DuPage" },
  { name: "Melrose Park", county: "Cook" },
  { name: "Morton Grove", county: "Cook" },
  { name: "Mount Prospect", county: "Cook" },
  { name: "Naperville", county: "DuPage" },
  { name: "Niles", county: "Cook" },
  { name: "Northbrook", county: "Cook" },
  { name: "Northlake", county: "Cook" },
  { name: "Oak Brook", county: "DuPage" },
  { name: "Oak Lawn", county: "Cook" },
  { name: "Oak Park", county: "Cook" },
  { name: "Orland Park", county: "Cook" },
  { name: "Oswego", county: "Kendall" },
  { name: "Palatine", county: "Cook" },
  { name: "Park Ridge", county: "Cook" },
  { name: "Plainfield", county: "Will" },
  { name: "Prospect Heights", county: "Cook" },
  { name: "River Forest", county: "Cook" },
  { name: "River Grove", county: "Cook" },
  { name: "Rolling Meadows", county: "Cook" },
  { name: "Roselle", county: "DuPage" },
  { name: "Schaumburg", county: "Cook" },
  { name: "Skokie", county: "Cook" },
  { name: "St. Charles", county: "Kane" },
  { name: "Villa Park", county: "DuPage" },
  { name: "Warrenville", county: "DuPage" },
  { name: "West Chicago", county: "DuPage" },
  { name: "Westchester", county: "Cook" },
  { name: "Western Springs", county: "Cook" },
  { name: "Westmont", county: "DuPage" },
  { name: "Wheaton", county: "DuPage" },
  { name: "Willowbrook", county: "DuPage" },
  { name: "Wilmette", county: "Cook" },
  { name: "Winfield", county: "DuPage" },
  { name: "Winnetka", county: "Cook" },
  { name: "Wood Dale", county: "DuPage" },
  { name: "Woodridge", county: "DuPage" },
];

// City names for JSON-LD areaServed.
export const AREA_NAMES: string[] = AREAS.map((a) => a.name);

// Distinct counties, first-appearance order, for JSON-LD containedInPlace.
export const COUNTIES: string[] = Array.from(new Set(AREAS.map((a) => a.county)));
