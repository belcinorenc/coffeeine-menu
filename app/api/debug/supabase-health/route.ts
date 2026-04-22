import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!supabaseUrl) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing NEXT_PUBLIC_SUPABASE_URL"
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      cache: "no-store",
      headers: anonKey
        ? {
            apikey: anonKey
          }
        : undefined
    });

    const body = await response.text();

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      supabaseUrl,
      body: body.slice(0, 500),
      checkedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        supabaseUrl,
        error: error instanceof Error ? error.message : "Unknown fetch error",
        checkedAt: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
