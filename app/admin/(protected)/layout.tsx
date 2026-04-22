import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getSettings } from "@/lib/data";
import { isAllowedAdminEmail, isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;
  let cafeName = "Coffeeine";
  let logoUrl: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      redirect("/admin/login");
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    if (!isAllowedAdminEmail(user.email)) {
      await supabase.auth.signOut();
      redirect("/admin/login?error=unauthorized");
    }

    userEmail = user.email ?? null;
  }

  const settings = await getSettings().catch(() => null);

  if (settings) {
    cafeName = settings.cafe_name;
    logoUrl = settings.logo_url;
  }

  return (
    <AdminShell
      userEmail={userEmail}
      isConfigured={isSupabaseConfigured()}
      cafeName={cafeName}
      logoUrl={logoUrl}
    >
      {children}
    </AdminShell>
  );
}
