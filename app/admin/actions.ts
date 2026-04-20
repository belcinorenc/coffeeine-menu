"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { isAllowedAdminEmail, isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { toSlug } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sort_order: z.coerce.number().int().min(1),
  is_active: z.boolean()
});

const productSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  image_url: z.string().url().optional().or(z.literal("")),
  badge: z.string().optional(),
  is_available: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.coerce.number().int().min(1)
});

const settingsSchema = z.object({
  cafe_name: z.string().min(2),
  logo_url: z.string().url().optional().or(z.literal("")),
  hero_title: z.string().min(5),
  hero_subtitle: z.string().min(10),
  instagram_url: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  working_hours: z.string().optional()
});

async function getSupabaseOrThrow() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

function parseCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function signInAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=config");
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const next = String(formData.get("next") ?? "/admin");

  const supabase = await getSupabaseOrThrow();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect("/admin/login?error=invalid-credentials");
  }

  if (!isAllowedAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseOrThrow();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}

export async function createCategoryAction(formData: FormData) {
  const supabase = await getSupabaseOrThrow();

  const payload = categorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug") || toSlug(String(formData.get("name") ?? "")),
    sort_order: formData.get("sort_order"),
    is_active: parseCheckbox(formData, "is_active")
  });

  await supabase.from("categories").insert(payload);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
}

export async function updateCategoryAction(formData: FormData) {
  const supabase = await getSupabaseOrThrow();
  const id = String(formData.get("id"));

  const payload = categorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug") || toSlug(String(formData.get("name") ?? "")),
    sort_order: formData.get("sort_order"),
    is_active: parseCheckbox(formData, "is_active")
  });

  await supabase.from("categories").update(payload).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  const supabase = await getSupabaseOrThrow();
  const id = String(formData.get("id"));

  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

export async function moveCategoryAction(formData: FormData) {
  const supabase = await getSupabaseOrThrow();
  const id = String(formData.get("id"));
  const direction = String(formData.get("direction"));

  const { data: categories } = await supabase
    .from("categories")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  if (!categories) {
    return;
  }

  const index = categories.findIndex((category) => category.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || swapIndex < 0 || swapIndex >= categories.length) {
    return;
  }

  const current = categories[index];
  const target = categories[swapIndex];

  await Promise.all([
    supabase.from("categories").update({ sort_order: target.sort_order }).eq("id", current.id),
    supabase.from("categories").update({ sort_order: current.sort_order }).eq("id", target.id)
  ]);

  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function createProductAction(formData: FormData) {
  const supabase = await getSupabaseOrThrow();

  const payload = productSchema.parse({
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image_url: formData.get("image_url"),
    badge: formData.get("badge"),
    is_available: parseCheckbox(formData, "is_available"),
    is_active: parseCheckbox(formData, "is_active"),
    sort_order: formData.get("sort_order")
  });

  await supabase.from("products").insert({
    ...payload,
    description: payload.description || null,
    image_url: payload.image_url || null,
    badge: payload.badge || null
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}

export async function updateProductAction(formData: FormData) {
  const supabase = await getSupabaseOrThrow();
  const id = String(formData.get("id"));

  const payload = productSchema.parse({
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image_url: formData.get("image_url"),
    badge: formData.get("badge"),
    is_available: parseCheckbox(formData, "is_available"),
    is_active: parseCheckbox(formData, "is_active"),
    sort_order: formData.get("sort_order")
  });

  await supabase
    .from("products")
    .update({
      ...payload,
      description: payload.description || null,
      image_url: payload.image_url || null,
      badge: payload.badge || null
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const supabase = await getSupabaseOrThrow();
  const id = String(formData.get("id"));

  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function moveProductAction(formData: FormData) {
  const supabase = await getSupabaseOrThrow();
  const id = String(formData.get("id"));
  const direction = String(formData.get("direction"));
  const categoryId = String(formData.get("category_id"));

  const { data: products } = await supabase
    .from("products")
    .select("id, sort_order")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true });

  if (!products) {
    return;
  }

  const index = products.findIndex((product) => product.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || swapIndex < 0 || swapIndex >= products.length) {
    return;
  }

  const current = products[index];
  const target = products[swapIndex];

  await Promise.all([
    supabase.from("products").update({ sort_order: target.sort_order }).eq("id", current.id),
    supabase.from("products").update({ sort_order: current.sort_order }).eq("id", target.id)
  ]);

  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function updateSettingsAction(formData: FormData) {
  const supabase = await getSupabaseOrThrow();

  const payload = settingsSchema.parse({
    cafe_name: formData.get("cafe_name"),
    logo_url: formData.get("logo_url"),
    hero_title: formData.get("hero_title"),
    hero_subtitle: formData.get("hero_subtitle"),
    instagram_url: formData.get("instagram_url"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    working_hours: formData.get("working_hours")
  });

  await supabase.from("settings").upsert(
    {
      id: 1,
      ...payload,
      logo_url: payload.logo_url || null,
      instagram_url: payload.instagram_url || null
    },
    { onConflict: "id" }
  );

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}
