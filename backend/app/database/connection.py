import threading
from supabase import create_client, Client

from app.core.config import settings

_supabase: Client = None
_lock = threading.Lock()


def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        with _lock:
            if _supabase is None:
                _supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _supabase
