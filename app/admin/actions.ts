"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

import { isAllowedAdminEmail, isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { toSlug } from "@/lib/utils";

function refreshPublicMenuCache() {
  revalidateTag("public-menu");
  revalidatePath("/");
}

function createFeedbackUrl(path: string, status: "success" | "error", message: string) {
  const params = new URLSearchParams({ status, message });
  return `${path}?${params.toString()}`;
}

function getAdminRedirectPath(formData: FormData, fallbackPath: string) {
  const redirectTo = String(formData.get("redirect_to") ?? "").trim();
  return redirectTo.startsWith("/admin") ? redirectTo : fallbackPath;
}

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

function rethrowIfRedirectError(error: unknown) {
  if (isRedirectError(error)) {
    throw error;
  }
}

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  image_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(1),
  is_active: z.boolean()
});

const productSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  product_options: z.string().optional(),
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

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(6),
    confirm_password: z.string().min(6)
  })
  .refine((values) => values.password === values.confirm_password, {
    path: ["confirm_password"]
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
    const message = encodeURIComponent(error?.message ?? "No user returned.");

    if (error?.message?.toLowerCase().includes("fetch")) {
      redirect(`/admin/login?error=auth-fetch-failed&message=${message}`);
    }

    redirect(`/admin/login?error=invalid-credentials&message=${message}`);
  }

  if (!isAllowedAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    const unauthorizedEmail = encodeURIComponent(data.user.email ?? email);
    redirect(`/admin/login?error=unauthorized&email=${unauthorizedEmail}`);
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function requestPasswordResetAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/forgot-password?status=config");
  }

  const { email } = forgotPasswordSchema.parse({
    email: String(formData.get("email") ?? "").trim()
  });

  const requestHeaders = await headers();
  const origin =
    requestHeaders.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const supabase = await getSupabaseOrThrow();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/admin/reset-password`
  });

  redirect("/admin/forgot-password?status=sent");
}

export async function updatePasswordAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/reset-password?error=config");
  }

  const result = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password")
  });

  if (!result.success) {
    redirect("/admin/reset-password?error=invalid-password");
  }

  const supabase = await getSupabaseOrThrow();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/forgot-password?error=session-expired");
  }

  const { error } = await supabase.auth.updateUser({
    password: result.data.password
  });

  if (error) {
    redirect("/admin/reset-password?error=update-failed");
  }

  await supabase.auth.signOut();
  redirect("/admin/login?status=password-updated");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseOrThrow();
    await supabase.auth.signOut();
  }

  redirect("/admin/login");
}

export async function createCategoryAction(formData: FormData) {
  const redirectPath = getAdminRedirectPath(formData, "/admin/categories");

  try {
    const supabase = await getSupabaseOrThrow();

    const payload = categorySchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug") || toSlug(String(formData.get("name") ?? "")),
      image_url: formData.get("image_url"),
      sort_order: formData.get("sort_order"),
      is_active: parseCheckbox(formData, "is_active")
    });

    const { error } = await supabase.from("categories").insert({
      ...payload,
      image_url: payload.image_url || null
    });

    if (error) {
      throw error;
    }

    refreshPublicMenuCache();
    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    redirect(createFeedbackUrl(redirectPath, "success", "Kategori başarıyla eklendi."));
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(createFeedbackUrl(redirectPath, "error", getErrorMessage(error, "Kategori eklenemedi.")));
  }
}

export async function updateCategoryAction(formData: FormData) {
  const redirectPath = getAdminRedirectPath(formData, "/admin/categories");

  try {
    const supabase = await getSupabaseOrThrow();
    const id = String(formData.get("id"));

    const payload = categorySchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug") || toSlug(String(formData.get("name") ?? "")),
      image_url: formData.get("image_url"),
      sort_order: formData.get("sort_order"),
      is_active: parseCheckbox(formData, "is_active")
    });

    const { error } = await supabase
      .from("categories")
      .update({
        ...payload,
        image_url: payload.image_url || null
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    refreshPublicMenuCache();
    revalidatePath("/admin/categories");
    redirect(createFeedbackUrl(redirectPath, "success", "Kategori güncellendi."));
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(createFeedbackUrl(redirectPath, "error", getErrorMessage(error, "Kategori güncellenemedi.")));
  }
}

export async function deleteCategoryAction(formData: FormData) {
  const redirectPath = getAdminRedirectPath(formData, "/admin/categories");

  try {
    const supabase = await getSupabaseOrThrow();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      throw error;
    }

    refreshPublicMenuCache();
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    redirect(createFeedbackUrl(redirectPath, "success", "Kategori silindi."));
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(createFeedbackUrl(redirectPath, "error", getErrorMessage(error, "Kategori silinemedi.")));
  }
}

export async function moveCategoryAction(formData: FormData) {
  const redirectPath = getAdminRedirectPath(formData, "/admin/categories");

  try {
    const supabase = await getSupabaseOrThrow();
    const id = String(formData.get("id"));
    const direction = String(formData.get("direction"));

    const { data: categories, error } = await supabase
      .from("categories")
      .select("id, sort_order")
      .order("sort_order", { ascending: true });

    if (error) {
      throw error;
    }

    if (!categories) {
      throw new Error("Kategori sırası alınamadı.");
    }

    const index = categories.findIndex((category) => category.id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (index < 0 || swapIndex < 0 || swapIndex >= categories.length) {
      throw new Error("Kategori daha fazla taşınamıyor.");
    }

    const current = categories[index];
    const target = categories[swapIndex];

    const [currentResult, targetResult] = await Promise.all([
      supabase.from("categories").update({ sort_order: target.sort_order }).eq("id", current.id),
      supabase.from("categories").update({ sort_order: current.sort_order }).eq("id", target.id)
    ]);

    if (currentResult.error || targetResult.error) {
      throw currentResult.error ?? targetResult.error;
    }

    refreshPublicMenuCache();
    revalidatePath("/admin/categories");
    redirect(createFeedbackUrl(redirectPath, "success", "Kategori sırası güncellendi."));
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(
      createFeedbackUrl(redirectPath, "error", getErrorMessage(error, "Kategori sırası güncellenemedi."))
    );
  }
}

export async function createProductAction(formData: FormData) {
  const redirectPath = getAdminRedirectPath(formData, "/admin/products");

  try {
    const supabase = await getSupabaseOrThrow();

    const payload = productSchema.parse({
      category_id: formData.get("category_id"),
      name: formData.get("name"),
      description: formData.get("description"),
      product_options: formData.get("product_options"),
      price: formData.get("price"),
      image_url: formData.get("image_url"),
      badge: formData.get("badge"),
      is_available: parseCheckbox(formData, "is_available"),
      is_active: parseCheckbox(formData, "is_active"),
      sort_order: formData.get("sort_order")
    });

    const { error } = await supabase.from("products").insert({
      ...payload,
      description: payload.description || null,
      product_options: payload.product_options || null,
      image_url: payload.image_url || null,
      badge: payload.badge || null
    });

    if (error) {
      throw error;
    }

    refreshPublicMenuCache();
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    redirect(createFeedbackUrl(redirectPath, "success", "Ürün başarıyla eklendi."));
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(createFeedbackUrl(redirectPath, "error", getErrorMessage(error, "Ürün eklenemedi.")));
  }
}

export async function updateProductAction(formData: FormData) {
  const redirectPath = getAdminRedirectPath(formData, "/admin/products");

  try {
    const supabase = await getSupabaseOrThrow();
    const id = String(formData.get("id"));

    const payload = productSchema.parse({
      category_id: formData.get("category_id"),
      name: formData.get("name"),
      description: formData.get("description"),
      product_options: formData.get("product_options"),
      price: formData.get("price"),
      image_url: formData.get("image_url"),
      badge: formData.get("badge"),
      is_available: parseCheckbox(formData, "is_available"),
      is_active: parseCheckbox(formData, "is_active"),
      sort_order: formData.get("sort_order")
    });

    const { error } = await supabase
      .from("products")
      .update({
        ...payload,
        description: payload.description || null,
        product_options: payload.product_options || null,
        image_url: payload.image_url || null,
        badge: payload.badge || null
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    refreshPublicMenuCache();
    revalidatePath("/admin/products");
    redirect(createFeedbackUrl(redirectPath, "success", "Ürün güncellendi."));
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(createFeedbackUrl(redirectPath, "error", getErrorMessage(error, "Ürün güncellenemedi.")));
  }
}

export async function deleteProductAction(formData: FormData) {
  const redirectPath = getAdminRedirectPath(formData, "/admin/products");

  try {
    const supabase = await getSupabaseOrThrow();
    const id = String(formData.get("id"));

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      throw error;
    }

    refreshPublicMenuCache();
    revalidatePath("/admin/products");
    redirect(createFeedbackUrl(redirectPath, "success", "Ürün silindi."));
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(createFeedbackUrl(redirectPath, "error", getErrorMessage(error, "Ürün silinemedi.")));
  }
}

export async function moveProductAction(formData: FormData) {
  const redirectPath = getAdminRedirectPath(formData, "/admin/products");

  try {
    const supabase = await getSupabaseOrThrow();
    const id = String(formData.get("id"));
    const direction = String(formData.get("direction"));
    const categoryId = String(formData.get("category_id"));

    const { data: products, error } = await supabase
      .from("products")
      .select("id, sort_order")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });

    if (error) {
      throw error;
    }

    if (!products) {
      throw new Error("Ürün sırası alınamadı.");
    }

    const index = products.findIndex((product) => product.id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (index < 0 || swapIndex < 0 || swapIndex >= products.length) {
      throw new Error("Ürün daha fazla taşınamıyor.");
    }

    const current = products[index];
    const target = products[swapIndex];

    const [currentResult, targetResult] = await Promise.all([
      supabase.from("products").update({ sort_order: target.sort_order }).eq("id", current.id),
      supabase.from("products").update({ sort_order: current.sort_order }).eq("id", target.id)
    ]);

    if (currentResult.error || targetResult.error) {
      throw currentResult.error ?? targetResult.error;
    }

    refreshPublicMenuCache();
    revalidatePath("/admin/products");
    redirect(createFeedbackUrl(redirectPath, "success", "Ürün sırası güncellendi."));
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(createFeedbackUrl(redirectPath, "error", getErrorMessage(error, "Ürün sırası güncellenemedi.")));
  }
}

export async function updateSettingsAction(formData: FormData) {
  const redirectPath = getAdminRedirectPath(formData, "/admin/settings");

  try {
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

    const { error } = await supabase.from("settings").upsert(
      {
        id: 1,
        ...payload,
        logo_url: payload.logo_url || null,
        instagram_url: payload.instagram_url || null
      },
      { onConflict: "id" }
    );

    if (error) {
      throw error;
    }

    refreshPublicMenuCache();
    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    redirect(createFeedbackUrl(redirectPath, "success", "Ayarlar kaydedildi."));
  } catch (error) {
    rethrowIfRedirectError(error);
    redirect(createFeedbackUrl(redirectPath, "error", getErrorMessage(error, "Ayarlar kaydedilemedi.")));
  }
}
