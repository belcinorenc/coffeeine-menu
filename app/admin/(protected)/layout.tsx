import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { isAllowedAdminEmail, isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;

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

  return (
    <AdminShell userEmail={userEmail} isConfigured={isSupabaseConfigured()}>
      {children}
    </AdminShell>
  );
}
