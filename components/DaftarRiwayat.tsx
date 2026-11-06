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

  if (riwayat.length === 0) {
    return <p className="text-slate-500">Belum ada riwayat pesanan.</p>;
  }

  return (
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
  );
}