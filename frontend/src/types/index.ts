export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  live_url?: string;
  github_url?: string;
  technologies?: string[];
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

export interface ApiError {
  detail: string;
}

export interface Settings {
  id: number;
  site_title?: string;
  site_description?: string;
  hero_title?: string;
  hero_subtitle?: string;
  about_text?: string;
  avatar_url?: string;
  resume_url?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  email?: string;
}
