/**
 * Server-only Supabase-Client mit Service-Role-Key.
 *
 * Bypassed RLS — daher NUR auf dem Server verwenden, nie an den Browser geben.
 * Wir nutzen Supabase nur als Datenbank (kein Supabase-Auth, kein Storage).
 *
 * ENV:
 *   NEXT_PUBLIC_SUPABASE_URL — Projekt-URL (z. B. https://xxx.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY — Service-Role-Key (Settings → API → service_role)
 *
 * Schema: `shop` (eigenes Schema; default ist `public`, das wir hier umgehen).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;
let cachedError: string | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  if (cachedError) throw new Error(cachedError);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    cachedError =
      "Supabase ist nicht konfiguriert: bitte NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY in .env.local setzen.";
    throw new Error(cachedError);
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "shop" },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && !!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
}
