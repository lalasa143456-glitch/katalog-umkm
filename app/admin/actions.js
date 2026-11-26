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

/**
 * Mengganti password admin yang sedang login via Supabase Auth di server.
 */
export async function gantiPassword(_stateSebelumnya, formData) {
  const passwordBaru = String(formData.get("password_baru") ?? "");
  const konfirmasi = String(formData.get("konfirmasi_password") ?? "");

  if (passwordBaru.length < 8) {
    return {
      status: "error",
      pesan: "Password baru minimal 8 karakter.",
    };
  }

  if (passwordBaru !== konfirmasi) {
    return {
      status: "error",
      pesan: "Konfirmasi password tidak sama dengan password baru.",
    };
  }

  try {
    const supabase = await buatClientSesi();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        status: "error",
        pesan: "Anda harus masuk sebagai admin terlebih dahulu sebelum mengganti password.",
      };
    }

    const { error } = await supabase.auth.updateUser({ password: passwordBaru });

    if (error) {
      console.error("Gagal mengganti password admin:", error.message);
      const samaDenganLama = error.message
        .toLowerCase()
        .includes("different from the old password");

      return {
        status: "error",
        pesan: samaDenganLama
          ? "Password baru harus berbeda dari password yang sekarang dipakai."
          : "Gagal mengganti password. Pastikan Anda masih masuk lalu coba lagi.",
      };
    }

    return {
      status: "sukses",
      pesan: "Password berhasil diganti.",
    };
  } catch (err) {
    console.error("Kesalahan saat ganti password admin:", err);
    return {
      status: "error",
      pesan:
        err instanceof Error && err.message.includes("SUPABASE_")
          ? "Konfigurasi autentikasi server belum lengkap. Hubungi pengelola aplikasi."
          : "Terjadi kesalahan saat menghubungi layanan autentikasi. Coba lagi nanti.",
    };
  }
}
