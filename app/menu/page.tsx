import {menu} from "@/data/menu";
import KatalogMenu from "@/components/KatalogMenu";

export default function Katalog() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-blue-700">Katalog Menu</h1>
            <KatalogMenu items={menu} />
        </div>
    )
}
        