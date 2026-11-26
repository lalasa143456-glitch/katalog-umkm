"use server";

import { redirect } from "next/navigation";
import { buatClientSesi } from "@/lib/supabase/server";

/**
 * Memproses login admin dengan email dan password via Supabase Auth di server.
 */
export async function loginAdmin(_stateSebelumnya, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Email dan password wajib diisi.",
      email,
    };
  }

  let berhasil = false;

  try {
    const supabase = await buatClientSesi();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Login admin gagal:", error.message);
      const kredensialSalah =
        error.status === 400 ||
        error.message.toLowerCase().includes("invalid login credentials");

      return {
        error: kredensialSalah
          ? "Email atau password salah. Periksa kembali lalu coba lagi."
          : "Gagal masuk ke akun admin. Coba lagi beberapa saat.",
        email,
      };
    }

    berhasil = true;
  } catch (err) {
    console.error("Kesalahan saat login admin:", err);
    return {
      error:
        err instanceof Error && err.message.includes("SUPABASE_")
          ? "Konfigurasi autentikasi server belum lengkap. Hubungi pengelola aplikasi."
          : "Terjadi kesalahan saat menghubungi layanan autentikasi. Coba lagi nanti.",
      email,
    };
  }

  if (berhasil) {
    redirect("/admin");
  }
}

/**
 * Mengakhiri sesi admin lalu mengarahkan ke halaman login.
 */
export async function keluarAdmin() {
  try {
    const supabase = await buatClientSesi();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Kesalahan saat keluar admin:", err);
  }

  redirect("/admin/login");
}
