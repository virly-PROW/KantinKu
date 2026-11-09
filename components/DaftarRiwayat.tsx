"use client";
import { useEffect, useState } from "react";
import { rupiah } from "@/data/menu";

type Pesanan = {
  id: number;
  tanggal: string;
  nama: string;
  baris: { nama: string; jumlah: number; subtotal: number }[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  antar: boolean;
  kelas: string;
  total: number;
};

export default function DaftarRiwayat() {
  const [riwayat, setRiwayat] = useState<Pesanan[]>([]);

  useEffect(() => {
    const data: Pesanan[] = JSON.parse(localStorage.getItem("riwayat") ?? "[]");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRiwayat([...data].reverse());
  }, []);

  function hapusSemua() {
    if (!window.confirm("Hapus semua riwayat pesanan? Tindakan ini tidak bisa dibatalkan.")) {
      return;
    }
    localStorage.removeItem("riwayat");
    setRiwayat([]);
  }

  if (riwayat.length === 0) {
    return <p className="text-slate-500">Belum ada pesanan.</p>;
  }

  const totalBelanja = riwayat.reduce((j, p) => j + p.total, 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-slate-600">
          {riwayat.length} pesanan, total belanja {rupiah(totalBelanja)}
        </p>
        <button 
          onClick={hapusSemua}
          className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700">
            Hapus riwayat
          </button>
      </div>
      <div className="space-y-4">
        {riwayat.map((p) => (
          <div key={p.id} className="rounded-xl border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{p.nama}</p>
              <p className="text-sm text-slate-500">
                {new Date(p.tanggal).toLocaleString("id-ID")}
              </p>
            </div>
            <ul className="mt-2 space-y-1">
              {p.baris.map((b) => (
                <li key={b.nama}>
                  {b.nama} x {b.jumlah} = {rupiah(b.subtotal)}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-slate-600">Subtotal: {rupiah(p.subtotal)}</p>
            {p.diskon > 0 && (
              <p className="text-sm text-slate-600">Diskon: -{rupiah(p.diskon)}</p>
            )}
            <p className="text-sm text-slate-600">
              {p.antar
                ? `Antar ke ${p.kelas}: ${rupiah(p.ongkir)}`
                : "Diambil sendiri di kantin"}
            </p>
            <p className="mt-1 font-semibold">Total bayar: {rupiah(p.total)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}