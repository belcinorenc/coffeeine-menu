import Link from "next/link";
import Image from "next/image";
import { Coffee, FolderKanban, LayoutDashboard, Settings2 } from "lucide-react";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const navigation = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Kategoriler", icon: FolderKanban },
  { href: "/admin/products", label: "Ürünler", icon: Coffee },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings2 }
];

interface AdminShellProps {
  children: React.ReactNode;
  userEmail?: string | null;
  isConfigured: boolean;
  cafeName?: string;
  logoUrl?: string | null;
}

export function AdminShell({
  children,
  userEmail,
  isConfigured,
  cafeName = "Coffeeine",
  logoUrl
}: AdminShellProps) {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-coffee-800 font-serif text-xl text-white">
              {logoUrl ? (
                <Image src={logoUrl} alt={cafeName} fill className="object-cover" sizes="48px" />
              ) : (
                cafeName.slice(0, 1)
              )}
            </div>
            <div>
              <p className="font-serif text-2xl text-coffee-900">{cafeName}</p>
              <p className="text-sm text-muted-foreground">Yönetim paneli</p>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <nav className="grid gap-2">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-coffee-900 transition hover:bg-coffee-50"
              >
                <Icon className="h-4 w-4 text-coffee-700" />
                {label}
              </Link>
            ))}
          </nav>
        </Card>

        <Card className="p-4">
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isConfigured ? "success" : "warning"}>
                {isConfigured ? "Bağlandı" : "Demo modu"}
              </Badge>
              {userEmail ? <span className="text-coffee-900">{userEmail}</span> : null}
            </div>
            {userEmail ? <SignOutButton /> : null}
          </div>
        </Card>
      </aside>

      <section className="space-y-6">{children}</section>
    </div>
  );
}
