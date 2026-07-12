-- Enable RLS on tables that hold sensitive data and had none.
-- No public policies are added: the backend authenticates to Supabase with
-- the service_role key, which bypasses RLS entirely, so API behavior is
-- unchanged. This only blocks direct access via the anon key (e.g. if it
-- were ever exposed client-side), which would otherwise default to full
-- read/write on these tables.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity ENABLE ROW LEVEL SECURITY;

-- settings is read by the public site (GET /api/profile) via the backend,
-- but may be read directly by the anon key too — allow public SELECT only.
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
