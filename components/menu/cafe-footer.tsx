import Image from "next/image";
import { Clock3, Instagram, MapPin, Phone } from "lucide-react";

import type { Settings } from "@/lib/types";

interface CafeFooterProps {
  settings: Settings;
}

export function CafeFooter({ settings }: CafeFooterProps) {
  return (
    <footer className="rounded-[32px] border border-coffee-200/70 bg-coffee-900 px-6 py-8 text-coffee-50 shadow-glow">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-coffee-700">
              {settings.logo_url ? (
                <Image
                  src={settings.logo_url}
                  alt={settings.cafe_name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <span className="font-serif text-xl">{settings.cafe_name.slice(0, 1)}</span>
              )}
            </div>
            <div>
              <p className="font-serif text-2xl">{settings.cafe_name}</p>
              <p className="text-sm text-coffee-100/70">Craft coffee and all-day comfort.</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-coffee-50/80">{settings.hero_subtitle}</p>
        </div>

        <div className="grid gap-3 text-sm text-coffee-50/80 sm:min-w-[280px]">
          {settings.instagram_url ? (
            <FooterLine
              icon={<Instagram className="h-4 w-4" />}
              content={
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="hover:text-white">
                  {settings.instagram_url.replace("https://", "")}
                </a>
              }
            />
          ) : null}
          {settings.phone ? (
            <FooterLine icon={<Phone className="h-4 w-4" />} content={<span>{settings.phone}</span>} />
          ) : null}
          {settings.address ? (
            <FooterLine icon={<MapPin className="h-4 w-4" />} content={<span>{settings.address}</span>} />
          ) : null}
          {settings.working_hours ? (
            <FooterLine icon={<Clock3 className="h-4 w-4" />} content={<span>{settings.working_hours}</span>} />
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function FooterLine({
  icon,
  content
}: {
  icon: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="mt-0.5">{icon}</div>
      <div>{content}</div>
    </div>
  );
}
