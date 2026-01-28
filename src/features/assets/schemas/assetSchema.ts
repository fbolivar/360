import { z } from "zod";
import { AssetType, ClassificationLevel } from "@prisma/client";

export const assetSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    description: z.string().optional(),
    type: z.nativeEnum(AssetType),
    criticality: z.number().min(1).max(5),
    confidentiality: z.number().min(1).max(5),
    integrity: z.number().min(1).max(5),
    availability: z.number().min(1).max(5),
    classification: z.nativeEnum(ClassificationLevel),
    location: z.string().optional(),
    ownerId: z.string().optional(),
});

export type AssetFormData = z.infer<typeof assetSchema>;
