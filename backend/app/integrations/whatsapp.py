import logging
import re
from typing import Any, Optional
from urllib.parse import quote

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


def normalize_whatsapp_number(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 10:
        return f"91{digits}"
    return digits


def build_whatsapp_deep_link(phone: str, message: str = "") -> str:
    normalized = normalize_whatsapp_number(phone)
    if message:
        return f"https://wa.me/{normalized}?text={quote(message)}"
    return f"https://wa.me/{normalized}"


def send_whatsapp_message(to_phone: str, message: str) -> dict[str, Any]:
    """Send a WhatsApp notification via configured Cloud API, or log in stub mode."""
    normalized = normalize_whatsapp_number(to_phone)
    if not (settings.whatsapp_api_url and settings.whatsapp_api_token and settings.whatsapp_phone_number_id):
        logger.info("WhatsApp integration not configured; skipping send to %s", normalized)
        return {
            "sent": False,
            "mode": "stub",
            "to": normalized,
            "deep_link": build_whatsapp_deep_link(normalized, message),
        }

    url = f"{settings.whatsapp_api_url.rstrip('/')}/{settings.whatsapp_phone_number_id}/messages"
    headers = {
        "Authorization": f"Bearer {settings.whatsapp_api_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": normalized,
        "type": "text",
        "text": {"body": message},
    }
    try:
        response = httpx.post(url, json=payload, headers=headers, timeout=10.0)
        response.raise_for_status()
        return {"sent": True, "mode": "api", "response": response.json()}
    except httpx.HTTPError as exc:
        logger.warning("Failed to send WhatsApp message to %s: %s", normalized, exc)
        return {"sent": False, "mode": "error", "error": str(exc)}
