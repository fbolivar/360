import { AssetType, ClassificationLevel } from "@prisma/client";

export interface Asset {
    id: string;
    name: string;
    description?: string | null;
    type: AssetType;
    criticality: number;
    confidentiality: number;
    integrity: number;
    availability: number;
    classification: ClassificationLevel;
    ownerId?: string | null;
    location?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface AssetCreateInput {
    name: string;
    description?: string;
    type: AssetType;
    criticality: number;
    confidentiality: number;
    integrity: number;
    availability: number;
    classification: ClassificationLevel;
    location?: string;
    ownerId?: string;
}
