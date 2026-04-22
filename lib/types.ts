export type BadgeType = "New" | "Bestseller" | "Seasonal" | null;

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  badge: string | null;
  is_available: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductWithCategory extends Product {
  category?: Pick<Category, "id" | "name" | "slug" | "image_url"> | null;
}

export interface Settings {
  id: number;
  cafe_name: string;
  logo_url: string | null;
  hero_title: string;
  hero_subtitle: string;
  instagram_url: string | null;
  phone: string | null;
  address: string | null;
  working_hours: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MenuCategory extends Category {
  products: Product[];
}

export interface PublicMenuData {
  settings: Settings;
  categories: MenuCategory[];
}
