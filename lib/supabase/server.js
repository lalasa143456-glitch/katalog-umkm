import { createClient } from "@supabase/supabase-js";

/**
 * Membuat client Supabase di sisi server memakai SUPABASE_SECRET_KEY.
 * Hanya untuk akses data dari server (Server Component / Server Action / Route Handler).
 */
export function buatClientServer() {
  const rawUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!rawUrl || !secretKey) {
    throw new Error(
      "Variabel lingkungan SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur."
    );
  }

  const url = rawUrl.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");

  return createClient(url, secretKey.trim(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
