"""Email service using Resend API (HTTP) instead of SMTP.

This solves the Railway SMTP blocking issue since HTTP/HTTPS (port 443)
is never blocked, unlike SMTP ports (587, 465, 25).

Sign up at https://resend.com (free tier: 3000 emails/month)
Get your API key from the dashboard and add to Railway as RESEND_API_KEY
"""

import logging
import html
from email.message import EmailMessage

import httpx
from app.core.config import settings

logger = logging.getLogger("portfolio_api")

RESEND_API_URL = "https://api.resend.com/emails"


async def diagnose_resend() -> dict:
    """Test the Resend API configuration and return a status report."""
    report = {
        "resend_api_key_set": bool(settings.RESEND_API_KEY),
        "resend_from_email": settings.RESEND_FROM_EMAIL or "onboarding@resend.dev (default)",
        "connection": "not_tested",
        "error": None,
    }

    if not settings.RESEND_API_KEY:
        report["connection"] = "skipped"
        report["error"] = "RESEND_API_KEY manquant"
        return report

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Test API key validity by calling the domains endpoint
            response = await client.get(
                "https://api.resend.com/domains",
                headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
            )
            if response.status_code == 200:
                report["connection"] = "success"
            elif response.status_code == 401:
                report["connection"] = "failed"
                report["error"] = "Clé API invalide (401 Unauthorized)"
            else:
                report["connection"] = "failed"
                report["error"] = f"Erreur API: {response.status_code}"
    except Exception as e:
        report["connection"] = "failed"
        report["error"] = f"{type(e).__name__}: {e}"

    return report


async def _send_via_resend(to_email: str, subject: str, html_body: str, text_body: str = None) -> bool:
    """Send email via Resend HTTP API. Falls back to SMTP if Resend not configured."""
    if not settings.RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured — falling back to SMTP")
        return False

    payload = {
        "from": settings.RESEND_FROM_EMAIL or f"Portfolio <onboarding@resend.dev>",
        "to": [to_email],
        "subject": subject,
        "html": html_body,
    }
    if text_body:
        payload["text"] = text_body

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                RESEND_API_URL,
                headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
                json=payload,
            )
            if response.status_code == 200:
                logger.info(f"Email sent via Resend to {to_email}")
                return True
            else:
                logger.error(f"Resend API error: {response.status_code} - {response.text}")
                return False
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        return False


def _email_wrapper(title: str, body_html: str, button_label: str = "", button_url: str = "") -> str:
    """Wrap email content in a consistent, responsive HTML template."""
    button = ""
    if button_label and button_url:
        button = (
            f'<p style="text-align:center;margin:32px 0">'
            f'<a href="{button_url}" style="background:#3b82f6;color:#fff;padding:12px 24px;'
            f'border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">'
            f'{button_label}</a></p>'
        )
    return f"""\
<div style="background:#f3f4f6;padding:24px 0;font-family:Inter,Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:linear-gradient(135deg,#5865f5,#c344f0);padding:20px 28px">
      <h1 style="margin:0;color:#ffffff;font-size:18px;font-weight:700">DevPortfolio</h1>
    </div>
    <div style="padding:28px;color:#111827">
      <h2 style="margin:0 0 16px;font-size:18px;color:#111827">{title}</h2>
      {body_html}
      {button}
    </div>
    <div style="padding:16px 28px;background:#f9fafb;border-top:1px solid #e5e7eb">
      <p style="margin:0;color:#9ca3af;font-size:12px">Notification automatique du portfolio. Ne pas répondre à cet email.</p>
    </div>
  </div>
</div>"""


