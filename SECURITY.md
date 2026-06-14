# Security

A plain-language summary of how this site is protected, what's deliberately
**not** done (and why), and the one thing left for you to enable for full DDoS
protection.

## First, the honest part: you can't "hide the code" or "block the console"

The site's HTML/CSS/JS is downloaded into every visitor's browser — that's how
the web works. It can always be viewed (`view-source:`, disabling JS, a proxy,
`curl`, the DevTools protocol). Blocking right-click / F12 / the console is
trivially bypassed, breaks accessibility, and stops zero real attackers. So we
don't ship that theater.

**What actually matters:** nothing secret is ever in the browser. The Telegram
bot token, the broadcast secret, and the subscriber list live only on the
server (the bot service + server-side env vars). Viewing the front-end source
reveals only the public markup — there is nothing there to steal.

## What IS protected

### Secrets & data flow
- Bot token / `NOTIFY_TOKEN` / subscriber list: **server-side only**, never sent to the browser.
- The browser only ever calls our own `/api/request`; it never talks to the bot or Telegram directly.
- The bot's `/notify` endpoint is on Railway's **private network** (no public URL) and additionally requires the shared `NOTIFY_TOKEN`.

### HTTP security headers (`web/next.config.mjs`)
- **Content-Security-Policy** — locks resource loading to our origin + Google Fonts + the OpenStreetMap embed. Blocks injected/cross-site scripts (anti-XSS).
- **Strict-Transport-Security (HSTS)** — forces HTTPS for 2 years.
- **X-Frame-Options: DENY** + CSP `frame-ancestors 'none'` — anti-clickjacking (the site can't be embedded in an attacker's iframe).
- **X-Content-Type-Options: nosniff**, **Referrer-Policy**, **Permissions-Policy** (camera/mic/geo/etc. all disabled).
- `X-Powered-By` removed so we don't advertise the stack.

### Form / API abuse protection (`web/app/api/request/route.ts`)
- **Rate limiting** — max 5 submissions per minute per IP (HTTP 429 beyond that).
- **Body size cap** — requests over ~12 KB are rejected (HTTP 413).
- **Per-field length limits** — every field is trimmed/clamped server-side; the bot re-validates lengths too (`bot/main.py`).
- **Honeypot field** — a hidden `company` input catches automated spam bots; flagged submissions are silently dropped (never reach Telegram).
- **Server-side validation** — name/email/phone/address are validated again on the server, not just in the browser.
- Only `POST` is accepted; other methods get HTTP 405.

### Telegram bot
- Long-polling (no inbound webhook to attack).
- `/notify` validated with Pydantic + length caps + token check.
- Subscribers who block the bot are auto-pruned.

## The one thing left for full DDoS protection: put Cloudflare in front

Application-level rate limiting (above) stops abusive form spam, but it **cannot**
absorb a large volumetric DDoS — that has to be filtered before traffic reaches
the server. The standard, free way to get that:

1. Buy/keep the domain (Namecheap).
2. Add the domain to **Cloudflare** (free plan) and switch Namecheap's
   nameservers to the two Cloudflare gives you.
3. In Cloudflare, point a CNAME at the Railway domain (proxied — orange cloud).
4. Turn on: **"Under Attack" mode** when needed, **Bot Fight Mode**, **rate
   limiting rules**, and SSL mode **Full (strict)**.

This gives you a global CDN + WAF + automatic DDoS mitigation + bot filtering,
and hides the Railway origin behind Cloudflare's network. When you're ready,
tell me and I'll walk through the DNS/SSL setup alongside the custom domain.

## Optional next hardening (say the word)
- Swap the in-memory rate limiter for Redis if the web service scales beyond one instance.
- Add Cloudflare Turnstile (free, privacy-friendly CAPTCHA) to the form if spam ever gets through the honeypot.
- Tighten CSP further with per-request nonces (removes `'unsafe-inline'` for scripts).
