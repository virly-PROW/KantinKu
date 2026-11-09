import { notFound } from "next/navigation";
import { menu, rupiah } from "@/data/menu";
import FormTambah from "@/components/FormTambah";
import TombolFavorit from "@/components/TombolFavorit";

export default async function Detail({ params }: PageProps<"/menu/[id]">) {
  const { id } = await params;
  const item = menu.find((m) => m.id === Number(id));
  if (!item) {
    notFound();
  }
  return (
    <article className="rounded-xl border bg-white p-6">
      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
        {item.kategori}
      </span>
      <h1 className="mt-2 text-3xl font-bold">{item.nama}</h1>
      <p className="mt-4 text-2xl font-semibold">{rupiah(item.harga)}</p>
      <p className="text-slate-600">
        {item.stok === 0 ? "Habis" : `Stok ${item.stok}`}
      </p>
      <TombolFavorit id={item.id} />
      {item.stok === 0 ? (
        <p className="mt-4 font-medium text-red-600">Menu ini habis.</p>
      ) : (
        <FormTambah item={item} />
      )}
    </article>
  );
}