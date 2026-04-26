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
      className={`flex h-full flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/80 shadow-glow transition ${
        isUnavailable ? "opacity-60 saturate-50" : "hover:-translate-y-0.5"
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-coffee-100 to-oat">
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
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="line-clamp-2 font-serif text-xl leading-tight text-ink sm:text-2xl">
                {product.name}
              </h3>
              {product.badge ? <Badge variant="secondary">{product.badge}</Badge> : null}
              {!product.is_available ? <Badge variant="muted">Stokta yok</Badge> : null}
            </div>
          </div>

          <p className="whitespace-nowrap rounded-full bg-oat px-3 py-1 text-sm font-semibold text-coffee-900">
            {formatCurrency(product.price)}
          </p>
        </div>

        {product.description ? (
          <p className="line-clamp-3 text-sm leading-6 text-coffee-800/80">
            {product.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <div className="mt-auto pt-1 text-xs uppercase tracking-[0.22em] text-coffee-700/55">
          {product.is_available ? "Siparişe hazır" : "Geçici olarak kapalı"}
        </div>
      </div>
    </article>
  );
}
