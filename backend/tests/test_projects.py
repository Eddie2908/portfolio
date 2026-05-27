import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_projects():
    response = client.get("/api/projects/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_project_not_found():
    response = client.get("/api/projects/99999")
    assert response.status_code == 404


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "DevPortfolio API v1.0"


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
