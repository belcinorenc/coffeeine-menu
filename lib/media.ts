const STORAGE_BUCKET = "coffeeine-media";
const STORAGE_PUBLIC_MARKER = `/storage/v1/object/public/${STORAGE_BUCKET}/`;

function getSupabaseBaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "") ?? "";
}

export function getStorageObjectPath(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const markerIndex = trimmed.indexOf(STORAGE_PUBLIC_MARKER);

  if (markerIndex >= 0) {
    return decodeURIComponent(trimmed.slice(markerIndex + STORAGE_PUBLIC_MARKER.length).split("?")[0]);
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return null;
  }

  return trimmed.replace(/^\/+/, "");
}

export function resolveMediaUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const objectPath = getStorageObjectPath(trimmed);
  const baseUrl = getSupabaseBaseUrl();

  if (objectPath && baseUrl) {
    return `${baseUrl}${STORAGE_PUBLIC_MARKER}${encodeURI(objectPath)}`;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return null;
}

export { STORAGE_BUCKET };
