import Link from "next/link";

export default function Beranda() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-blue-700">KantinKu</h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Lihat menu kantin sekolah lengkap dengan harga dan stok hari ini, simpan
        menu favoritmu, lalu pesan tanpa perlu antre di jam istirahat.
      </p>
      <Link
        href="/menu"
        className="mt-6 inline-block rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Lihat Menu Kantin
      </Link>
    </div>
  );
}