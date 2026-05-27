import logging
import aiosmtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger("portfolio_api")


async def send_notification_email(contact_data):
    if not all([settings.SMTP_USER, settings.SMTP_PASSWORD, settings.CONTACT_EMAIL]):
        logger.warning("SMTP not configured — skipping email notification")
        return

    msg = EmailMessage()
    msg["Subject"] = f"[Portfolio] Nouveau message : {contact_data.subject}"
    msg["From"] = settings.SMTP_USER
    msg["To"] = settings.CONTACT_EMAIL
    msg.set_content(
        f"Nouveau message de {contact_data.name} ({contact_data.email})\n\n"
        f"Sujet : {contact_data.subject}\n\n"
        f"Message :\n{contact_data.message}"
    )

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
            timeout=10,
        )
    except Exception as e:
        logger.error(f"Email send failed: {e}")
