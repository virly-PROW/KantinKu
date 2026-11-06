"use client";
 import Link from "next/link";
 import { usePathname} from "next/navigation";
 import { useEffect, useState} from "react";

 const menu =[
    {href: "/", teks: "Beranda"},
    {href: "/menu", teks: "Menu"},
    {href: "/favorit", teks: "Favorit"},
    {href: "/keranjang", teks: "Keranjang"},
    {href: "/riwayat", teks: "Riwayat"},
]

export default function Navbar() {
    const pathName = usePathname();
    const [jumlah, setJumlah] = useState(0);

    useEffect(() => {
        function hitung() {
            const data: {id:number, jumlah: number}[] = JSON.parse(
                localStorage.getItem("keranjang") ?? "[]"
            );
            setJumlah(data.reduce((j, k) => j + k.jumlah, 0));
        }
        hitung();
        window.addEventListener("keranjang-berubah", hitung);
        return () => window.removeEventListener("keranjang-berubah", hitung);
    }, []);

    return (
        <nav className="flex items-center gap-6 border-b bg-white px-6 py-3">
            <span className="text-lg font-bold text-blue-700">KantinKu</span>
            {menu.map((m) => (
                <Link 
                    key={m.href} 
                    href={m.href} 
                    className={
                        pathName === m.href
                        ? "text-blue-600 font-bold"
                        : "text-slate-600 hover:text-blue-600"
                    }
                    > 
                    {m.href === "/keranjang" && jumlah > 0
                    ? `Keranjang (${jumlah})`
                    : m.teks}
                </Link>
            ))}
        </nav>
    )
}
