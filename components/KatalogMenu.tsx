"use client";
import { useState } from "react";
import type { Menu } from "@/data/menu";
import KartuMenu from "./KartuMenu";

const daftarKategori = ["Semua", "Makanan", "Minuman", "Camilan"];

export default function KatalogMenu({ items }: { items: Menu[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("awal");

  const hasil = items.filter(
    (m) =>
      m.nama.toLowerCase().includes(cari.toLowerCase()) &&
      (kategori === "Semua" || m.kategori === kategori)
  );

  const tersusun = [...hasil].sort((a, b) => {
    if (urut === "murah") return a.harga - b.harga;
    if (urut === "mahal") return b.harga - a.harga;
    if (urut === "nama") return a.nama.localeCompare(b.nama);
    return 0;
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari menu..."
          className="rounded border bg-white px-3 py-2"
        />
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="rounded border bg-white px-3 py-2"
        >
          {daftarKategori.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <select
          value={urut}
          onChange={(e) => setUrut(e.target.value)}
          className="rounded border bg-white px-3 py-2"
        >
          <option value="awal">Urutan awal</option>
          <option value="murah">Harga termurah</option>
          <option value="mahal">Harga termahal</option>
          <option value="nama">Nama A-Z</option>
        </select>
      </div>
      {tersusun.length === 0 ? (
        <p className="text-slate-500">Menu tidak ditemukan.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tersusun.map((m) => (
            <KartuMenu key={m.id} item={m} />
          ))}
        </div>
      )}
    </div>
  );
}