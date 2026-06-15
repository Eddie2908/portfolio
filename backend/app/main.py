from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.exceptions import global_exception_handler, http_exception_handler
from app.api.routes import projects, contact, auth, testimonials, blog, admin, skills
from app.middleware.rate_limit import limiter
from app.middleware.logger import log_middleware
from app.middleware.security_headers import security_headers_middleware

# Optional error monitoring: only enabled when SENTRY_DSN is configured.
if settings.SENTRY_DSN:
    import sentry_sdk

    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.SENTRY_ENVIRONMENT,
        traces_sample_rate=settings.SENTRY_TRACES_SAMPLE_RATE,
        send_default_pii=False,
    )

app = FastAPI(
    title=settings.APP_TITLE,
    description="API REST pour le portfolio développeur",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    redirect_slashes=False,
)

# Exception handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middleware (order matters: last added = first executed)
app.add_middleware(BaseHTTPMiddleware, dispatch=security_headers_middleware)
app.add_middleware(BaseHTTPMiddleware, dispatch=log_middleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (local uploads)
Path("static/uploads").mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(testimonials.router, prefix="/api/testimonials", tags=["Testimonials"])
app.include_router(blog.router, prefix="/api/blog", tags=["Blog"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])


@app.get("/", tags=["Root"])
async def root():
    return {"message": f"{settings.APP_TITLE} v{settings.APP_VERSION}", "docs": "/docs"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}


@app.get("/api/profile", tags=["Profile"])
def get_profile():
    from app.database.connection import get_supabase
    supabase = get_supabase()
    response = supabase.table("settings").select("*").eq("id", 1).single().execute()
    return response.data or {}
