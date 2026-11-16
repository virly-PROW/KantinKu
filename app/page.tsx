import Link from "next/link";

export default function Beranda() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
        Kantin sekolah digital
      </span>
      <h1 className="mt-4 text-4xl font-bold text-blue-700">KantinKu</h1>
      <p className="mt-3 max-w-md text-lg text-slate-600">
        Cek menu, harga, dan stok hari ini. Pesan dari kelas, ambil tanpa antre.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/menu"
          className="rounded bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Lihat Menu
        </Link>
      </div>
    </div>
  );
}