import os
from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    # App
    APP_TITLE: str = "DevPortfolio API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    # JWT
    JWT_SECRET: str = ""
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    # CORS (comma-separated string in env, e.g. "http://a.com,http://b.com")
    ALLOWED_ORIGINS_STR: str = Field(
        default="http://localhost:3000,http://localhost:5500,http://127.0.0.1:5500",
        validation_alias="ALLOWED_ORIGINS",
    )

    @property
    def ALLOWED_ORIGINS(self) -> list[str]:
        return [x.strip() for x in self.ALLOWED_ORIGINS_STR.split(",") if x.strip()]

    # SMTP
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    CONTACT_EMAIL: str = ""

    # Base URL of the admin dashboard (used for notification links)
    ADMIN_URL: str = "http://localhost:5500/admin-dashboard"

    # Base URL of the Next.js frontend (used for password reset links)
    FRONTEND_URL: str = "http://localhost:3000"

    # Lifetime of a password reset token, in minutes
    RESET_TOKEN_EXPIRE_MINUTES: int = 60

    # Upload
    MAX_UPLOAD_SIZE_MB: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    def validate_required(self):
        if not self.JWT_SECRET:
            raise RuntimeError(
                "JWT_SECRET environment variable is required. "
                "Generate one with: python -c \"import secrets; print(secrets.token_hex(32))\""
            )
        if not self.SUPABASE_URL or not self.SUPABASE_KEY:
            raise RuntimeError("SUPABASE_URL and SUPABASE_KEY environment variables are required.")


settings = Settings()
settings.validate_required()
