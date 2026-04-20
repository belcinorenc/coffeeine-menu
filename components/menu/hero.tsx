import { Instagram, MapPin, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Settings } from "@/lib/types";

interface HeroProps {
  settings: Settings;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/50 bg-coffee-glow px-5 py-6 shadow-glow sm:px-8 sm:py-8">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-coffee-500/20 to-transparent" />

      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary" className="bg-white/75 text-coffee-800">
            Coffeeine QR Menu
          </Badge>
          <p className="text-xs uppercase tracking-[0.28em] text-coffee-700/80">
            Scan. Sip. Stay.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.34em] text-coffee-700/80">Coffeeine</p>
            <h1 className="max-w-xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
              {settings.hero_title}
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-coffee-800/85 sm:text-base">
            {settings.hero_subtitle}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {settings.phone ? (
            <InfoPill icon={<Phone className="h-4 w-4" />} label={settings.phone} />
          ) : null}
          {settings.address ? (
            <InfoPill icon={<MapPin className="h-4 w-4" />} label={settings.address} />
          ) : null}
          {settings.instagram_url ? (
            <a
              href={settings.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm font-medium text-coffee-900 transition hover:bg-white"
            >
              <span className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Follow on Instagram
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-coffee-900">
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
    </div>
  );
}
