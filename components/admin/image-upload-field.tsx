"use client";

import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { useId, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const STORAGE_BUCKET = "coffeeine-media";

interface ImageUploadFieldProps {
  label: string;
  name: string;
  folder: "logos" | "products" | "categories";
  defaultValue?: string | null;
}

export function ImageUploadField({
  label,
  name,
  folder,
  defaultValue = ""
}: ImageUploadFieldProps) {
  const inputId = useId();
  const fileInputId = useId();
  const [value, setValue] = useState(defaultValue ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const canPreview = value.startsWith("http://") || value.startsWith("https://");

  function uploadImage(file: File) {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Lütfen JPG, PNG veya WebP formatında bir görsel seçin.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("Görsel 3 MB'den küçük olmalı.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, {
          cacheControl: "31536000",
          upsert: false
        });

      if (uploadError) {
        setError(
          `Görsel yüklenemedi. Supabase Storage'da "${STORAGE_BUCKET}" bucket'ının açık olduğundan emin olun.`
        );
        return;
      }

      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      setValue(data.publicUrl);
    });
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="grid gap-3 rounded-[24px] border border-coffee-200 bg-coffee-50/50 p-3 sm:grid-cols-[96px_1fr]">
        <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl bg-white text-coffee-700 sm:w-24">
          {canPreview ? (
            <Image src={value} alt="" fill className="object-cover" sizes="96px" />
          ) : (
            <ImagePlus className="h-7 w-7" />
          )}
        </div>
        <div className="space-y-2">
          <Input
            id={inputId}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://..."
          />
          <div className="flex flex-wrap items-center gap-2">
            <input
              id={fileInputId}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  uploadImage(file);
                }
              }}
            />
            <label
              htmlFor={fileInputId}
              className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-coffee-300 px-4 text-xs font-semibold text-coffee-900 transition hover:bg-coffee-50"
            >
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Görsel seç
            </label>
            {value ? (
              <Button type="button" variant="ghost" size="sm" onClick={() => setValue("")}>
                Görseli kaldır
              </Button>
            ) : null}
          </div>
          {error ? <p className="text-xs leading-5 text-red-700">{error}</p> : null}
          <p className="text-xs leading-5 text-muted-foreground">
            Dosya seçebilir veya mevcut görsel URL'sini elle girebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
