"""Testimonial route tests (no DB required)."""


def test_get_testimonials(client):
    response = client.get("/api/testimonials")
    assert response.status_code == 200


def test_submit_testimonial_name_too_short(client):
    response = client.post("/api/testimonials", json={
        "name": "A",
        "role": "Developer",
        "text": "This testimonial is long enough to pass validation.",
    })
    assert response.status_code == 422


def test_submit_testimonial_text_too_short(client):
    response = client.post("/api/testimonials", json={
        "name": "Alice",
        "role": "Developer",
        "text": "Short",
    })
    assert response.status_code == 422


def test_approve_testimonial_no_auth(client):
    response = client.patch("/api/testimonials/some-id/approve")
    assert response.status_code == 403


def test_reject_testimonial_no_auth(client):
    response = client.patch("/api/testimonials/some-id/reject")
    assert response.status_code == 403
