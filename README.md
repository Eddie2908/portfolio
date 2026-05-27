# Portfolio — Full-Stack

Portfolio personnel full-stack avec frontend Next.js, backend FastAPI, base de données Supabase et dashboard admin.

## Stack technique

| Couche | Technologie | Déploiement |
|--------|-------------|-------------|
| Frontend | Next.js 14 + Tailwind CSS | Vercel |
| Backend | FastAPI (Python 3.11) | Render |
| Base de données | Supabase (PostgreSQL) | Supabase Cloud |
| Admin (static) | HTML / CSS / JS vanilla | GitHub Pages / Netlify |

## Structure du projet

```
portfolio/
├── frontend/        → Application Next.js
├── backend/         → API REST FastAPI
├── supabase/        → Migrations SQL
├── admin-dashboard/ → Dashboard statique HTML/CSS/JS
└── docs/            → Documentation
```

## Démarrage rapide

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local  # remplir les variables
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Variables d'environnement

Voir `frontend/.env.example` et `backend/.env.example` pour la liste complète.

## Déploiement

Voir [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) pour les instructions détaillées.
