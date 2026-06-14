"""Persistent storage of Telegram subscribers (chat IDs).

Subscribers are everyone who has started the bot. Every incoming repair
request is broadcast to all of them. Stored as a simple JSON file guarded by
an asyncio lock so concurrent /notify and command handlers stay consistent.
"""

from __future__ import annotations

import asyncio
import json
import os
from pathlib import Path
from typing import Dict

_DEFAULT_PATH = Path(__file__).with_name("subscribers.json")
_PATH = Path(os.getenv("SUBSCRIBERS_FILE", _DEFAULT_PATH))
_lock = asyncio.Lock()


def _read() -> Dict[str, dict]:
    if not _PATH.exists():
        return {}
    try:
        with _PATH.open("r", encoding="utf-8") as fh:
            data = json.load(fh)
            return data if isinstance(data, dict) else {}
    except (json.JSONDecodeError, OSError):
        return {}


def _write(data: Dict[str, dict]) -> None:
    _PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = _PATH.with_name(_PATH.name + ".tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
    tmp.replace(_PATH)


async def add(chat_id: int, info: dict | None = None) -> bool:
    """Subscribe a chat. Returns True if it was newly added."""
    async with _lock:
        data = _read()
        key = str(chat_id)
        is_new = key not in data
        data[key] = {"chat_id": chat_id, **(info or {})}
        _write(data)
        return is_new


async def remove(chat_id: int) -> bool:
    """Unsubscribe a chat. Returns True if it was present."""
    async with _lock:
        data = _read()
        existed = data.pop(str(chat_id), None) is not None
        if existed:
            _write(data)
        return existed


async def chat_ids() -> list[int]:
    async with _lock:
        return [entry["chat_id"] for entry in _read().values()]


async def count() -> int:
    async with _lock:
        return len(_read())
