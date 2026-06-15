"""Tests for security utilities (no external dependencies)."""

import pytest
from app.utils.security import (
    hash_password,
    verify_password,
    validate_password_strength,
    create_token,
    verify_token,
    generate_reset_token,
    hash_token,
)


class TestPasswordHashing:
    def test_hash_and_verify(self):
        pwd = "MySecureP@ss1"
        hashed = hash_password(pwd)
        assert verify_password(pwd, hashed) is True

    def test_verify_wrong_password(self):
        pwd = "MySecureP@ss1"
        hashed = hash_password(pwd)
        assert verify_password("wrong", hashed) is False

    def test_hash_is_different_each_time(self):
        pwd = "same_password"
        h1 = hash_password(pwd)
        h2 = hash_password(pwd)
        assert h1 != h2
        assert verify_password(pwd, h1) is True
        assert verify_password(pwd, h2) is True


class TestPasswordStrength:
    def test_too_short(self):
        assert validate_password_strength("Abc1") == "Le mot de passe doit contenir au moins 8 caractères"

    def test_no_uppercase(self):
        assert validate_password_strength("abcdefg1") == "Le mot de passe doit contenir au moins une majuscule"

    def test_no_lowercase(self):
        assert validate_password_strength("ABCDEFG1") == "Le mot de passe doit contenir au moins une minuscule"

    def test_no_digit(self):
        assert validate_password_strength("Abcdefgh") == "Le mot de passe doit contenir au moins un chiffre"

    def test_strong_password(self):
        assert validate_password_strength("Abcdefg1") is None
        assert validate_password_strength("MyP@ssw0rd") is None


class TestTokenLifecycle:
    def test_create_and_verify(self):
        token = create_token({"sub": "42", "role": "admin"})
        payload = verify_token(token)
        assert payload is not None
        assert payload["sub"] == "42"
        assert payload["role"] == "admin"
        assert "exp" in payload

    def test_verify_invalid_token(self):
        assert verify_token("not.a.valid.token") is None

    def test_verify_empty_token(self):
        assert verify_token("") is None


class TestResetToken:
    def test_generate_and_hash(self):
        raw = generate_reset_token()
        hashed = hash_token(raw)
        assert len(raw) > 20
        assert len(hashed) == 64  # SHA-256 hex length
        # Same token always hashes to same value
        assert hash_token(raw) == hashed

    def test_different_tokens_different_hashes(self):
        t1 = generate_reset_token()
        t2 = generate_reset_token()
        assert hash_token(t1) != hash_token(t2)
