-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    category_color VARCHAR(20) DEFAULT '#5865f5',
    name VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL CHECK (level BETWEEN 0 AND 100),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extend settings table with profile + portfolio content
ALTER TABLE settings
    ADD COLUMN IF NOT EXISTS full_name VARCHAR(150) DEFAULT 'Franck Eddie KEMTA',
    ADD COLUMN IF NOT EXISTS job_title VARCHAR(200) DEFAULT 'Développeur Full-Stack · React · FastAPI',
    ADD COLUMN IF NOT EXISTS bio_1 TEXT DEFAULT 'Développeur Full-Stack passionné basé à Paris, je crée des expériences numériques qui allient esthétique moderne et performance technique.',
    ADD COLUMN IF NOT EXISTS bio_2 TEXT DEFAULT 'Spécialisé dans l''écosystème React / Next.js côté frontend et FastAPI / Node.js côté backend, je conçois des solutions end-to-end scalables.',
    ADD COLUMN IF NOT EXISTS bio_3 TEXT DEFAULT 'Toujours à l''affût des dernières tendances tech, j''apprends en permanence et partage mes connaissances via des articles de blog et des projets open-source.',
    ADD COLUMN IF NOT EXISTS years_experience VARCHAR(10) DEFAULT '3+',
    ADD COLUMN IF NOT EXISTS projects_count VARCHAR(10) DEFAULT '20+',
    ADD COLUMN IF NOT EXISTS fun_stat VARCHAR(10) DEFAULT '∞',
    ADD COLUMN IF NOT EXISTS fun_stat_label VARCHAR(50) DEFAULT 'Cafés bus',
    ADD COLUMN IF NOT EXISTS location VARCHAR(100) DEFAULT 'Yaounde, Cameroun',
    ADD COLUMN IF NOT EXISTS phone VARCHAR(30) DEFAULT '+237 6 99 99 58 32',
    ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT 'https://github.com',
    ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT 'https://linkedin.com',
    ADD COLUMN IF NOT EXISTS twitter_url TEXT DEFAULT 'https://twitter.com',
    ADD COLUMN IF NOT EXISTS tech_tags TEXT[] DEFAULT ARRAY['React','Next.js','TypeScript','Python','FastAPI','PostgreSQL','Docker','Figma'],
    ADD COLUMN IF NOT EXISTS hero_badge_exp VARCHAR(50) DEFAULT '3+ ans d''expérience',
    ADD COLUMN IF NOT EXISTS hero_badge_projects VARCHAR(50) DEFAULT '20+ projets livrés';

-- Seed default skills data
INSERT INTO skills (category, category_color, name, level, display_order) VALUES
    ('Frontend', '#5865f5', 'React / Next.js', 95, 1),
    ('Frontend', '#5865f5', 'TypeScript', 88, 2),
    ('Frontend', '#5865f5', 'Tailwind CSS', 92, 3),
    ('Frontend', '#5865f5', 'Framer Motion', 80, 4),
    ('Backend', '#c344f0', 'Python / FastAPI', 90, 1),
    ('Backend', '#c344f0', 'Node.js / Express', 82, 2),
    ('Backend', '#c344f0', 'PostgreSQL', 85, 3),
    ('Backend', '#c344f0', 'Redis', 70, 4),
    ('DevOps & Outils', '#22c55e', 'Docker', 78, 1),
    ('DevOps & Outils', '#22c55e', 'GitHub Actions', 82, 2),
    ('DevOps & Outils', '#22c55e', 'Vercel / Render', 90, 3),
    ('DevOps & Outils', '#22c55e', 'Supabase', 88, 4)
ON CONFLICT DO NOTHING;

-- Ensure default settings row exists
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- RLS for skills (public read)
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
