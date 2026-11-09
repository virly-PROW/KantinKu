import Link from "next/link";

export default function Beranda() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-blue-700">KantinKu</h1>
      <p className="mt-2 text-slate-600">
        Lihat menu kantin sekolah dan pesan tanpa antre.
      </p>
      <Link
        href="/menu"
        className="mt-6 inline-block rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
      >
        Lihat menu
      </Link>
    </div>
  );
}