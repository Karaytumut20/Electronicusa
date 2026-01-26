export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  role: 'user' | 'store' | 'admin';
  created_at: string;
};

export type Ad = {
  id: number;
  user_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  brand?: string;
  model?: string;
  city: string;
  district: string;
  image?: string;
  images?: string[];
  status: 'yayinda' | 'onay_bekliyor' | 'pasif' | 'reddedildi';
  created_at: string;
  updated_at: string;
  view_count: number;
  is_vitrin: boolean;
  is_urgent: boolean;
  technical_specs?: any;
};

export type Notification = {
  id: number;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type AdFormData = {
  title: string;
  description: string;
  price: string | number;
  currency: string;
  city: string;
  district: string;
  brand?: string;
  model?: string;
  category?: string;
  [key: string]: any;
};