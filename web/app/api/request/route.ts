import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  appliance?: string;
  details?: string;
  company?: string; // honeypot — must stay empty
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Per-field max lengths (defense against oversized/abusive payloads).
const LIMITS: Record<string, number> = {
  firstName: 80,
  lastName: 80,
  email: 160,
  phone: 40,
  address: 200,
  appliance: 60,
  details: 2000,
};
const MAX_BODY_BYTES = 12_000;

// ── Simple in-memory per-IP rate limiter (sliding window) ──
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string, now: number): boolean {
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  const now = Date.now();
  const ip = clientIp(req);

  if (rateLimited(ip, now)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // Reject oversized bodies before parsing.
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let body: Payload;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real users never see/fill this field. Bots do — pretend success
  // so we don't tip them off, but never forward to Telegram.
  if (clean(body.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const data = {
    firstName: clean(body.firstName, LIMITS.firstName),
    lastName: clean(body.lastName, LIMITS.lastName),
    email: clean(body.email, LIMITS.email),
    phone: clean(body.phone, LIMITS.phone),
    address: clean(body.address, LIMITS.address),
    appliance: clean(body.appliance, LIMITS.appliance),
    details: clean(body.details, LIMITS.details),
  };

  // Server-side validation mirrors the client form.
  const missing: string[] = [];
  if (!data.firstName) missing.push("first name");
  if (!data.lastName) missing.push("last name");
  if (!data.email || !EMAIL_RE.test(data.email)) missing.push("a valid email");
  if (!data.phone) missing.push("phone number");
  if (!data.address) missing.push("service address");
  if (missing.length) {
    return NextResponse.json(
      { error: `Please provide ${missing.join(", ")}.` },
      { status: 422 }
    );
  }

  const notifyUrl = process.env.BOT_NOTIFY_URL || "http://localhost:8000/notify";
  const token = process.env.BOT_NOTIFY_TOKEN;

  try {
    const res = await fetch(notifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Notify-Token": token } : {}),
      },
      body: JSON.stringify(data),
      // Don't hang the user forever if the bot service is down.
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.error("Bot service responded with", res.status, await res.text().catch(() => ""));
      return NextResponse.json(
        { error: "We couldn't submit your request right now. Please call us instead." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Failed to reach bot service:", err);
    return NextResponse.json(
      { error: "We couldn't submit your request right now. Please call us instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

// Only POST is allowed; reject other verbs cleanly.
export function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
