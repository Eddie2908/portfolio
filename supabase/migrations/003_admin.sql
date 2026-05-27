-- Admin activity log
CREATE TABLE IF NOT EXISTS admin_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table for token tracking
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for admin tables
CREATE INDEX IF NOT EXISTS idx_activity_user ON admin_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON admin_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- RLS policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (status = 'published');
CREATE POLICY "Public read blog" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);
