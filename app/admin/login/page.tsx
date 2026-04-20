import { redirect } from "next/navigation";

import { signInAction } from "@/app/admin/actions";
import { SetupNotice } from "@/components/admin/setup-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAllowedAdminEmail, isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/admin";
  const error = typeof params.error === "string" ? params.error : "";
  const unauthorizedEmail = typeof params.email === "string" ? params.email : "";

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();

    if (supabase) {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user && isAllowedAdminEmail(user.email)) {
        redirect("/admin");
      }
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-6 sm:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[32px] border border-white/60 bg-coffee-glow p-8 shadow-glow">
          <p className="text-sm uppercase tracking-[0.3em] text-coffee-700/80">Coffeeine</p>
          <h1 className="mt-4 max-w-md font-serif text-5xl leading-tight text-ink">
            Admin access for your QR menu operations.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-coffee-800/80">
            Staff can update categories, hide sold-out items, refresh pricing, and edit brand
            information without touching code.
          </p>
        </section>

        <div className="space-y-4">
          {!isSupabaseConfigured() ? <SetupNotice /> : null}

          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Use your Supabase Auth email and password to access the admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error === "config" && "Add your Supabase environment variables first."}
                  {error === "invalid-credentials" && "Email or password was incorrect."}
                  {error === "unauthorized" &&
                    `This account (${unauthorizedEmail || "current email"}) is valid in Supabase Auth but is not listed in ADMIN_EMAILS. Add it to your local or Vercel environment variables and redeploy if needed.`}
                </div>
              ) : null}

              <form action={signInAction} className="space-y-4">
                <input type="hidden" name="next" value={next} />
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="admin@coffeeine-menu.com"
                    defaultValue={unauthorizedEmail}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full" disabled={!isSupabaseConfigured()}>
                  Login to admin
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
