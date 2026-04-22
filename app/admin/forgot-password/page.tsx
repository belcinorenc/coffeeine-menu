import Link from "next/link";

import { requestPasswordResetAction } from "@/app/admin/actions";
import { SetupNotice } from "@/components/admin/setup-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/env";

export default async function ForgotPasswordPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "";
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-6">
      <div className="w-full space-y-4">
        {!isSupabaseConfigured() ? <SetupNotice /> : null}

        <Card>
          <CardHeader>
            <CardTitle>Şifrenizi sıfırlayın</CardTitle>
            <CardDescription>
              Yönetici e-postanızı girin; güvenli sıfırlama bağlantısı gönderelim.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "sent" ? (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Bu e-posta Supabase Auth içinde varsa sıfırlama bağlantısı gönderildi.
              </div>
            ) : null}

            {error === "session-expired" ? (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Sıfırlama oturumunuz sona erdi. Lütfen yeni bir bağlantı isteyin.
              </div>
            ) : null}

            <form action={requestPasswordResetAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@coffeeine-menu.com"
                />
              </div>
              <Button type="submit" className="w-full" disabled={!isSupabaseConfigured()}>
                Sıfırlama bağlantısı gönder
              </Button>
            </form>

            <Link
              href="/admin/login"
              className="mt-4 inline-flex text-sm font-medium text-coffee-800 hover:text-coffee-900"
            >
              Giriş ekranına dön
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
