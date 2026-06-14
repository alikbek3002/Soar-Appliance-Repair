# Deploying to Railway + Namecheap domain (US)

This deploys two Railway services in one project:

- **bot** — Python FastAPI + aiogram (private, no public URL)
- **web** — Next.js site (public, behind your custom domain)

The web service talks to the bot over Railway's **private network**, so the bot
token and subscriber list are never exposed to the internet.

```
Internet ──► web (Next.js, public)  ──private network──►  bot (FastAPI)  ──►  Telegram
                  ▲
          your Namecheap domain
```

---

## Prerequisites

- A Railway account (https://railway.com) — free trial works to start.
- Railway CLI installed (`npm i -g @railway/cli`) — already installed here (`railway --version`).
- Your Telegram bot token (already in `bot/.env`).

## Step 0 — Log in (interactive, one time)

In your terminal:

```bash
railway login
```

This opens a browser to authenticate. Everything after this can be scripted.

---

## Step 1 — Create the project and services

From the repo root:

```bash
railway init --name soar-appliance-repair      # creates project, links this dir
railway add --service bot                       # create the bot service
railway add --service web                       # create the web service
```

## Step 2 — Deploy the bot

```bash
cd bot
railway link --service bot                      # link this folder to the bot service
railway up                                      # build + deploy
```

Set the bot's variables (token + a shared secret + persistence):

```bash
# Required:
railway variable set TELEGRAM_BOT_TOKEN=<your-botfather-token> --service bot
# Fixed internal port so the web service can reference it:
railway variable set PORT=8000 --service bot
# Shared secret (use any long random string; reuse it for the web service):
railway variable set NOTIFY_TOKEN=<random-secret> --service bot
# Persist subscribers across redeploys:
railway variable set SUBSCRIBERS_FILE=/data/subscribers.json --service bot
railway volume add --service bot --mount-path /data
```

> Without the volume, `subscribers.json` is wiped on every redeploy and everyone
> would have to `/start` again.

## Step 3 — Deploy the web app

```bash
cd ../web
railway link --service web
railway domain --service web --port 8080         # generate a public *.up.railway.app URL
```

Set the web variables. `BOT_NOTIFY_URL` uses a **reference variable** that points
at the bot over the private network:

```bash
railway variable set "BOT_NOTIFY_URL=http://\${{bot.RAILWAY_PRIVATE_DOMAIN}}:8000/notify" --service web
railway variable set BOT_NOTIFY_TOKEN=<same-random-secret-as-bot> --service web
# Canonical URL for SEO (the railway URL now; swap to the real domain in Step 5):
railway variable set SITE_URL=https://<your-web>.up.railway.app --service web
railway up
```

> `SITE_URL` is resolved at **runtime**, so changing it just needs a restart/redeploy
> (no rebuild). If unset, the site falls back to Railway's `RAILWAY_PUBLIC_DOMAIN`.

## Step 4 — Subscribe + smoke test

1. Open your bot in Telegram and send **`/start`** (every team member who should
   receive requests does this once).
2. Open the web URL, submit the request form, confirm the message lands in Telegram.
3. Health check: `https://<your-web>.up.railway.app/api/request` is POST-only;
   the bot's `GET /health` is private.

---

## Step 5 — Custom domain on Namecheap

Buy your domain on Namecheap (e.g. `soarappliancerepair.com`). Then:

### 5a. Tell Railway about the domain

```bash
cd web
railway domain yourdomain.com --service web --port 8080
```

Railway prints the DNS target. Do this for **both** the apex (`yourdomain.com`)
and `www.yourdomain.com` if you want both — Railway gives you a CNAME target like
`abc123.up.railway.app` for each.

### 5b. Add the DNS records on Namecheap

In Namecheap: **Domain List → Manage → Advanced DNS**. Remove the default
"parking" records, then add what Railway gave you:

| Type        | Host  | Value (from Railway)              |
|-------------|-------|-----------------------------------|
| CNAME       | `www` | `<something>.up.railway.app`      |
| ALIAS/CNAME | `@`   | `<something>.up.railway.app`      |

Namecheap supports **CNAME on the apex via "ALIAS Record"** — use that for `@`.
If you prefer, point the apex to `www` with a URL redirect and only CNAME `www`.

Set Namecheap's nameservers to **"Namecheap BasicDNS"** (default) so Advanced DNS
records apply.

### 5c. Wait for SSL + update the canonical URL

- DNS propagation: usually minutes, up to a few hours. Railway auto-issues a
  Let's Encrypt certificate once it sees the records.
- Once live, rebake the canonical URL for SEO:

```bash
railway variable set SITE_URL=https://yourdomain.com --service web
railway up
```

---

## Step 6 — US SEO finishing touches (after the domain is live)

The site already ships: US-targeted metadata, `geo.*` meta tags, an `en-US`
canonical, `LocalBusiness` JSON-LD (Streamwood + Chicago area), `sitemap.xml`,
`robots.txt`, a generated Open Graph image, and a web manifest.

To maximize US/local ranking:

1. **Google Business Profile** — create/claim a listing for Soar Appliance Repair
   at the Streamwood address. This is the single biggest factor for local US
   search and Maps.
2. **Google Search Console** (https://search.google.com/search-console) — add
   `https://yourdomain.com`, verify (DNS TXT on Namecheap or the HTML tag), and
   submit `https://yourdomain.com/sitemap.xml`.
3. **Bing Webmaster Tools** — same, for Bing/DuckDuckGo coverage.
4. Confirm the rich result: paste your URL into
   https://search.google.com/test/rich-results to validate the LocalBusiness markup.

---

## Useful commands

```bash
railway status                       # what's linked
railway logs --service web           # web logs
railway logs --service bot           # bot logs
railway variable list --service web  # inspect vars
railway open                         # open the project dashboard
```
