# Deployment Guide

## Architecture

```
Frontend (Next.js) → Vercel
Backend (FastAPI)  → Render
Database           → Supabase (PostgreSQL)
Admin Dashboard    → GitHub Pages / Netlify
```

---

## 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in order:
   ```bash
   psql -h your-host -U postgres -d postgres -f supabase/migrations/001_initial.sql
   psql -h your-host -U postgres -d postgres -f supabase/migrations/002_auth.sql
   psql -h your-host -U postgres -d postgres -f supabase/migrations/003_admin.sql
   ```
3. Seed initial data:
   ```bash
   psql -h your-host -U postgres -d postgres -f supabase/seed.sql
   ```
4. Note your project URL, anon key, and service role key.

---

## 2. Backend (Render)

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Settings:
   - **Runtime**: Python 3
   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-service-role-key
   JWT_SECRET=your-super-secret-jwt-key
   JWT_ALGORITHM=HS256
   JWT_EXPIRE_MINUTES=1440
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   CONTACT_EMAIL=contact@devportfolio.fr
   ALLOWED_ORIGINS=https://your-domain.vercel.app
   ```

---

## 3. Frontend (Vercel)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Settings:
   - **Framework**: Next.js
   - **Root directory**: `frontend`
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.onrender.com
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

---

## 4. Admin Dashboard (Static)

### Option A: GitHub Pages

1. Push `admin-dashboard/` to a separate branch or repo
2. Enable GitHub Pages in repository settings
3. Update `js/api.js` with production API URL

### Option B: Netlify

1. Drag and drop `admin-dashboard/` folder on [netlify.com](https://netlify.com)
2. Update API URL in `js/api.js`

---

## 5. Custom Domain (Optional)

### Vercel
- Add domain in Project Settings > Domains
- Update DNS records as instructed

### Render
- Add custom domain in Service Settings
- Configure CNAME record

---

## 6. CI/CD

Vercel and Render auto-deploy on push to `main` branch.

For manual deployment:
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && uvicorn app.main:app
```

---

## Troubleshooting

- **CORS errors**: Ensure `ALLOWED_ORIGINS` includes your frontend URL
- **401 errors**: Check JWT secret matches between frontend and backend
- **Database errors**: Verify Supabase URL and key are correct
- **Build failures**: Check `requirements.txt` / `package.json` versions
