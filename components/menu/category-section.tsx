import { ProductCard } from "@/components/menu/product-card";
import type { MenuCategory } from "@/lib/types";

interface CategorySectionProps {
  category: MenuCategory;
}

export function CategorySection({ category }: CategorySectionProps) {
  return (
    <section id={category.slug} className="scroll-mt-28 space-y-5">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.28em] text-coffee-700/70">Menu Category</p>
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">{category.name}</h2>
      </div>

      <div className="grid gap-4">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
