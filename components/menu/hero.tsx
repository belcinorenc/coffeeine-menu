import Image from "next/image";

import type { Settings } from "@/lib/types";

interface HeroProps {
  settings: Settings;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-white/50 bg-coffee-glow px-5 py-4 shadow-glow sm:px-6">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.34em] text-coffee-700/75">Coffeeine</p>
        </div>

        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-white/95 shadow-lg shadow-coffee-900/10 sm:h-24 sm:w-24">
          {settings.logo_url ? (
            <Image
              src={settings.logo_url}
              alt={settings.cafe_name}
              fill
              sizes="(max-width: 640px) 80px, 96px"
              quality={100}
              className="object-contain p-2"
            />
          ) : (
            <span className="font-serif text-3xl text-coffee-900">{settings.cafe_name.slice(0, 1)}</span>
          )}
        </div>

        <div className="min-w-0 text-right">
          <p className="truncate text-xs uppercase tracking-[0.34em] text-coffee-700/75">QR Menu</p>
        </div>
      </div>
    </section>
  );
}
