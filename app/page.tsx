import { CafeFooter } from "@/components/menu/cafe-footer";
import { Hero } from "@/components/menu/hero";
import { MenuExplorer } from "@/components/menu/menu-explorer";
import { EmptyState } from "@/components/shared/empty-state";
import { getPublicMenuData } from "@/lib/data";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function HomePage() {
  const { settings, categories } = await getPublicMenuData();

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6">
      <Hero settings={settings} />

      {categories.length === 0 ? (
        <EmptyState
          title="Menu is being prepared"
          description="Add categories and products from the admin panel to publish Coffeeine's QR menu."
        />
      ) : (
        <MenuExplorer categories={categories} />
      )}

      <CafeFooter settings={settings} />
    </main>
  );
}
