/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy. Pragmatic but tight: only our own origin plus the
// Google Fonts + OpenStreetMap-embed origins the site actually uses.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // 'unsafe-inline' is needed for Next's hydration bootstrap and the JSON-LD tag.
  // 'unsafe-eval' is only added in dev for fast-refresh.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  // No third-party iframes anymore (footer map was removed).
  "frame-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Force HTTPS for 2 years (incl. subdomains).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Anti-clickjacking (CSP frame-ancestors covers modern browsers; this covers old ones).
  { key: "X-Frame-Options", value: "DENY" },
  // Block MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Drop powerful APIs the site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Keep API responses out of search indexes (robots.ts already disallows
        // crawling /api; this covers any that get linked/fetched directly).
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
