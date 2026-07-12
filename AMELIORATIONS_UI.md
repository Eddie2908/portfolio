# Plan de corrections — Portfolio (à appliquer par Claude Code)

Ce document liste les correctifs identifiés lors de l'audit UI/UX, avec les fichiers concernés et le correctif proposé. Chaque item est actionnable indépendamment. Les chemins sont relatifs à la racine du repo (`frontend/`, `admin-dashboard/`).

---

## P0 — Urgent (accessibilité, bugs visuels réels)

### 1. Flash de thème au chargement (FOUC dark/light)
**Fichier :** `frontend/src/context/ThemeContext.tsx`, `frontend/src/pages/_document.tsx`

**Problème :** `ThemeProvider` initialise `theme` à `'dark'` puis ne lit `localStorage` et n'ajoute la classe `.dark` sur `<html>` que dans un `useEffect` (donc après le premier rendu côté client). Résultat : à chaque chargement de page, il y a un court instant où :
- les variables CSS (`:root`) sont déjà celles du thème sombre (valeur par défaut dans `globals.css`),
- mais les classes Tailwind `dark:...` ne sont pas encore actives (pas de `.dark` sur `<html>`),
- donc du texte prévu pour fond clair (`text-gray-900`, etc.) s'affiche sur un fond sombre → flash illisible, surtout visible pour les utilisateurs en mode clair.

**Correctif proposé :** ajouter un script bloquant inline dans `_document.tsx` (avant l'hydratation React) qui lit `localStorage.theme` et pose la classe `dark` sur `<html>` immédiatement, façon `next-themes` :

```html
<!-- dans _document.tsx, dans <Head> ou juste avant </body>, en <script> non-module -->
<script dangerouslySetInnerHTML={{ __html: `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var isDark = stored ? stored === 'dark' : true;
      document.documentElement.classList.toggle('dark', isDark);
    } catch (e) {}
  })();
`}} />
```
Puis simplifier `ThemeContext.tsx` pour lire la classe déjà posée au montage plutôt que de la re-poser après coup.

---

### 2. Couleur de badge non adaptée au thème clair
**Fichier :** `frontend/src/components/sections/Hero.tsx` (badge "Disponible pour des missions")

**Problème :** le badge a `color: '#a4b9fd'` en dur (couleur `primary-300`, pensée pour fond sombre). En mode clair, ce texte lavande clair devient quasi illisible sur le fond clair de la Hero.

**Correctif proposé :** remplacer le style inline fixe par des classes conditionnelles :
```tsx
className="... dark:text-primary-300 text-primary-600 ..."
// et supprimer `color: '#a4b9fd'` du style inline
```

---

### 3. Animations Framer Motion non coupées par `prefers-reduced-motion`
**Fichiers :** `frontend/src/components/sections/Hero.tsx` (anneaux rotatifs, parallaxe souris), `frontend/src/components/sections/Skills.tsx` (blobs parallax scroll)

**Problème :** `globals.css` désactive bien les animations **CSS** via `@media (prefers-reduced-motion: reduce)`, mais les animations pilotées en JS par Framer Motion (`animate={{ rotate: 360 }}`, `useTransform`, `useSpring`) ne sont pas concernées par cette règle.

**Correctif proposé :** utiliser le hook `useReducedMotion` de Framer Motion et désactiver/réduire ces transformations :
```tsx
import { useReducedMotion } from 'framer-motion';
const reduceMotion = useReducedMotion();
// puis conditionner rotate/transition sur reduceMotion, ex :
transition={{ duration: reduceMotion ? 0 : 20, repeat: reduceMotion ? 0 : Infinity }}
```

---

### 4. `text-justify` sur les paragraphes "À propos"
**Fichier :** `frontend/src/components/sections/About.tsx`

**Problème :** classe `text-justify` crée des espacements irréguliers entre les mots (rivières de blanc), nuit à la lisibilité en français.

**Correctif :** remplacer `text-justify` par `text-left` (retirer la classe, c'est l'alignement par défaut).

---

### 5. Données factices en dur dans le dashboard
**Fichier :** `admin-dashboard/index.html` (bloc `#activityList`)

**Problème :** les 4 entrées d'« Activité récente » sont écrites en dur dans le HTML (Marie L., etc.) et non chargées depuis l'API. Si non branché, ça affiche une fausse activité en production.

**Correctif proposé :** dans `admin-dashboard/js/dashboard.js`, ajouter un appel `apiGet('/admin/activity')` qui remplit `#activityList` dynamiquement, et retirer les `<div class="activity-item">` statiques du HTML (garder un état vide/squelette le temps du chargement).

---

### 6. Pas de `:focus-visible` sur les éléments interactifs
**Fichiers :** `frontend/src/components/layout/Header.tsx`, `Navigation.tsx`, `Footer.tsx`, `globals.css`

**Problème :** seuls les `.input-field` ont un focus ring défini. Liens de nav, icônes sociales, bouton de thème, cartes projets n'ont aucun indicateur de focus clavier visible au-delà du défaut navigateur (parfois supprimé par les styles existants).

