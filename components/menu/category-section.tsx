import Image from "next/image";

import { ProductCard } from "@/components/menu/product-card";
import type { MenuCategory } from "@/lib/types";

interface CategorySectionProps {
  category: MenuCategory;
}

export function CategorySection({ category }: CategorySectionProps) {
  return (
    <section id={category.slug} className="scroll-mt-28 space-y-5">
      <div className="flex items-center gap-4">
        {category.image_url ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-[22px] bg-coffee-100 shadow-sm">
            <Image
              src={category.image_url}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        ) : null}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-coffee-700/70">Menü kategorisi</p>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">{category.name}</h2>
        </div>
      </div>

      <div className="grid gap-4">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
