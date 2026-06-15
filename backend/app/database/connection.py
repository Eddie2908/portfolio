import threading
from typing import Callable, TypeVar

from starlette.concurrency import run_in_threadpool
from supabase import create_client, Client

from app.core.config import settings

_supabase: Client = None
_lock = threading.Lock()

T = TypeVar("T")


def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        with _lock:
            if _supabase is None:
                _supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _supabase


async def run_db(fn: Callable[[], T]) -> T:
    """Run a blocking Supabase call in a threadpool to avoid blocking the event loop.

    The Supabase Python client is synchronous; calling it directly inside an
    async route blocks the event loop and kills concurrency under load.

    Usage:
        supabase = get_supabase()
        response = await run_db(lambda: supabase.table("x").select("*").execute())
    """
    return await run_in_threadpool(fn)
