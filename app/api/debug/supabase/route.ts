import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  let supabaseHost = "";

  try {
    supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : "";
  } catch {
    supabaseHost = "invalid-url";
  }

  return NextResponse.json({
    supabaseUrl,
    supabaseHost,
    hasAnonKey: Boolean(anonKey),
    anonKeyPrefix: anonKey ? anonKey.slice(0, 12) : "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
    checkedAt: new Date().toISOString()
  });
}
