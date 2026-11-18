import logging
import smtplib
from email.message import EmailMessage
from typing import Any, Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_email(to_email: str, subject: str, body: str, html_body: Optional[str] = None) -> dict[str, Any]:
    """Send an email via configured SMTP server, or return stub status when unconfigured."""
    if not (settings.smtp_host and settings.smtp_user and settings.smtp_password):
        logger.info("SMTP not configured; skipping email to %s (%s)", to_email, subject)
        return {"sent": False, "mode": "stub", "to": to_email, "subject": subject}

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from_email
    msg["To"] = to_email
    msg.set_content(body)
    if html_body:
        msg.add_alternative(html_body, subtype="html")

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            if settings.smtp_use_tls:
                server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
        return {"sent": True, "mode": "smtp", "to": to_email}
    except Exception as exc:
        logger.warning("Failed to send email to %s: %s", to_email, exc)
        return {"sent": False, "mode": "error", "error": str(exc)}


def send_appointment_email(
    to_email: Optional[str],
    customer_name: str,
    service: str,
    preferred_date: str,
    preferred_time: str,
    status: str = "pending",
) -> dict[str, Any]:
    if not to_email:
        return {"sent": False, "mode": "skipped", "reason": "No customer email provided"}

    subject = f"Pooja Makeover - Appointment {status.capitalize()} ({service})"
    body = (
        f"Hello {customer_name},\n\n"
        f"Your appointment request for {service} on {preferred_date} at {preferred_time} "
        f"is currently '{status}'.\n\n"
        "Thank you for choosing Pooja Makeover!\n"
    )
    return send_email(to_email=to_email, subject=subject, body=body)
