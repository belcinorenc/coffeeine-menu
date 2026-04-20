import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryNavProps {
  categories: Category[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  return (
    <div className="sticky top-3 z-20 -mx-4 overflow-x-auto px-4 pb-2 sm:top-4 sm:mx-0 sm:px-0">
      <div className="inline-flex min-w-full gap-2 rounded-full border border-white/50 bg-white/80 p-2 shadow-glow backdrop-blur sm:min-w-0">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.slug}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium text-coffee-800 transition",
              "bg-coffee-50 hover:bg-coffee-100"
            )}
          >
            {category.name}
          </a>
        ))}
      </div>
    </div>
  );
}
