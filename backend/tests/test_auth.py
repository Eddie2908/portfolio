import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_login_invalid_credentials():
    response = client.post("/api/auth/login", json={"email": "invalid@test.com", "password": "wrong"})
    assert response.status_code == 401


def test_login_missing_fields():
    response = client.post("/api/auth/login", json={"email": "test@test.com"})
    assert response.status_code == 422


def test_protected_route_no_token():
    response = client.get("/api/auth/me")
    assert response.status_code == 403
