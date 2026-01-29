"use server";

import prisma from "@/shared/lib/prisma";

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    entityId?: string;
    actionLabel: string;
    actionUrl: string;
}

export async function getRecommendations(): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // 1. Activos Críticos sin Controles
    const unprotedCriticalAssets = await prisma.asset.findMany({
        where: {
            criticality: { gte: 4 },
            controls: { none: {} }
        },
        take: 3
    });

    unprotedCriticalAssets.forEach(asset => {
        recommendations.push({
            id: `crit-asset-${asset.id}`,
            title: "Activo Crítico Desprotegido",
            description: `El activo "${asset.name}" tiene criticidad alta pero 0 controles asignados. Esto eleva el riesgo residual.`,
            priority: "HIGH",
            entityId: asset.id,
            actionLabel: "Asignar Control",
            actionUrl: `/controls`
        });
    });

    // 2. Incidentes Abiertos por mucho tiempo (Simulado con fecha hardcodeada por ahora)
    const staleIncidents = await prisma.incident.findMany({
        where: {
            status: "OPEN",
            detectedAt: { lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // > 7 days
        },
        take: 2
    });

    staleIncidents.forEach(inc => {
        recommendations.push({
            id: `stale-inc-${inc.id}`,
            title: "Incidente Estancado",
            description: `El incidente "${inc.title}" lleva abierto más de 7 días. Considere escalar o cerrar.`,
            priority: "MEDIUM",
            entityId: inc.id,
            actionLabel: "Ver Incidente",
            actionUrl: `/incidents`
        });
    });

    // 3. Vulnerabilidades Críticas no mitigadas
    const critVulns = await prisma.vulnerability.count({
        where: { severity: { gte: 4.0 }, status: 'ABIERTA' }
    });

    if (critVulns > 0) {
        recommendations.push({
            id: 'vuln-crit-summary',
            title: `${critVulns} Vulnerabilidades Críticas`,
            description: "Existen múltiples vulnerabilidades de alta severidad pendientes. Priorice su parcheo inmediato.",
            priority: "HIGH",
            actionLabel: "Ver Vulnerabilidades",
            actionUrl: "/vulnerabilities"
        });
    }

    return recommendations.sort((a, b) => {
        const prio = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return prio[b.priority] - prio[a.priority];
    });
}
