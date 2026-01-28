"use server";

import prisma from "@/shared/lib/prisma";

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
    return await prisma.incident.update({
        where: { id },
        data: {
            status: 'CLOSED',
            rootCause
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
}
