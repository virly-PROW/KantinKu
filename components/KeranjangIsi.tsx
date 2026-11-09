"use client";
import { useEffect, useState } from "react";
import { menu, rupiah } from "@/data/menu";

type Item = { id: number; jumlah: number };

type Struk = {
  nama: string;
  baris: { nama: string; jumlah: number; subtotal: number }[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  antar: boolean;
  kelas: string;
  total: number;
};

export default function TambahKeranjang() {
  const [items, setItems] = useState<Item[]>([]);
  const [kodePromo, setKodePromo] = useState("");
  const [promoAktif, setPromoAktif] = useState(false);
  const [pesanPromo, setPesanPromo] = useState<{ teks: string; ok: boolean } | null>(null);
  const [antar, setAntar] = useState(false);
  const [kelas, setKelas] = useState("");
  const [nama, setNama] = useState("");
  const [galat, setGalat] = useState("");
  const [struk, setStruk] = useState<Struk | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(JSON.parse(localStorage.getItem("keranjang") ?? "[]"));
  }, []);

  const baris = items.flatMap((k) => {
    const m = menu.find((x) => x.id === k.id);
    return m ? [{ m, jumlah: k.jumlah, subtotal: m.harga * k.jumlah }] : [];
  });

  const subtotal = baris.reduce((j, b) => j + b.subtotal, 0);
  const diskon = promoAktif && subtotal >= 20000 ? Math.round(subtotal * 0.1) : 0;
  const ongkir = antar ? 2000 : 0;
  const total = subtotal - diskon + ongkir;

  function perbarui(baru: Item[]) {
    setItems(baru);
    localStorage.setItem("keranjang", JSON.stringify(baru));
    window.dispatchEvent(new Event("keranjang-berubah"));
  }

  function ubah(id: number, delta: number, stok: number) {
    perbarui(
      items.map((k) => {
        if (k.id !== id) return k;
        const j = k.jumlah + delta;
        return j < 1 || j > stok ? k : { ...k, jumlah: j };
      })
    );
  }

  function hapus(id: number) {
    perbarui(items.filter((k) => k.id !== id));
  }

  function pakaiPromo() {
    const kode = kodePromo.trim().toUpperCase();
    if (kode !== "HEMAT10") {
      setPromoAktif(false);
      setPesanPromo({ teks: "Kode promo tidak dikenal.", ok: false });
    } else if (subtotal < 20000) {
      setPromoAktif(false);
      setPesanPromo({ teks: "Promo HEMAT10 butuh belanja minimal Rp 20.000.", ok: false });
    } else {
      setPromoAktif(true);
      setPesanPromo({ teks: "Promo HEMAT10 dipakai: diskon 10%.", ok: true });
    }
  }

  function pesanSekarang(e: React.FormEvent) {
    e.preventDefault();
    if (nama.trim().length < 3) {
      setGalat("Nama pemesan minimal 3 huruf.");
      return;
    }
    if (antar && kelas.trim().length < 3) {
      setGalat("Kelas minimal 3 karakter.");
      return;
    }
    setGalat("");

    const pesanan: Struk = {
      nama: nama.trim(),
      baris: baris.map((b) => ({ nama: b.m.nama, jumlah: b.jumlah, subtotal: b.subtotal })),
      subtotal,
      diskon,
      ongkir,
      antar,
      kelas: kelas.trim(),
      total,
    };

    const riwayat = JSON.parse(localStorage.getItem("riwayat") ?? "[]");
    const sekarang = new Date ();
    localStorage.setItem(
      "riwayat",
      JSON.stringify([...riwayat, { id: sekarang.getTime(), tanggal: sekarang.toISOString(), ...pesanan }])
    );
    setStruk(pesanan);

    perbarui([]);
    setNama("");
    setKelas("");
    setAntar(false);
    setKodePromo("");
    setPromoAktif(false);
    setPesanPromo(null);
  }

  return (
    <div>
      {struk && (
        <div className="mb-6 rounded-xl border bg-white p-6">
          <h2 className="text-xl font-bold">Terima kasih, {struk.nama}!</h2>
          <ul className="mt-3 space-y-1">
            {struk.baris.map((b) => (
              <li key={b.nama}>
                {b.nama} x{b.jumlah} = {rupiah(b.subtotal)}
              </li>
            ))}
          </ul>
          <p className="mt-3">Subtotal: {rupiah(struk.subtotal)}</p>
          {struk.diskon > 0 && <p>Diskon: -{rupiah(struk.diskon)}</p>}
          <p>
            {struk.antar
              ? `Antar ke ${struk.kelas}: ${rupiah(struk.ongkir)}`
              : "Diambil sendiri di kantin"}
          </p>
          <p className="mt-2 text-lg font-semibold">Total bayar: {rupiah(struk.total)}</p>
        </div>
      )}

      {baris.length === 0 ? (
        !struk && <p className="text-slate-500">Keranjang masih kosong.</p>
      ) : (
        <>
          <div className="space-y-3">
            {baris.map((b) => (
              <div
                key={b.m.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"
              >
                <div>
                  <p className="font-semibold">{b.m.nama}</p>
                  <p className="text-sm text-slate-500">
                    {rupiah(b.m.harga)} · Stok {b.m.stok}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => ubah(b.m.id, -1, b.m.stok)}
                    disabled={b.jumlah <= 1}
                    className="rounded border px-3 py-1 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{b.jumlah}</span>
                  <button
                    onClick={() => ubah(b.m.id, 1, b.m.stok)}
                    disabled={b.jumlah >= b.m.stok}
                    className="rounded border px-3 py-1 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <p className="font-medium">{rupiah(b.subtotal)}</p>
                <button
                  onClick={() => hapus(b.m.id)}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm text-slate-600">Kode promo</label>
            <div className="mt-1 flex gap-2">
              <input
                value={kodePromo}
                onChange={(e) => setKodePromo(e.target.value)}
                className="rounded border bg-white px-3 py-2"
              />
              <button
                onClick={pakaiPromo}
                className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
              >
                Pakai
              </button>
            </div>
            {pesanPromo && (
              <p className={pesanPromo.ok ? "mt-2 text-sm text-green-700" : "mt-2 text-sm text-red-600"}>
                {pesanPromo.teks}
              </p>
            )}
          </div>

          <div className="mt-4 space-y-1 rounded-xl border bg-white p-4">
            <p>Subtotal: {rupiah(subtotal)}</p>
            {diskon > 0 && <p>Diskon: -{rupiah(diskon)}</p>}
            {antar && <p>Ongkir: {rupiah(ongkir)}</p>}
            <p className="text-lg font-semibold">Total: {rupiah(total)}</p>
          </div>

          <form onSubmit={pesanSekarang} className="mt-4 rounded-xl border bg-white p-4">
            <p className="font-medium">Cara ambil</p>
            <label className="mt-2 flex items-center gap-2">
              <input type="radio" name="cara" checked={!antar} onChange={() => setAntar(false)} />
              Ambil sendiri
            </label>
            <label className="mt-1 flex items-center gap-2">
              <input type="radio" name="cara" checked={antar} onChange={() => setAntar(true)} />
              Diantar (+Rp 2.000)
            </label>

            {antar && (
              <div className="mt-3">
                <label className="block text-sm text-slate-600">Kelas</label>
                <input
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="mt-1 rounded border bg-white px-3 py-2"
                />
              </div>
            )}

            <div className="mt-3">
              <label className="block text-sm text-slate-600">Nama pemesan</label>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="mt-1 rounded border bg-white px-3 py-2"
              />
            </div>

            {galat && <p className="mt-2 text-sm text-red-600">{galat}</p>}

            <button
              type="submit"
              className="mt-3 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Pesan sekarang
            </button>
          </form>
        </>
      )}
    </div>
  );
}