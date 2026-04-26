import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isUnavailable = !product.is_available;
  const optionItems = (product.product_options ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/80 shadow-glow transition ${
        isUnavailable ? "opacity-60 saturate-50" : "hover:-translate-y-0.5"
      }`}
    >
      <div className="relative aspect-[6/5] w-full overflow-hidden bg-gradient-to-br from-coffee-100 to-oat">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 719px) 50vw, (max-width: 1279px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif text-3xl text-coffee-700">
            {product.name.slice(0, 1)}
          </div>
        )}
        {product.badge ? (
          <Badge
            variant="secondary"
            className="absolute right-3 top-3 border-white/70 bg-white/90 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-coffee-900 shadow-sm backdrop-blur"
          >
            {product.badge}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-4">
        <h3 className="line-clamp-2 font-serif text-lg leading-[1.1] text-ink sm:text-xl">
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2">
          {!product.is_available ? (
            <Badge variant="muted" className="whitespace-nowrap">
              Stokta yok
            </Badge>
          ) : null}
          <p className="ml-auto whitespace-nowrap rounded-full bg-oat px-3 py-1 text-sm font-semibold text-coffee-900">
            {formatCurrency(product.price)}
          </p>
        </div>

        {product.description ? (
          <p className="line-clamp-3 text-sm leading-5 text-coffee-800/80">
            {product.description}
          </p>
        ) : null}

        {optionItems.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {optionItems.map((option) => (
              <span
                key={option}
                className="inline-flex rounded-full border border-coffee-200 bg-coffee-50 px-2.5 py-1 text-[11px] font-medium text-coffee-800"
              >
                {option}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
