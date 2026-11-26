import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function ambilUrlSupabase() {
  const rawUrl = process.env.SUPABASE_URL;
  if (!rawUrl || !rawUrl.trim()) {
    throw new Error("Variabel lingkungan SUPABASE_URL belum diatur.");
  }
  return rawUrl.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
}

/**
 * Membuat client Supabase di sisi server memakai SUPABASE_SECRET_KEY.
 * Hanya untuk akses data dari server (Server Component / Server Action / Route Handler).
 */
export function buatClientServer() {
  const url = ambilUrlSupabase();
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!secretKey || !secretKey.trim()) {
    throw new Error("Variabel lingkungan SUPABASE_SECRET_KEY belum diatur.");
  }

  return createClient(url, secretKey.trim(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Membuat client Supabase di sisi server memakai SUPABASE_PUBLISHABLE_KEY dan cookie sesi (@supabase/ssr).
 * Dipakai untuk autentikasi dan aksi admin agar sesi tersimpan di cookie dan RLS tetap berlaku.
 */
export async function buatClientSesi() {
  const url = ambilUrlSupabase();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!publishableKey || !publishableKey.trim()) {
    throw new Error("Variabel lingkungan SUPABASE_PUBLISHABLE_KEY belum diatur.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, publishableKey.trim(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Diabaikan jika dipanggil dari Server Component yang tidak bisa menulis cookie.
        }
      },
    },
  });
}
