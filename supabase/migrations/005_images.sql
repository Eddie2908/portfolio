-- Add image columns to settings (admin profile photo) and projects (cover image)

ALTER TABLE settings
    ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT NULL;

ALTER TABLE projects
    ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

-- Create Supabase Storage bucket for portfolio assets (run in Supabase dashboard or via CLI)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true)
-- ON CONFLICT (id) DO NOTHING;

-- Allow public read on the portfolio bucket
-- CREATE POLICY "Public read portfolio" ON storage.objects
--     FOR SELECT USING (bucket_id = 'portfolio');

-- Allow authenticated admins to upload
-- CREATE POLICY "Admin upload portfolio" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'portfolio');
