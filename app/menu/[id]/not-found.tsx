import Link from "next/link";

export default function NotFound() {
    return (
        <div className="py-16 text-center">
            <h1 className="text-2xl font-bold"> Menu tidak ditemukan</h1>
            <p className="mt-2 text-slate-600">Mungkin alamat salah atau menu sudha dihapus</p>
            <Link href="/menu" className= "mt-4 inline-block text-blue-600 hover:underline">Kembali ke katalog</Link>
        </div>
    )
}