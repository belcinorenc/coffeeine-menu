import Link from "next/link";
import { ArrowRight, Coffee, FolderKanban, Plus, Settings2 } from "lucide-react";

import { SetupNotice } from "@/components/admin/setup-notice";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData().catch(() => null);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge variant="secondary">Operasyon</Badge>
        <h1 className="font-serif text-4xl text-coffee-900">Coffeeine yönetim paneli</h1>
        <p className="text-sm text-muted-foreground">
          QR menüyü yönetin, fiyatları güncelleyin ve cafe bilgilerini güncel tutun.
        </p>
      </div>

      {!isSupabaseConfigured() ? <SetupNotice /> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction href="/admin/products" label="Ürün ekle veya düzenle" icon={<Plus className="h-4 w-4" />} />
        <QuickAction href="/admin/categories" label="Kategorileri düzenle" icon={<FolderKanban className="h-4 w-4" />} />
        <QuickAction href="/admin/settings" label="Cafe bilgilerini güncelle" icon={<Settings2 className="h-4 w-4" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Kategoriler"
          value={dashboard?.categoryCount ?? 0}
          description="Menü sırasını ve görünürlüğü düzenleyin."
          href="/admin/categories"
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <DashboardCard
          title="Ürünler"
          value={dashboard?.productCount ?? 0}
          description="Fiyatları, etiketleri ve stok durumunu hızlıca güncelleyin."
          href="/admin/products"
          icon={<Coffee className="h-5 w-5" />}
        />
        <DashboardCard
          title="Marka Ayarları"
          value={dashboard?.settings?.cafe_name ?? "Coffeeine"}
          description="Ana sayfa metinlerini, iletişim bilgilerini ve marka detaylarını yönetin."
          href="/admin/settings"
          icon={<Settings2 className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-[24px] border border-coffee-200 bg-white/70 px-4 py-3 text-sm font-semibold text-coffee-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
    >
      <span className="flex items-center gap-2">
        <span className="rounded-full bg-coffee-100 p-2 text-coffee-800">{icon}</span>
        {label}
      </span>
      <ArrowRight className="h-4 w-4 text-coffee-600" />
    </Link>
  );
}

function DashboardCard({
  title,
  value,
  description,
  href,
  icon
}: {
  title: string;
  value: string | number;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-coffee-100 p-2 text-coffee-800">{icon}</div>
          <Badge variant="secondary">Canlı</Badge>
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-serif text-4xl text-coffee-900">{value}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        <Link
          href={href}
          className="inline-flex h-11 w-full items-center justify-between rounded-full border border-coffee-300 px-5 text-sm font-semibold text-coffee-900 transition hover:bg-coffee-50"
        >
          Bölümü aç
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