async def send_notification_email_resend(contact_data) -> bool:
    """Send contact notification via Resend API."""
    name = html.escape(contact_data.name)
    email = html.escape(contact_data.email)
    subject = html.escape(contact_data.subject)
    message = html.escape(contact_data.message).replace("\n", "<br>")

    body_html = (
        f'<p style="margin:0 0 16px;color:#374151">Vous avez reçu un nouveau message via le formulaire de contact.</p>'
        f'<table style="width:100%;border-collapse:collapse;font-size:14px;color:#111827">'
        f'<tr><td style="padding:6px 0;color:#6b7280;width:90px">De</td><td style="padding:6px 0"><strong>{name}</strong></td></tr>'
        f'<tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:{email}" style="color:#3b82f6;text-decoration:none">{email}</a></td></tr>'
        f'<tr><td style="padding:6px 0;color:#6b7280">Sujet</td><td style="padding:6px 0">{subject}</td></tr>'
        f'</table>'
        f'<div style="margin-top:16px;padding:16px;background:#f9fafb;border-left:3px solid #3b82f6;border-radius:6px;color:#374151;font-size:14px">{message}</div>'
    )

    html_content = _email_wrapper(
        "Nouveau message de contact",
        body_html,
        "Voir dans le dashboard",
        f"{settings.ADMIN_URL}/pages/messages.html",
    )

    text_content = (
        f"Nouveau message de {contact_data.name} ({contact_data.email})\n\n"
        f"Sujet : {contact_data.subject}\n\n"
        f"Message :\n{contact_data.message}"
    )

    return await _send_via_resend(
        settings.CONTACT_EMAIL,
        f"[Portfolio] Nouveau message : {contact_data.subject}",
        html_content,
        text_content,
    )


async def send_testimonial_notification_email_resend(testimonial_data) -> bool:
    """Send testimonial notification via Resend API."""
    name = html.escape(testimonial_data.name)
    role = html.escape(testimonial_data.role)
    text = html.escape(testimonial_data.text).replace("\n", "<br>")

    body_html = (
        f'<p style="margin:0 0 16px;color:#374151">Un nouveau témoignage a été soumis et attend votre validation.</p>'
        f'<table style="width:100%;border-collapse:collapse;font-size:14px;color:#111827">'
        f'<tr><td style="padding:6px 0;color:#6b7280;width:130px">Nom</td><td style="padding:6px 0"><strong>{name}</strong></td></tr>'
        f'<tr><td style="padding:6px 0;color:#6b7280">Rôle / Entreprise</td><td style="padding:6px 0">{role}</td></tr>'
        f'</table>'
        f'<div style="margin-top:16px;padding:16px;background:#f9fafb;border-left:3px solid #22c55e;border-radius:6px;color:#374151;font-size:14px;font-style:italic">&laquo; {text} &raquo;</div>'
    )

    html_content = _email_wrapper(
        "Nouveau témoignage à valider",
        body_html,
        "Approuver / Rejeter",
        f"{settings.ADMIN_URL}/pages/testimonials.html",
    )

    text_content = (
        f"Un nouveau témoignage a été soumis.\n\n"
        f"Nom : {testimonial_data.name}\n"
        f"Rôle : {testimonial_data.role}\n\n"
        f"Témoignage :\n{testimonial_data.text}"
    )

    return await _send_via_resend(
        settings.CONTACT_EMAIL,
        f"[Portfolio] Nouveau témoignage de {testimonial_data.name}",
        html_content,
        text_content,
    )


async def send_password_reset_email_resend(to_email: str, name: str, reset_link: str) -> bool:
    """Send password reset email via Resend API."""
    minutes = settings.RESET_TOKEN_EXPIRE_MINUTES

    html_content = f"""\
<div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;color:#111827">
  <h2 style="color:#111827">Réinitialisation du mot de passe</h2>
  <p>Bonjour {name},</p>
  <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.</p>
  <p style="text-align:center;margin:32px 0">
    <a href="{reset_link}" style="background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
      Réinitialiser mon mot de passe
    </a>
  </p>
  <p style="color:#6b7280;font-size:13px">Ce lien est valable {minutes} minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
  <p style="color:#9ca3af;font-size:12px;word-break:break-all">{reset_link}</p>
</div>"""

    text_content = (
        f"Bonjour {name},\n\n"
        f"Vous avez demandé la réinitialisation de votre mot de passe.\n"
        f"Cliquez sur le lien suivant pour en choisir un nouveau (valable {minutes} minutes) :\n\n"
        f"{reset_link}\n\n"
        f"Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email."
    )

    return await _send_via_resend(
        to_email,
        "[Portfolio] Réinitialisation de votre mot de passe",
        html_content,
        text_content,
    )
