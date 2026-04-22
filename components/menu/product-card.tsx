import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isUnavailable = !product.is_available;

  return (
    <article
      className={`overflow-hidden rounded-[28px] border border-white/60 bg-white/80 shadow-glow transition ${
        isUnavailable ? "opacity-60 saturate-50" : "hover:-translate-y-0.5"
      }`}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
        <div className="relative h-28 w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-coffee-100 to-oat sm:h-24 sm:w-24">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif text-lg text-coffee-700">
              {product.name.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-2xl text-ink">{product.name}</h3>
                {product.badge ? <Badge variant="secondary">{product.badge}</Badge> : null}
                {!product.is_available ? <Badge variant="muted">Stokta yok</Badge> : null}
              </div>
              {product.description ? (
                <p className="mt-2 max-w-xl text-sm leading-6 text-coffee-800/80">
                  {product.description}
                </p>
              ) : null}
            </div>

            <p className="whitespace-nowrap rounded-full bg-oat px-3 py-1 text-sm font-semibold text-coffee-900">
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
