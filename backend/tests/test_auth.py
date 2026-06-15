"""Authentication endpoint tests."""


def test_login_invalid_credentials(client):
    response = client.post("/api/auth/login", json={"email": "invalid@test.com", "password": "wrong"})
    assert response.status_code == 401
    assert "incorrect" in response.json()["detail"].lower() or "Email" in response.json()["detail"]


def test_login_missing_fields(client):
    response = client.post("/api/auth/login", json={"email": "test@test.com"})
    assert response.status_code == 422


def test_login_invalid_email_format(client):
    response = client.post("/api/auth/login", json={"email": "not-an-email", "password": "whatever"})
    assert response.status_code == 422


def test_protected_route_no_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 403


def test_register_no_auth(client):
    """Registration requires admin authentication."""
    response = client.post("/api/auth/register", json={
        "name": "Test",
        "email": "test@example.com",
        "password": "Abcdefg1",
    })
    assert response.status_code == 403


def test_change_password_no_auth(client):
    response = client.put("/api/auth/change-password", json={
        "current_password": "old",
        "new_password": "NewPass1",
    })
    assert response.status_code == 403


def test_reset_password_weak_password(client):
    """Reset with a weak password should be rejected."""
    response = client.post("/api/auth/reset-password", json={
        "token": "whatever",
        "new_password": "123",
    })
    assert response.status_code == 400


def test_forgot_password_invalid_email(client):
    response = client.post("/api/auth/forgot-password", json={"email": "not-an-email"})
    assert response.status_code == 422


def test_forgot_password_unknown_email(client):
    """Should return 200 even if email doesn't exist (prevents enumeration)."""
    response = client.post("/api/auth/forgot-password", json={"email": "unknown@example.com"})
    assert response.status_code == 200
