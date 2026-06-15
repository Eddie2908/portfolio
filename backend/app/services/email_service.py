import html
import logging
import aiosmtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger("portfolio_api")


async def diagnose_smtp() -> dict:
    """Test the SMTP connection and return a detailed status report.

    Used to debug email delivery issues in production (e.g. Railway blocking
    SMTP ports, revoked Gmail App Password, missing env vars).
    """
    report = {
        "smtp_host": settings.SMTP_HOST,
        "smtp_port": settings.SMTP_PORT,
        "smtp_user_set": bool(settings.SMTP_USER),
        "smtp_password_set": bool(settings.SMTP_PASSWORD),
        "contact_email_set": bool(settings.CONTACT_EMAIL),
        "connection": "not_tested",
        "error": None,
    }

    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        report["connection"] = "skipped"
        report["error"] = "SMTP_USER ou SMTP_PASSWORD manquant"
        return report

    try:
        client = aiosmtplib.SMTP(
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            timeout=15,
        )
        await client.connect(start_tls=True)
        await client.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        await client.quit()
        report["connection"] = "success"
    except Exception as e:
        report["connection"] = "failed"
        report["error"] = f"{type(e).__name__}: {e}"

    return report


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

    name = html.escape(contact_data.name)
    email = html.escape(contact_data.email)
    subject = html.escape(contact_data.subject)
    message = html.escape(contact_data.message).replace("\n", "<br>")
    body = (
        f'<p style="margin:0 0 16px;color:#374151">Vous avez reçu un nouveau message via le formulaire de contact.</p>'
        f'<table style="width:100%;border-collapse:collapse;font-size:14px;color:#111827">'
        f'<tr><td style="padding:6px 0;color:#6b7280;width:90px">De</td><td style="padding:6px 0"><strong>{name}</strong></td></tr>'
        f'<tr><td style="padding:6px 0;color:#6b7280">Email</td><td style="padding:6px 0"><a href="mailto:{email}" style="color:#3b82f6;text-decoration:none">{email}</a></td></tr>'
        f'<tr><td style="padding:6px 0;color:#6b7280">Sujet</td><td style="padding:6px 0">{subject}</td></tr>'
        f'</table>'
        f'<div style="margin-top:16px;padding:16px;background:#f9fafb;border-left:3px solid #3b82f6;border-radius:6px;color:#374151;font-size:14px">{message}</div>'
    )
    msg.add_alternative(
        _email_wrapper(
            "Nouveau message de contact",
            body,
            "Voir dans le dashboard",
            f"{settings.ADMIN_URL}/messages",
        ),
        subtype="html",
    )

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
            timeout=20,
        )
    except Exception as e:
        logger.error(f"Email send failed: {e}")


async def send_testimonial_notification_email(testimonial_data):
    """Notify the admin by email when a new testimonial is submitted."""
    if not all([settings.SMTP_USER, settings.SMTP_PASSWORD, settings.CONTACT_EMAIL]):
        logger.warning("SMTP not configured — skipping testimonial notification")
        return

    msg = EmailMessage()
    msg["Subject"] = f"[Portfolio] Nouveau témoignage de {testimonial_data.name}"
    msg["From"] = settings.SMTP_USER
    msg["To"] = settings.CONTACT_EMAIL
    msg.set_content(
        f"Un nouveau témoignage a été soumis et attend votre validation.\n\n"
        f"Nom : {testimonial_data.name}\n"
        f"Rôle / Entreprise : {testimonial_data.role}\n\n"
        f"Témoignage :\n{testimonial_data.text}\n\n"
        f"Connectez-vous au dashboard admin pour l'approuver ou le rejeter."
    )

    name = html.escape(testimonial_data.name)
    role = html.escape(testimonial_data.role)
    text = html.escape(testimonial_data.text).replace("\n", "<br>")
    body = (
        f'<p style="margin:0 0 16px;color:#374151">Un nouveau témoignage a été soumis et attend votre validation.</p>'
        f'<table style="width:100%;border-collapse:collapse;font-size:14px;color:#111827">'
        f'<tr><td style="padding:6px 0;color:#6b7280;width:130px">Nom</td><td style="padding:6px 0"><strong>{name}</strong></td></tr>'
        f'<tr><td style="padding:6px 0;color:#6b7280">Rôle / Entreprise</td><td style="padding:6px 0">{role}</td></tr>'
        f'</table>'
        f'<div style="margin-top:16px;padding:16px;background:#f9fafb;border-left:3px solid #22c55e;border-radius:6px;color:#374151;font-size:14px;font-style:italic">&laquo; {text} &raquo;</div>'
    )
    msg.add_alternative(
        _email_wrapper(
            "Nouveau témoignage à valider",
            body,
            "Approuver / Rejeter",
            f"{settings.ADMIN_URL}/testimonials",
        ),
        subtype="html",
    )

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
            timeout=20,
        )
    except Exception as e:
        logger.error(f"Testimonial notification email failed: {e}")


async def send_password_reset_email(to_email: str, name: str, reset_link: str):
    """Send a password reset link to an admin user via Gmail SMTP."""
    if not all([settings.SMTP_USER, settings.SMTP_PASSWORD]):
        logger.warning("SMTP not configured — cannot send password reset email")
        raise RuntimeError("Service d'email non configuré")

    minutes = settings.RESET_TOKEN_EXPIRE_MINUTES

    msg = EmailMessage()
    msg["Subject"] = "[Portfolio] Réinitialisation de votre mot de passe"
    msg["From"] = settings.SMTP_USER
    msg["To"] = to_email
    msg.set_content(
        f"Bonjour {name},\n\n"
        f"Vous avez demandé la réinitialisation de votre mot de passe.\n"
        f"Cliquez sur le lien suivant pour en choisir un nouveau (valable {minutes} minutes) :\n\n"
        f"{reset_link}\n\n"
        f"Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email."
    )
    msg.add_alternative(
        f"""\
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
</div>""",
        subtype="html",
    )

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
            timeout=20,
        )
    except Exception as e:
        logger.error(f"Password reset email send failed: {e}")
        raise RuntimeError("Échec de l'envoi de l'email")
