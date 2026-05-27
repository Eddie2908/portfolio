# API Documentation

## Base URL

```
Development: http://localhost:8000/api
Production: https://your-api.onrender.com/api
```

## Authentication

All admin endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Login | No |
| POST | `/auth/register` | Create user | Admin |
| GET | `/auth/me` | Get profile | Yes |
| PUT | `/auth/me` | Update profile | Yes |
| PUT | `/auth/change-password` | Change password | Yes |

#### POST /auth/login

```json
{
  "email": "admin@devportfolio.fr",
  "password": "Admin123!"
}
```

Response:
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "name": "Alex Dupont", "email": "admin@devportfolio.fr", "role": "admin" }
}
```

---

### Projects

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/projects` | List published projects | No |
| GET | `/projects/:id` | Get project detail | No |

Query params: `?category=frontend&page=1&limit=20`

---

### Contact

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/contact` | Send message | No (rate limited) |
| GET | `/contact` | List messages | Admin |
| GET | `/contact/:id` | Get message | Admin |
| PATCH | `/contact/:id/read` | Mark as read | Admin |
| DELETE | `/contact/:id` | Delete message | Admin |

#### POST /contact

```json
{
  "name": "Marie",
  "email": "marie@example.com",
  "subject": "Collaboration",
  "message": "Bonjour..."
}
```

---

### Testimonials

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/testimonials` | List published | No |
| GET | `/testimonials/:id` | Get one | No |

---

### Blog

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/blog` | List published posts | No |
| GET | `/blog/:slug` | Get post by slug | No |

Query params: `?category=frontend&page=1&limit=20`

---

### Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/stats` | Dashboard stats | Admin |
| GET | `/admin/projects` | All projects | Admin |
| POST | `/admin/projects` | Create project | Admin |
| PUT | `/admin/projects/:id` | Update project | Admin |
| DELETE | `/admin/projects/:id` | Delete project | Admin |
| GET | `/admin/testimonials` | All testimonials | Admin |
| POST | `/admin/testimonials` | Create testimonial | Admin |
| PUT | `/admin/testimonials/:id` | Update testimonial | Admin |
| DELETE | `/admin/testimonials/:id` | Delete testimonial | Admin |
| GET | `/admin/blog` | All posts | Admin |
| POST | `/admin/blog` | Create post | Admin |
| PUT | `/admin/blog/:id` | Update post | Admin |
| DELETE | `/admin/blog/:id` | Delete post | Admin |
| GET | `/admin/users` | List users | Admin |
| PUT | `/admin/settings` | Update settings | Admin |

---

## Error Responses

```json
{
  "detail": "Error message"
}
```

Status codes:
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `422` - Validation error
- `429` - Rate limited
- `500` - Server error

---

## Rate Limiting

- Contact form: **5 requests/minute** per IP
- General API: No limit (authenticated routes)
