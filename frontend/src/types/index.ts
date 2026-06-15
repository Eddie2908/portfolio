export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  status?: string;
  image_url?: string;
  live_url?: string;
  demo_url?: string;
  github_url?: string;
  technologies?: string[];
  tags?: string[];
  featured?: boolean;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  image_url?: string;
  category?: string;
  tags?: string[];
  published?: boolean;
  author_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar_url?: string;
  rating?: number;
  created_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level?: number;
  icon?: string;
  display_order?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  bio?: string;
  avatar_url?: string;
  status?: string;
  created_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  created_at?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'editor';
}

export interface ProfileUpdatePayload {
  name?: string;
  bio?: string;
  avatar_url?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface UploadResponse {
  url: string;
  filename?: string;
}

export interface MessageResponse {
  message: string;
  id?: number | string;
}

export interface ApiError {
  detail: string;
}

export interface Settings {
  id: number;
  site_title?: string;
  site_name?: string;
  site_description?: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  hero_title?: string;
  hero_subtitle?: string;
  about_text?: string;
  avatar_url?: string;
  resume_url?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  email?: string;
  contact_email?: string;
  analytics_id?: string;
  full_name?: string;
  job_title?: string;
  location?: string;
  phone?: string;
  bio_1?: string;
  bio_2?: string;
  bio_3?: string;
  years_experience?: string;
  projects_count?: string;
  fun_stat?: string;
  fun_stat_label?: string;
  hero_badge_exp?: string;
  hero_badge_projects?: string;
  tech_tags?: string[];
}
