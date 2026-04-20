import { CafeFooter } from "@/components/menu/cafe-footer";
import { CategoryNav } from "@/components/menu/category-nav";
import { CategorySection } from "@/components/menu/category-section";
import { Hero } from "@/components/menu/hero";
import { EmptyState } from "@/components/shared/empty-state";
import { getPublicMenuData } from "@/lib/data";

export default async function HomePage() {
  const { settings, categories } = await getPublicMenuData();

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6">
      <Hero settings={settings} />

      <CategoryNav categories={categories} />

      <section className="space-y-8">
        {categories.length === 0 ? (
          <EmptyState
            title="Menu is being prepared"
            description="Add categories and products from the admin panel to publish Coffeeine's QR menu."
          />
        ) : (
          categories.map((category) => <CategorySection key={category.id} category={category} />)
        )}
      </section>

      <CafeFooter settings={settings} />
    </main>
  );
}
