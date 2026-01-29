"use server";

import prisma from "@/shared/lib/prisma";
import { calculateRiskForAsset } from "../../risk/services/riskEngine";

export async function getIncidents() {
    return await prisma.incident.findMany({
        orderBy: { detectedAt: 'desc' },
        include: {
            asset: {
                select: {
                    name: true,
                    criticality: true,
                    location: true
                }
            }
        }
    });
}

export async function closeIncident(id: string, rootCause: string) {
    const updated = await prisma.incident.update({
        where: { id },
        data: {
            status: 'CLOSED',
            rootCause
        },
        include: {
            asset: {
                select: {
                    id: true,
                    name: true,
                    criticality: true,
                    location: true
                }
            }
        }
    });

    if (updated.assetId) {
        await calculateRiskForAsset(updated.assetId);
    }

    return updated;
}

export async function getIncidentById(id: string) {
    return await prisma.incident.findUnique({
        where: { id },
        include: {
            asset: {
                select: {
                    name: true,
                    criticality: true,
                    location: true,
                    type: true,
                    description: true,
                    owner: {
                        select: {
                            fullName: true,
                            email: true
                        }
                    }
                }
            }
        }
    });
}

export async function createIncident(data: {
    title: string;
    description?: string;
    severity: any;
    assetId: string;
}) {
    const incident = await prisma.incident.create({
        data: {
            title: data.title,
            description: data.description,
            severity: data.severity,
            assetId: data.assetId,
            status: 'OPEN'
        },
        include: {
            asset: {
                select: {
                    name: true,
                    criticality: true,
                    location: true
                }
            }
        }
    });

    // Recalcular riesgo del activo
    await calculateRiskForAsset(data.assetId);

    return incident;
}
