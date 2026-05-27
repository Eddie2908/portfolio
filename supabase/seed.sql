-- Seed admin user (password: Admin123!)
INSERT INTO users (name, email, password_hash, role, status) VALUES
('Alex Dupont', 'admin@devportfolio.fr', '$2b$12$LQv3c1yqBo9SkvXS7QTJPe68WfP6QhFmHQXHHCXSd9cEqK0Tz.W6e', 'admin', 'active');

-- Seed projects
INSERT INTO projects (title, description, category, tags, demo_url, github_url, status, featured) VALUES
('E-Commerce Platform', 'Plateforme e-commerce complète avec panier, paiement Stripe et dashboard admin.', 'fullstack', ARRAY['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'], 'https://demo-ecommerce.vercel.app', 'https://github.com/dev/ecommerce', 'published', true),
('Dashboard Analytics', 'Tableau de bord interactif avec graphiques en temps réel et exports CSV.', 'frontend', ARRAY['React', 'Recharts', 'Tailwind CSS'], 'https://demo-dashboard.vercel.app', 'https://github.com/dev/dashboard', 'published', true),
('API REST FastAPI', 'API RESTful haute performance avec authentification JWT et documentation Swagger.', 'backend', ARRAY['Python', 'FastAPI', 'PostgreSQL', 'Docker'], NULL, 'https://github.com/dev/fastapi-rest', 'published', false),
('App Mobile Fitness', 'Application mobile de suivi fitness avec plans personnalisés et suivi de progression.', 'mobile', ARRAY['React Native', 'Expo', 'Firebase'], NULL, 'https://github.com/dev/fitness-app', 'published', false);

-- Seed testimonials
INSERT INTO testimonials (name, role, text, status) VALUES
('Marie Laurent', 'CEO, StartupX', 'Développeur exceptionnel ! Il a transformé notre vision en une application performante et élégante. Je recommande sans hésitation.', 'published'),
('Thomas Renard', 'CTO, TechCorp', 'Travail de qualité, respect des délais et excellente communication tout au long du projet. Un vrai professionnel.', 'published'),
('Sophie Martin', 'PM, Agence Digital', 'Collaboration fluide et résultat au-delà de nos attentes. Le code est propre, bien documenté et maintenable.', 'published');

-- Seed blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, status, read_time, author_id) VALUES
('Les nouveautés de Next.js 14', 'nouveautes-nextjs-14', 'Découvrez les nouvelles fonctionnalités de Next.js 14 : Server Actions, Partial Prerendering et plus.', '# Next.js 14\n\nLa dernière version de Next.js apporte des améliorations majeures...', 'frontend', ARRAY['Next.js', 'React', 'Web'], 'published', '5 min', 1),
('FastAPI : Bonnes pratiques', 'fastapi-bonnes-pratiques', 'Guide complet des bonnes pratiques pour construire des APIs robustes avec FastAPI.', '# FastAPI Best Practices\n\nFastAPI est un framework Python moderne...', 'backend', ARRAY['Python', 'FastAPI', 'API'], 'published', '8 min', 1);

-- Seed settings
INSERT INTO settings (id, site_name, site_description, contact_email, meta_title, meta_description) VALUES
(1, 'DevPortfolio', 'Portfolio développeur Full-Stack', 'contact@devportfolio.fr', 'DevPortfolio — Développeur Full-Stack', 'Portfolio de développeur Full-Stack spécialisé en React, Next.js, Python et FastAPI.');
