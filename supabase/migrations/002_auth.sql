-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'editor',
    status VARCHAR(20) DEFAULT 'active',
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add author foreign key to blog_posts
ALTER TABLE blog_posts
    ADD CONSTRAINT fk_blog_author
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create index on email for fast lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
