import { unstable_noStore as noStore } from "next/cache";

import { demoMenuData } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Category, ProductWithCategory, PublicMenuData, Settings } from "@/lib/types";

const fallbackSettings = demoMenuData.settings;

async function requireSupabase() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

export async function getPublicMenuData(): Promise<PublicMenuData> {
  noStore();

  if (!isSupabaseConfigured()) {
    return demoMenuData;
  }

  const supabase = await requireSupabase();

  const [{ data: settings }, { data: categories }, { data: products }] = await Promise.all([
    supabase.from("settings").select("*").eq("id", 1).single(),
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
  ]);

  if (!categories || !products) {
    return demoMenuData;
  }

  return {
    settings: settings ?? fallbackSettings,
    categories: categories.map((category) => ({
      ...category,
      products: products.filter((product) => product.category_id === category.id)
    }))
  };
}

export async function getAdminDashboardData() {
  noStore();

  const supabase = await requireSupabase();

  const [{ count: categoryCount }, { count: productCount }, { data: settings }] = await Promise.all(
    [
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("settings").select("*").eq("id", 1).single()
    ]
  );

  return {
    categoryCount: categoryCount ?? 0,
    productCount: productCount ?? 0,
    settings: settings ?? fallbackSettings
  };
}

export async function getCategories(): Promise<Category[]> {
  noStore();

  if (!isSupabaseConfigured()) {
return demoMenuData.categories.map((category) => {
  const { products, ...rest } = category;
  return rest;
}); 

}

  const supabase = await requireSupabase();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getProducts(): Promise<ProductWithCategory[]> {
  noStore();

  if (!isSupabaseConfigured()) {
    return demoMenuData.categories.flatMap((category) =>
      category.products.map((product) => ({
        ...product,
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug
        }
      }))
    );
  }

  const supabase = await requireSupabase();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .order("sort_order", { ascending: true });

  return (data as ProductWithCategory[] | null) ?? [];
}

export async function getSettings(): Promise<Settings> {
  noStore();

  if (!isSupabaseConfigured()) {
    return fallbackSettings;
  }

  const supabase = await requireSupabase();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).single();

  return data ?? fallbackSettings;
}
