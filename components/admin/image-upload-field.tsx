"use client";

import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { useId, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const STORAGE_BUCKET = "coffeeine-media";
const MAX_IMAGE_SIZE_BYTES = 1024 * 1024;

interface ImageUploadFieldProps {
  label: string;
  name: string;
  folder: "logos" | "products" | "categories";
  storagePath: string;
  defaultValue?: string | null;
}

export function ImageUploadField({
  label,
  name,
  folder,
  storagePath,
  defaultValue = ""
}: ImageUploadFieldProps) {
  const inputId = useId();
  const fileInputId = useId();
  const [value, setValue] = useState(defaultValue ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const canPreview = value.startsWith("http://") || value.startsWith("https://");
  const normalizedStoragePath = `${folder}/${storagePath.replace(/^\/+/, "").replace(/\.[^.]+$/, "")}.webp`;

  function getStoragePathFromPublicUrl(url: string) {
    const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
    const markerIndex = url.indexOf(marker);

    if (markerIndex < 0) {
      return null;
    }

    return decodeURIComponent(url.slice(markerIndex + marker.length).split("?")[0]);
  }

  function uploadImage(file: File) {
    setError("");

    if (file.type !== "image/webp") {
      setError("Görseller WebP formatında olmalı. Lütfen .webp dosyası seçin.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Görsel 1 MB'den küçük olmalı.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const previousPath = getStoragePathFromPublicUrl(value);

      if (previousPath && previousPath !== normalizedStoragePath) {
        await supabase.storage.from(STORAGE_BUCKET).remove([previousPath]);
      }

      await supabase.storage.from(STORAGE_BUCKET).remove([normalizedStoragePath]);

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(normalizedStoragePath, file, {
          cacheControl: "3600",
          contentType: "image/webp",
          upsert: true
        });

      if (uploadError) {
        setError(
          `Görsel yüklenemedi. Supabase Storage'da "${STORAGE_BUCKET}" bucket'ının açık olduğundan emin olun.`
        );
        return;
      }

      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(normalizedStoragePath);
      setValue(`${data.publicUrl}?v=${Date.now()}`);
    });
  }

  function removeImage() {
    setError("");

    startTransition(async () => {
      const supabase = createClient();
      const currentPath = getStoragePathFromPublicUrl(value);
      const pathsToRemove = Array.from(
        new Set([currentPath, normalizedStoragePath].filter(Boolean))
      ) as string[];

      if (pathsToRemove.length > 0) {
        await supabase.storage.from(STORAGE_BUCKET).remove(pathsToRemove);
      }

      setValue("");
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
              accept="image/webp,.webp"
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
              <Button type="button" variant="ghost" size="sm" onClick={removeImage}>
                Görseli kaldır
              </Button>
            ) : null}
          </div>
          {error ? <p className="text-xs leading-5 text-red-700">{error}</p> : null}
          <p className="text-xs leading-5 text-muted-foreground">
            Sadece WebP kabul edilir. Maksimum dosya boyutu 1 MB; yeni yükleme önceki dosyanın
            yerine geçer.
          </p>
        </div>
      </div>
    </div>
  );
}
