"use client";
import { useState } from "react";
import { rupiah, type Menu } from "@/data/menu";

export default function FormTambah({ item }: { item: Menu }) {
  const [jumlah, setJumlah] = useState("1");
  const [pesan, setPesan] = useState<{ teks: string; ok: boolean } | null>(null);

  const n = Number(jumlah);
  const total = Number.isInteger(n) && n > 0 ? item.harga * n : 0;

  function tambah(e: React.FormEvent) {
    e.preventDefault();
    if (!Number.isInteger(n) || n < 1) {
      setPesan({ teks: "Jumlah minimal 1.", ok: false });
      return;
    }
    const keranjang: { id: number; jumlah: number }[] = JSON.parse(
      localStorage.getItem("keranjang") ?? "[]"
    );
    const ada = keranjang.find((k) => k.id === item.id);
    const sudah = ada?.jumlah ?? 0;
    if (sudah + n > item.stok) {
      setPesan({
        teks: `Jumlah melebihi stok. Stok ${item.stok}, di keranjang sudah ada ${sudah}.`,
        ok: false,
      });
      return;
    }
    const baru = ada
      ? keranjang.map((k) => (k.id === item.id ? { ...k, jumlah: sudah + n } : k))
      : [...keranjang, { id: item.id, jumlah: n }];
    localStorage.setItem("keranjang", JSON.stringify(baru));
    window.dispatchEvent(new Event("keranjang-berubah"));
    setPesan({ teks: "Ditambahkan ke keranjang.", ok: true });
  }

  return (
    <form onSubmit={tambah} className="mt-4">
      <label className="block text-sm text-slate-600">Jumlah</label>
      <input
        type="number"
        min="1"
        value={jumlah}
        onChange={(e) => {
          setJumlah(e.target.value);
          setPesan(null);
        }}
        className="mt-1 w-24 rounded border bg-white px-3 py-2"
      />
      <p className="mt-2 font-medium">Total harga: {rupiah(total)}</p>
      <button
        type="submit"
        className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
      >
        Tambah ke keranjang
      </button>
      {pesan && (
        <p className={pesan.ok ? "mt-2 text-sm text-green-700" : "mt-2 text-sm text-red-600"}>
          {pesan.teks}
        </p>
      )}
    </form>
  );
}