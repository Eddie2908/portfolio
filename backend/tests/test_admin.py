"""Admin authorization tests (no DB required)."""


def test_admin_stats_no_auth(client):
    response = client.get("/api/admin/stats")
    assert response.status_code == 403


def test_admin_projects_no_auth(client):
    response = client.get("/api/admin/projects")
    assert response.status_code == 403


def test_admin_users_no_auth(client):
    response = client.get("/api/admin/users")
    assert response.status_code == 403


def test_admin_blog_no_auth(client):
    response = client.get("/api/admin/blog")
    assert response.status_code == 403


def test_admin_testimonials_no_auth(client):
    response = client.get("/api/admin/testimonials")
    assert response.status_code == 403


def test_admin_settings_no_auth(client):
    response = client.get("/api/admin/settings")
    assert response.status_code == 403


def test_admin_skills_no_auth(client):
    response = client.get("/api/admin/skills")
    assert response.status_code == 403


def test_admin_upload_no_auth(client):
    response = client.post("/api/admin/upload")
    assert response.status_code == 403


def test_editor_cannot_access_users(editor_token, client):
    """Editors should not be able to access the users management endpoint."""
    response = client.get("/api/admin/users", headers={"Authorization": f"Bearer {editor_token}"})
    assert response.status_code == 403


def test_editor_cannot_update_settings(editor_token, client):
    """Editors should not be able to modify site settings (super-admin only)."""
    response = client.put(
        "/api/admin/settings",
        json={},
        headers={"Authorization": f"Bearer {editor_token}"},
    )
    assert response.status_code == 403


def test_admin_create_user_rejects_weak_password(admin_token, client):
    """A weak password must be rejected the same way /auth/register rejects it."""
    response = client.post(
        "/api/admin/users",
        json={"name": "Test User", "email": "newuser@test.com", "password": "weak", "role": "editor"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 400
