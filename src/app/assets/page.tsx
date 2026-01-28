import { AssetList } from "@/features/assets/components/AssetList";

export default function AssetsPage() {
    return (
        <div className="space-y-8">
            <header className="border-b pb-6">
                <h2 className="text-3xl font-bold tracking-tight">Gestión de Activos</h2>
                <p className="text-muted-foreground mt-1 text-lg">Control Institucional PNN</p>
            </header>

            <AssetList />
        </div>
    );
}
