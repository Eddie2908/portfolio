import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_admin_stats_no_auth():
    response = client.get("/api/admin/stats")
    assert response.status_code == 403


def test_admin_projects_no_auth():
    response = client.get("/api/admin/projects")
    assert response.status_code == 403


def test_admin_users_no_auth():
    response = client.get("/api/admin/users")
    assert response.status_code == 403
