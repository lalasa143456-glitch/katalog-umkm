import Link from "next/link";
import { notFound } from "next/navigation";
import TombolWhatsApp from "@/components/TombolWhatsApp";
import { formatRupiah } from "@/lib/format";
import { buatClientServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  let produk = null;
  let pesanError = null;

  try {
    const supabase = buatClientServer();
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, deskripsi, foto_url, kategori, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil detail produk dari Supabase:", error);
      pesanError =
        "Gagal mengambil detail produk dari database. Periksa koneksi atau pengaturan server, lalu muat ulang halaman.";
    } else {
      produk = data;
    }
  } catch (err) {
    console.error("Kesalahan koneksi Supabase di HalamanDetailProduk:", err);
    pesanError =
      err instanceof Error && err.message.includes("SUPABASE_")
        ? "Konfigurasi database belum lengkap. Pastikan SUPABASE_URL dan SUPABASE_SECRET_KEY sudah diatur di server."
        : "Gagal mengambil detail produk dari database. Periksa koneksi atau pengaturan server, lalu muat ulang halaman.";
  }

  if (pesanError) {
    return (
      <div className="py-8 md:py-12">
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          Kembali ke katalog
        </Link>
        <p
          role="alert"
          className="mt-4 rounded-lg border border-bahaya bg-latar px-4 py-3 text-sm text-bahaya"
        >
          {pesanError}
        </p>
      </div>
    );
  }

  if (!produk) {
    notFound();
  }

  return (
    <article className="grid gap-8 py-8 md:grid-cols-2 md:py-12">
      <img
        src={produk.foto_url}
        alt={produk.nama}
        className="aspect-square w-full rounded-2xl border border-garis bg-permukaan object-cover"
      />
      <div className="flex flex-col gap-4">
        <Link href="/" className="text-sm text-teks-lembut underline underline-offset-4 hover:text-utama">
          Kembali ke katalog
        </Link>
        <p className="text-sm text-teks-lembut">{produk.kategori}</p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{produk.nama}</h1>
        <p className="self-start rounded-md bg-harga-latar px-3 py-1 text-xl font-bold text-harga">
          {formatRupiah(produk.harga)}
        </p>
        <p className="max-w-prose leading-relaxed text-teks-lembut">{produk.deskripsi}</p>
        <TombolWhatsApp produk={produk} />
      </div>
    </article>
  );
}
