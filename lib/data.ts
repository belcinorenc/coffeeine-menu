import { unstable_cache } from "next/cache";

import { demoMenuData } from "@/lib/demo-data";
import { isSupabaseConfigured } from "@/lib/env";
import {
  createPublicServerSupabaseClient,
  createServerSupabaseClient
} from "@/lib/supabase/server";
import type { Category, ProductWithCategory, PublicMenuData, Settings } from "@/lib/types";

const fallbackSettings = demoMenuData.settings;
const PUBLIC_MENU_REVALIDATE_SECONDS = 60;

async function requireSupabase() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

const getCachedPublicMenuData = unstable_cache(
  async (): Promise<PublicMenuData> => {
    const supabase = createPublicServerSupabaseClient();

    if (!supabase) {
      return demoMenuData;
    }

    const [{ data: settings }, categoriesResult] = await Promise.all([
      supabase
        .from("settings")
        .select(
          "id, cafe_name, logo_url, hero_title, hero_subtitle, instagram_url, phone, address, working_hours"
        )
        .eq("id", 1)
        .single(),
      supabase
        .from("categories")
        .select(
          "id, name, slug, image_url, sort_order, is_active, products(id, category_id, name, description, product_options, price, image_url, badge, is_available, is_active, sort_order)"
        )
        .eq("is_active", true)
        .eq("products.is_active", true)
        .order("sort_order", { ascending: true })
        .order("sort_order", { foreignTable: "products", ascending: true })
    ]);

    let categories = categoriesResult.data as Array<{
      id: string;
      name: string;
      slug: string;
      image_url: string | null;
      sort_order: number;
      is_active: boolean;
      products?: PublicMenuData["categories"][number]["products"];
    }> | null;

    if (
      !categories &&
      (categoriesResult.error?.message.includes("image_url") ||
        categoriesResult.error?.message.includes("product_options"))
    ) {
      const fallbackResult = await supabase
        .from("categories")
        .select(
          "id, name, slug, sort_order, is_active, products(id, category_id, name, description, price, image_url, badge, is_available, is_active, sort_order)"
        )
        .eq("is_active", true)
        .eq("products.is_active", true)
        .order("sort_order", { ascending: true })
        .order("sort_order", { foreignTable: "products", ascending: true });

      categories = fallbackResult.data?.map((category) => ({
        ...category,
        image_url: null,
        products: category.products?.map((product) => ({
          ...product,
          product_options: null
        }))
      })) ?? null;
    }

    if (!categories) {
      return demoMenuData;
    }

    return {
      settings: settings ?? fallbackSettings,
      categories: categories.map((category) => ({
        ...category,
        products: (category.products ?? []).filter((product) => product.is_active)
      }))
    };
  },
  ["public-menu"],
  {
    revalidate: PUBLIC_MENU_REVALIDATE_SECONDS,
    tags: ["public-menu"]
  }
);

export async function getPublicMenuData(): Promise<PublicMenuData> {
  if (!isSupabaseConfigured()) {
    return demoMenuData;
  }

  return getCachedPublicMenuData();
}

export async function getAdminDashboardData() {
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
  if (!isSupabaseConfigured()) {
    return demoMenuData.categories.map((category) => {
      const { products, ...rest } = category;
      return rest;
    });
  }

  const supabase = await requireSupabase();
  const result = await supabase
    .from("categories")
    .select("id, name, slug, image_url, sort_order, is_active, created_at, updated_at")
    .order("sort_order", { ascending: true });

  if (result.data) {
    return result.data;
  }

  if (result.error?.message.includes("image_url")) {
    const fallbackResult = await supabase
      .from("categories")
      .select("id, name, slug, sort_order, is_active, created_at, updated_at")
      .order("sort_order", { ascending: true });

    return (
      fallbackResult.data?.map((category) => ({
        ...category,
        image_url: null
      })) ?? []
    );
  }

  return [];
}

export async function getProducts(): Promise<ProductWithCategory[]> {
  if (!isSupabaseConfigured()) {
    return demoMenuData.categories.flatMap((category) =>
      category.products.map((product) => ({
        ...product,
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          image_url: category.image_url
        }
      }))
    );
  }

  const supabase = await requireSupabase();
  const result = await supabase
    .from("products")
    .select(
      "id, category_id, name, description, product_options, price, image_url, badge, is_available, is_active, sort_order, created_at, updated_at, category:categories(id, name, slug, image_url)"
    )
    .order("sort_order", { ascending: true });

  if (result.data) {
    return (result.data as unknown as ProductWithCategory[] | null) ?? [];
  }

  if (
    result.error?.message.includes("image_url") ||
    result.error?.message.includes("product_options")
  ) {
    const fallbackResult = await supabase
      .from("products")
      .select(
        "id, category_id, name, description, price, image_url, badge, is_available, is_active, sort_order, created_at, updated_at, category:categories(id, name, slug)"
      )
      .order("sort_order", { ascending: true });

    return (
      (fallbackResult.data?.map((product) => ({
        ...product,
        product_options: null,
        category: product.category ? { ...product.category, image_url: null } : null
      })) as unknown as ProductWithCategory[] | undefined) ?? []
    );
  }

  return [];
}

export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured()) {
    return fallbackSettings;
  }

  const supabase = await requireSupabase();
  const { data } = await supabase
    .from("settings")
    .select(
      "id, cafe_name, logo_url, hero_title, hero_subtitle, instagram_url, phone, address, working_hours, created_at, updated_at"
    )
    .eq("id", 1)
    .single();

  return data ?? fallbackSettings;
}

export { PUBLIC_MENU_REVALIDATE_SECONDS };
