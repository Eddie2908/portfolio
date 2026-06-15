import os
from unittest.mock import MagicMock
import pytest
from fastapi.testclient import TestClient

# Ensure JWT_SECRET is set for tests before app imports
os.environ.setdefault("JWT_SECRET", "test-jwt-secret-for-testing-only")
os.environ.setdefault("SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("SUPABASE_KEY", "test-key")
os.environ.setdefault("RESEND_API_KEY", "")

from app.main import app
from app.utils.security import create_token
import app.database.connection as db_conn


@pytest.fixture(autouse=True)
def mock_supabase(monkeypatch):
    """Provide a MagicMock Supabase client so tests don't hit a real API."""
    mock_client = MagicMock()

    def _make_select(columns):
        m = MagicMock()
        # Default empty for .eq().execute() and .eq().limit(1).execute()
        m.eq.return_value.execute.return_value = MagicMock(data=[])
        m.eq.return_value.limit.return_value.execute.return_value = MagicMock(data=[])
        m.eq.return_value.single.return_value.execute.return_value = MagicMock(data=None)
        m.eq.return_value.order.return_value.execute.return_value = MagicMock(data=[])
        m.eq.return_value.order.return_value.range.return_value.execute.return_value = MagicMock(data=[])
        m.order.return_value.execute.return_value = MagicMock(data=[])
        m.order.return_value.range.return_value.execute.return_value = MagicMock(data=[])

        # Auth: get_current_user checks password_changed_at
        if columns == "password_changed_at":
            m.eq.return_value.limit.return_value.execute.return_value = MagicMock(data=[{"password_changed_at": None}])
        return m

    mock_client.table.return_value.select = MagicMock(side_effect=_make_select)
    mock_client.table.return_value.insert.return_value.execute.return_value = MagicMock(data=[])
    mock_client.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock(data=[])
    mock_client.table.return_value.delete.return_value.eq.return_value.execute.return_value = MagicMock(data=[])
    mock_client.storage.from_.return_value.upload.return_value = MagicMock()
    mock_client.storage.from_.return_value.get_public_url.return_value = "https://test.supabase.co/storage/v1/object/public/test.png"

    monkeypatch.setattr(db_conn, "_supabase", mock_client)
    yield mock_client


@pytest.fixture
def client():
    """Unauthenticated TestClient."""
    return TestClient(app)


@pytest.fixture
def admin_token():
    """JWT token for an admin user."""
    return create_token({"sub": "1", "email": "admin@test.com", "role": "admin", "pwd_at": None})


@pytest.fixture
def editor_token():
    """JWT token for an editor user."""
    return create_token({"sub": "2", "email": "editor@test.com", "role": "editor", "pwd_at": None})


@pytest.fixture
def auth_client(admin_token):
    """TestClient with admin Authorization header."""
    return TestClient(app, headers={"Authorization": f"Bearer {admin_token}"})
