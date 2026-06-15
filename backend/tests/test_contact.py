"""Contact form validation tests (no DB required)."""


def test_send_message_name_too_short(client):
    response = client.post("/api/contact", json={
        "name": "A",
        "email": "test@example.com",
        "subject": "Hello",
        "message": "This is a valid message body that is long enough.",
    })
    assert response.status_code == 422


def test_send_message_message_too_short(client):
    response = client.post("/api/contact", json={
        "name": "Alice",
        "email": "test@example.com",
        "subject": "Hello",
        "message": "Short",
    })
    assert response.status_code == 422


def test_send_message_invalid_email(client):
    response = client.post("/api/contact", json={
        "name": "Alice",
        "email": "not-an-email",
        "subject": "Hello",
        "message": "This is a valid message body that is long enough.",
    })
    assert response.status_code == 422


def test_send_message_missing_field(client):
    response = client.post("/api/contact", json={
        "name": "Alice",
        "email": "test@example.com",
        "message": "This is a valid message body that is long enough.",
    })
    assert response.status_code == 422


def test_get_messages_no_auth(client):
    response = client.get("/api/contact")
    assert response.status_code == 403


def test_mark_read_no_auth(client):
    response = client.patch("/api/contact/some-id/read")
    assert response.status_code == 403
