"""Public endpoint tests (no DB required)."""


def test_get_projects(client):
    response = client.get("/api/projects")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_project_not_found(client):
    response = client.get("/api/projects/99999")
    assert response.status_code == 404


def test_get_skills(client):
    response = client.get("/api/skills")
    assert response.status_code == 200


def test_get_blog_posts(client):
    response = client.get("/api/blog")
    assert response.status_code == 200


def test_get_blog_post_not_found(client):
    response = client.get("/api/blog/nonexistent-slug")
    assert response.status_code == 404


def test_get_testimonials(client):
    response = client.get("/api/testimonials")
    assert response.status_code == 200


def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "DevPortfolio API" in response.json()["message"]


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_api_profile(client):
    response = client.get("/api/profile")
    assert response.status_code == 200
