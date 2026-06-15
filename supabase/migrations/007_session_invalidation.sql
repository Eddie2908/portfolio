-- Session invalidation after password change.
-- When a user resets or changes their password, password_changed_at is updated.
-- Issued JWTs embed this timestamp; tokens issued before it are rejected.
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ;
