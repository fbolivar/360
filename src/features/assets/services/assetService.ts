"use server";

import prisma from "@/shared/lib/prisma";
import { AssetCreateInput } from "../types";
import { AssetFormData } from "../schemas/assetSchema";

export async function getAssets() {
    return await prisma.asset.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
            owner: {
                select: {
                    fullName: true,
                    email: true
                }
            },
            _count: {
                select: {
                    vulnerabilities: true,
                    incidents: true
                }
            }
        }
    });
}

export async function createAsset(data: AssetFormData) {
    console.log("Intentando crear activo con datos:", data);
    try {
        const newAsset = await prisma.asset.create({
            data: {
                ...data,
                ownerId: data.ownerId || null, // Ensure empty string doesn't break UUID relation
                criticality: Number(data.criticality),
                confidentiality: Number(data.confidentiality),
                integrity: Number(data.integrity),
                availability: Number(data.availability),
            },
            include: {
                owner: {
                    select: {
                        fullName: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        vulnerabilities: true,
                        incidents: true
                    }
                }
            }
        });
        console.log("Activo creado exitosamente:", newAsset.id);
        return newAsset;
    } catch (error) {
        console.error("Error detallado en createAsset:", error);
        throw error;
    }
}

export async function getAssetById(id: string) {
    return await prisma.asset.findUnique({
        where: { id },
        include: {
            owner: true,
            vulnerabilities: true,
            incidents: true,
            controls: {
                include: {
                    control: true
                }
            }
        }
    });
}
