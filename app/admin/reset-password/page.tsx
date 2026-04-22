import { redirect } from "next/navigation";

import { updatePasswordAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=config");
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    redirect("/admin/forgot-password?error=session-expired");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Yeni şifre belirleyin</CardTitle>
          <CardDescription>
            En az 6 karakter kullanın. Kaydettikten sonra yeni şifrenizle giriş yapın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error === "invalid-password" &&
                "Şifreler eşleşmeli ve en az 6 karakter olmalı."}
              {error === "update-failed" &&
                "Şifreniz güncellenemedi. Yeni bir sıfırlama bağlantısı isteyip tekrar deneyin."}
            </div>
          ) : null}

          <form action={updatePasswordAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Yeni şifre</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Yeni şifre tekrar</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full">
              Yeni şifreyi kaydet
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
