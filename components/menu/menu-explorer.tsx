"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CategorySection } from "@/components/menu/category-section";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MenuCategory } from "@/lib/types";

interface MenuExplorerProps {
  categories: MenuCategory[];
}

export function MenuExplorer({ categories }: MenuExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return categories;
    }

    return categories
      .map((category) => ({
        ...category,
        products: category.products.filter((product) => {
          return [product.name, product.description, product.badge, category.name]
            .filter(Boolean)
            .some((value) => value?.toLowerCase().includes(normalizedQuery));
        })
      }))
      .filter((category) => category.products.length > 0);
  }, [categories, query]);

  useEffect(() => {
    if (query) {
      return;
    }

    const updateActiveCategory = () => {
      const activationOffset = 180;
      let nextActiveSlug = categories[0]?.slug ?? "";

      for (const category of categories) {
        const element = document.getElementById(category.slug);

        if (!element) {
          continue;
        }

        const top = element.getBoundingClientRect().top;

        if (top - activationOffset <= 0) {
          nextActiveSlug = category.slug;
        } else {
          break;
        }
      }

      if (nextActiveSlug) {
        setActiveSlug(nextActiveSlug);
      }
    };

    updateActiveCategory();
    window.addEventListener("scroll", updateActiveCategory, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveCategory);
  }, [categories, query]);

  return (
    <section className="space-y-6">
      <div className="sticky top-3 z-20 space-y-3 sm:top-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee-600" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Kahve, tatlı veya kahvaltı ara..."
            className="h-12 rounded-full border-white/70 bg-white/90 pl-11 pr-12 shadow-glow"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-coffee-100 text-coffee-800 transition hover:bg-coffee-200"
              aria-label="Aramayı temizle"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>

        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <div className="inline-flex min-w-full gap-2 rounded-full border border-white/50 bg-white/85 p-2 shadow-glow backdrop-blur sm:min-w-0">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.slug}`}
                onClick={() => setActiveSlug(category.slug)}
                className={cn(
                  "rounded-full px-3 py-2 text-[13px] font-medium text-coffee-800 transition whitespace-nowrap sm:px-4 sm:text-sm",
                  activeSlug === category.slug && !query
                    ? "bg-coffee-800 text-white shadow-sm"
                    : "bg-coffee-50 hover:bg-coffee-100"
                )}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState
          title="Sonuç bulunamadı"
          description="Farklı bir arama deneyin veya yukarıdaki kategorilere göz atın."
        />
      ) : (
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
