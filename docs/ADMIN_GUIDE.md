# Guide d'Administration

## Accès au Dashboard

### URL
- **Développement** : `http://localhost:3000/admin` (Next.js) ou `admin-dashboard/index.html` (statique)
- **Production** : `https://your-admin-domain.netlify.app`

### Identifiants par défaut
- **Email** : `admin@devportfolio.fr`
- **Mot de passe** : `Admin123!`

> ⚠️ Changez le mot de passe immédiatement après le premier login.

---

## Fonctionnalités

### Dashboard
Vue d'ensemble avec :
- Nombre de projets, messages, visites, utilisateurs
- Graphiques de visites et messages
- Activité récente

### Gestion des Projets
- **Lister** tous les projets (publiés et brouillons)
- **Créer** un nouveau projet avec titre, description, catégorie, tags, liens
- **Modifier** un projet existant
- **Supprimer** un projet (irréversible)
- **Publier/Dépublier** en changeant le statut

### Messages
- **Lister** tous les messages reçus via le formulaire de contact
- **Voir** le détail d'un message
- **Marquer comme lu** un message non lu
- **Supprimer** un message

### Témoignages
- **Lister** tous les témoignages
- **Créer** un nouveau témoignage (nom, rôle, texte)
- **Modifier** un témoignage existant
- **Publier/Masquer** en changeant le statut

### Blog
- **Lister** tous les articles
- **Créer** un nouvel article (Markdown supporté)
- **Modifier** un article existant
- **Gérer les catégories**
- **Publier/Dépublier** un article

### Utilisateurs
- **Lister** les utilisateurs admin/éditeur
- **Créer** un nouveau compte (admin uniquement)
- **Modifier** les rôles et statuts
- **Désactiver** un compte

### Paramètres
- **Général** : nom du site, description, email de contact
- **SEO** : titre meta, description meta, image OG, URL canonique
- **Intégrations** : Google Analytics ID
- **Profil** : modifier votre nom, email, bio

---

## Rôles

| Rôle | Projets | Messages | Blog | Utilisateurs | Paramètres |
|------|---------|----------|------|--------------|------------|
| Admin | CRUD | CRUD | CRUD | CRUD | CRUD |
| Editor | CRUD | Lecture | CRUD | - | Lecture |

---

## Sécurité

- Les tokens JWT expirent après **24 heures**
- Les mots de passe sont hashés avec **bcrypt**
- Le formulaire de contact est **limité à 5 envois/minute** par IP
- Les routes admin nécessitent un token valide
- RLS (Row Level Security) activé sur Supabase

---

## Dépannage

| Problème | Solution |
|----------|----------|
| "Token invalide" | Reconnectez-vous |
| "Accès refusé" | Vérifiez votre rôle |
| Formulaire ne s'envoie pas | Vérifiez la connexion API |
| Données non affichées | Vérifiez la connexion Supabase |
| Erreur 429 | Rate limit atteint, attendez 1 minute |
