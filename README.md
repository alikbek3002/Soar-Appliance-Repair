# Soar Appliance Repair

On-site appliance repair company site (Streamwood, IL). A Next.js marketing
site with a repair-request form, plus a Python Telegram bot that delivers every
submitted request to **all** team members who have started the bot.

```
┌────────────┐   POST /api/request   ┌──────────────┐   POST /notify   ┌──────────────┐
│  Browser   │ ────────────────────► │  Next.js     │ ───────────────► │  Python bot  │
│  (form)    │                       │  API route   │                  │  (FastAPI)   │
└────────────┘                       └──────────────┘                  └──────┬───────┘
                                                                               │ broadcast
                                                                               ▼
                                                                       ┌──────────────┐
                                                                       │  Telegram     │
                                                                       │  subscribers  │
                                                                       └──────────────┘
```

Two parts:

- **`web/`** — Next.js (App Router, TypeScript) site that recreates the approved
  design. The request form posts to `/api/request`, which forwards to the bot.
- **`bot/`** — Python service (FastAPI + aiogram). The bot subscribes anyone who
  sends `/start`; the `POST /notify` endpoint broadcasts each repair request to
  every subscriber.

---

## 1. Set up the Telegram bot

1. Open [@BotFather](https://t.me/BotFather) in Telegram, send `/newbot`, follow
   the prompts, and copy the **bot token**.
2. Configure and run the service:

   ```bash
   cd bot
   python -m venv .venv
   # Windows:  .venv\Scripts\activate
   # macOS/Linux:  source .venv/bin/activate
   pip install -r requirements.txt

   cp .env.example .env        # then edit .env
   # set TELEGRAM_BOT_TOKEN=...
   # optionally set NOTIFY_TOKEN to a shared secret

   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

3. In Telegram, open your new bot and send **`/start`**. Every person who wants
   to receive repair requests does this once. They can `/stop` to unsubscribe and
   `/status` to check.

Subscribers are stored in `bot/subscribers.json`.

## 2. Run the website

```bash
cd web
npm install

cp .env.example .env.local     # then edit if needed
# BOT_NOTIFY_URL defaults to http://localhost:8000/notify
# if you set NOTIFY_TOKEN in the bot, set BOT_NOTIFY_TOKEN to the same value here

npm run dev                    # http://localhost:3000
```

Submit the request form — the filled-in details land in the Telegram chats of
everyone who started the bot.

---

## How it fits together

- The browser only ever talks to the Next.js API route, so the bot token and
  subscriber list are never exposed to the client.
- `web/app/api/request/route.ts` re-validates the submission and forwards it to
  the bot's `/notify` endpoint (10s timeout; friendly error if the bot is down).
- `bot/main.py` runs the aiogram long-poller and the FastAPI server in one
  process. `/notify` formats the request and broadcasts it; subscribers who have
  blocked the bot are pruned automatically.

## Deployment

See **[DEPLOY.md](DEPLOY.md)** for a full Railway deploy walkthrough (two services
over private networking) plus connecting a Namecheap custom domain and the US SEO
follow-ups (Google Business Profile, Search Console, sitemap submission).

## Production notes

- Set a `NOTIFY_TOKEN` in the bot **and** the matching `BOT_NOTIFY_TOKEN` in the
  web app so only your site can trigger broadcasts.
- Point `BOT_NOTIFY_URL` at wherever the bot is hosted (e.g.
  `https://bot.yourdomain.com/notify`). Keep the bot's port private/internal.
- For durability across deploys, mount `bot/subscribers.json` on a persistent
  volume (or swap `storage.py` for a real database).
- The hero photo is a free-licensed Pexels image at `web/public/hero.jpg`.
  Swap in your own on-site/technician photo any time by replacing that file
  (keep it roughly landscape; it's `object-fit: cover` in `.hero-frame`).
- Service cards become a horizontal swipe slider on phones (≤860px) and a grid
  on larger screens; the layout is responsive down to ~320px.
