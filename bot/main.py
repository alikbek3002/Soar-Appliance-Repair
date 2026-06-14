"""Soar Appliance Repair — Telegram bot + notification API.

Runs two things in one process:

1. An aiogram bot. Anyone who sends /start is subscribed; every repair request
   that comes in is broadcast to all subscribers.
2. A FastAPI app exposing POST /notify, which the Next.js site calls when a
   visitor submits the request form.

Start with:  uvicorn main:app --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import asyncio
import html
import logging
import os
from contextlib import asynccontextmanager

from aiogram import Bot, Dispatcher, Router
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.exceptions import TelegramForbiddenError
from aiogram.filters import Command, CommandStart
from aiogram.types import Message
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

import storage

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("soar-bot")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
NOTIFY_TOKEN = os.getenv("NOTIFY_TOKEN", "").strip()

if not BOT_TOKEN:
    raise RuntimeError("TELEGRAM_BOT_TOKEN is not set. Copy .env.example to .env and fill it in.")

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()
router = Router()
dp.include_router(router)


# ── Bot commands ───────────────────────────────────────────────────────────

WELCOME = (
    "👋 <b>Welcome to Soar Appliance Repair</b>\n\n"
    "You're now subscribed. Every repair request submitted on the website will "
    "be delivered to you here.\n\n"
    "Commands:\n"
    "/stop — stop receiving requests\n"
    "/status — check subscription status"
)


@router.message(CommandStart())
async def on_start(message: Message) -> None:
    chat = message.chat
    is_new = await storage.add(
        chat.id,
        {
            "username": chat.username,
            "first_name": chat.first_name,
            "last_name": chat.last_name,
            "type": chat.type,
        },
    )
    text = WELCOME if is_new else "✅ You're already subscribed to repair requests."
    await message.answer(text)


@router.message(Command("stop"))
async def on_stop(message: Message) -> None:
    existed = await storage.remove(message.chat.id)
    if existed:
        await message.answer("🛑 You've been unsubscribed. Send /start any time to resume.")
    else:
        await message.answer("You weren't subscribed. Send /start to subscribe.")


@router.message(Command("status"))
async def on_status(message: Message) -> None:
    ids = await storage.chat_ids()
    subscribed = message.chat.id in ids
    total = len(ids)
    state = "subscribed ✅" if subscribed else "not subscribed ❌"
    await message.answer(f"You are <b>{state}</b>.\nTotal subscribers receiving requests: {total}")


# ── Broadcast ───────────────────────────────────────────────────────────────

def format_request(req: "RepairRequest") -> str:
    rows = [
        ("👤 Name", f"{req.firstName} {req.lastName}".strip()),
        ("📧 Email", req.email),
        ("📞 Phone", req.phone),
        ("📍 Address", req.address),
        ("🔧 Appliance", req.appliance or "—"),
    ]
    lines = ["🛠 <b>New Repair Request</b>", ""]
    for label, value in rows:
        lines.append(f"{label}: {html.escape(value)}")
    if req.details:
        lines.append("")
        lines.append("📝 <b>Details</b>")
        lines.append(html.escape(req.details))
    return "\n".join(lines)


async def broadcast(text: str) -> dict:
    ids = await storage.chat_ids()
    sent, failed = 0, 0
    for chat_id in ids:
        try:
            await bot.send_message(chat_id, text, disable_web_page_preview=True)
            sent += 1
        except TelegramForbiddenError:
            # User blocked the bot or deleted the chat — prune them.
            await storage.remove(chat_id)
            failed += 1
            log.info("Pruned subscriber %s (blocked the bot)", chat_id)
        except Exception as exc:  # noqa: BLE001 - keep broadcasting to the rest
            failed += 1
            log.warning("Failed to send to %s: %s", chat_id, exc)
    return {"recipients": len(ids), "sent": sent, "failed": failed}


# ── FastAPI app ──────────────────────────────────────────────────────────────

class RepairRequest(BaseModel):
    firstName: str = Field(min_length=1, max_length=80)
    lastName: str = Field(min_length=1, max_length=80)
    email: str = Field(min_length=3, max_length=160)
    phone: str = Field(min_length=1, max_length=40)
    address: str = Field(min_length=1, max_length=200)
    appliance: str = Field(default="", max_length=60)
    details: str = Field(default="", max_length=2000)


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Run bot long-polling alongside the web server.
    await bot.delete_webhook(drop_pending_updates=True)
    polling = asyncio.create_task(dp.start_polling(bot, handle_signals=False))
    log.info("Bot polling started.")
    try:
        yield
    finally:
        polling.cancel()
        try:
            await polling
        except asyncio.CancelledError:
            pass
        await bot.session.close()
        log.info("Bot polling stopped.")


app = FastAPI(title="Soar Appliance Repair Bot", lifespan=lifespan)


@app.get("/health")
async def health() -> dict:
    return {"ok": True, "subscribers": await storage.count()}


@app.post("/notify")
async def notify(req: RepairRequest, x_notify_token: str | None = Header(default=None)) -> dict:
    if NOTIFY_TOKEN and x_notify_token != NOTIFY_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid notify token.")

    result = await broadcast(format_request(req))
    log.info("Broadcast result: %s", result)

    if result["recipients"] == 0:
        # Nobody has started the bot yet — surface that loudly so requests aren't silently lost.
        raise HTTPException(
            status_code=503,
            detail="No Telegram subscribers yet. Send /start to the bot first.",
        )
    return {"ok": True, **result}
