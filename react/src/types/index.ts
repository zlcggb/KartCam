export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Video {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail_url: string;
  duration: number;
  status: 'processing' | 'ready' | 'error';
  highlights_generated: boolean;
  grid_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Highlight {
  id: string;
  video_id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  duration: number;
  created_at: string;
}

export interface GridImage {
  id: string;
  video_id: string;
  url: string;
  created_at: string;
}

export interface Share {
  id: string;
  user_id: string;
  content_id: string;
  content_type: 'video' | 'highlight' | 'grid';
  url: string;
  expires_at: string | null;
  password: string | null;
  views: number;
  created_at: string;
}