**Correctif proposé :** ajouter dans `globals.css` (`@layer base`) une règle globale :
```css
a:focus-visible, button:focus-visible, [role="button"]:focus-visible {
  outline: 2px solid #5865f5;
  outline-offset: 2px;
  border-radius: 4px;
}
```

---

### 7. Confirmation d'envoi du formulaire non annoncée aux lecteurs d'écran
**Fichier :** `frontend/src/components/sections/Contact.tsx`

**Problème :** `toast.success(...)` / `toast.error(...)` (react-hot-toast) sont purement visuels, pas de région `aria-live`.

**Correctif proposé :** ajouter un `<div aria-live="polite" className="sr-only">{statusMessage}</div>` mis à jour en parallèle du toast, ou configurer `react-hot-toast` avec `ariaProps` (il expose déjà `role="status"` par défaut sur certaines versions — vérifier que ce n'est pas désactivé).

---

## P1 — Important (cohérence de marque)

### 8. Typographie du dashboard admin différente du site public
**Fichier :** `admin-dashboard/css/admin.css` (`--font-display: 'Space Grotesk'`)

**Correctif :** remplacer par `'Plus Jakarta Sans'` (déjà utilisée côté site public) pour une cohérence de marque, et mettre à jour le `<link>` Google Fonts dans `admin-dashboard/index.html` (et toutes les pages `pages/*.html`) en conséquence.

### 9. CSS admin fragmenté en 5 fichiers avec tokens dupliqués
**Fichiers :** `admin-dashboard/css/admin.css`, `dashboard.css`, `forms.css`, `tables.css`, `responsive.css`

**Correctif :** extraire les variables `:root` / `[data-theme]` dans un seul fichier `tokens.css` partagé, aligné sur les valeurs de `frontend/src/styles/globals.css` (`--color-primary: #5865f5`, `--color-accent: #c344f0`) pour que les deux systèmes utilisent la même source de vérité (au minimum en dupliquant les valeurs identiques, idéalement en générant les deux depuis un seul fichier de tokens).

### 10. Icônes hétérogènes dans la sidebar admin
**Fichier :** `admin-dashboard/index.html`

**Problème :** mélange de `<img src="assets/icons/*.svg">` et de SVG inline pour les items de nav (Dashboard/Projets/Messages/Utilisateurs vs Compétences/Paramètres/Déconnexion).

**Correctif :** choisir un seul système (SVG inline recommandé, plus facile à colorer avec `currentColor`) et convertir tous les items de nav.

### 11. Libellé de navigation ambigu
**Fichier :** `admin-dashboard/index.html` (lien vers `pages/profile.html`)

**Correctif :** renommer "Portfolio Public" → "Profil & Contenu".

---

## P2 — Confort (polish)

### 12. Trop d'animations décoratives simultanées
**Fichiers :** `frontend/src/components/sections/Hero.tsx`, `Skills.tsx`, `frontend/src/styles/globals.css`

**Correctif :** limiter à 1–2 effets d'ambiance actifs par section (ex. garder les blobs de la Hero, retirer l'anneau rotatif secondaire `-inset-6` qui ajoute peu visuellement).

### 13. Pourcentages de compétences arbitraires
**Fichier :** `frontend/src/components/sections/Skills.tsx`, données associées (table `skills` / seed Supabase)

**Correctif :** remplacer le `level` numérique (%) par une énumération qualitative (`Débutant` / `Confirmé` / `Expert`) affichée en badge, ou conserver la barre mais avec un libellé qualitatif à côté du %.

### 14. Upload d'avatar rudimentaire
**Fichier :** `admin-dashboard/index.html` (`.avatar-upload-area`), `admin-dashboard/js/admin.js`

**Correctif :** ajouter une zone glisser-déposer (`dragover`/`drop` sur `.avatar-upload-area`) en plus du bouton existant ; optionnel : recadrage simple (crop carré) avant upload.

### 15. Métadonnées SEO incomplètes
**Fichiers :** `frontend/src/pages/about.tsx`, `projects.tsx`, `contact.tsx`, `blog.tsx`, `projects/[id].tsx`, `blog/[slug].tsx`

**Correctif :** vérifier que chaque page a son propre `<Head><title>` et `meta description` (actuellement confirmé seulement sur `index.tsx`).

### 16. Fond de vignette projet toujours sombre en mode clair
**Fichier :** `frontend/src/components/sections/Projects.tsx` (`ProjectCard`, dégradé de fond du thumbnail sans image)

**Correctif :** vérifier intentionnellement si ce fond sombre pour les projets sans image est voulu en mode clair (contraste fort avec le reste de la page) ; sinon prévoir une variante claire (`#eef1fa` → `#e4e7f5`) pour ce placeholder en light mode.

---

## Notes pour Claude Code

- Respecter les design tokens existants (`--color-primary: #5865f5`, `--color-accent: #c344f0`, police Inter/Plus Jakarta Sans/JetBrains Mono) — ne pas introduire de nouvelles couleurs.
- Le site public utilise Tailwind + `darkMode: 'class'` ; le dashboard admin utilise `[data-theme="dark|light"]` avec variables CSS — deux mécanismes différents, à traiter séparément mais en gardant les valeurs alignées.
- Tester chaque correctif dans les deux thèmes (clair/sombre) avant de valider.
