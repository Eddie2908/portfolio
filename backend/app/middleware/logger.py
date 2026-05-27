import time
import logging
from fastapi import Request

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("portfolio_api")

EXCLUDED_PATHS = {"/health", "/docs", "/redoc", "/openapi.json"}


async def log_middleware(request: Request, call_next):
    if request.url.path in EXCLUDED_PATHS:
        return await call_next(request)

    start = time.time()
    response = await call_next(request)
    duration = time.time() - start

    log_line = f"{request.method} {request.url.path} → {response.status_code} ({duration:.3f}s)"
    if response.status_code >= 500:
        logger.error(log_line)
    elif response.status_code >= 400:
        logger.warning(log_line)
    else:
        logger.info(log_line)

    return response
