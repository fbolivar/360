import { getAssetById } from "@/features/assets/services/assetService";
import { AssetDetails } from "@/features/assets/components/AssetDetails";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function AssetPage({ params }: Props) {
    const { id } = await params;
    const asset = await getAssetById(id);

    if (!asset) {
        notFound();
    }

    return (
        <div className="container mx-auto py-8">
            <AssetDetails asset={asset} />
        </div>
    );
}
