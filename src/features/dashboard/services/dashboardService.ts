"use server";

import prisma from "@/shared/lib/prisma";

export async function getDashboardStats() {
    const [
        totalAssets,
        criticalAssets,
        openVulnerabilities,
        activeIncidents,
        highPriorityIncidents,
        recentIncidents,
        assetsWithRisk
    ] = await Promise.all([
        prisma.asset.count(),
        prisma.asset.count({ where: { criticality: 5 } }),
        prisma.vulnerability.count({ where: { status: 'ABIERTA' } }),
        prisma.incident.count({ where: { status: 'OPEN' } }),
        prisma.incident.count({ where: { status: 'OPEN', severity: 'CRITICA' } }),
        prisma.incident.findMany({
            take: 5,
            orderBy: { detectedAt: 'desc' },
            include: { asset: true }
        }),
        prisma.asset.findMany({
            select: {
                criticality: true,
                confidentiality: true,
                integrity: true,
                availability: true,
                _count: {
                    select: {
                        vulnerabilities: true,
                        incidents: true
                    }
                }
            }
        })
    ]);

    // Calcular nivel de riesgo promedio
    // En un sistema real, usaríamos una fórmula más compleja
    const totalRiskScore = assetsWithRisk.reduce((acc, asset) => {
        const baseRisk = (asset.criticality * (asset.confidentiality + asset.integrity + asset.availability)) / 3;
        const multiplier = 1 + (asset._count.vulnerabilities * 0.1) + (asset._count.incidents * 0.2);
        return acc + (baseRisk * multiplier);
    }, 0);

    const avgRisk = totalAssets > 0 ? (totalRiskScore / totalAssets).toFixed(1) : "0.0";

    return {
        totalAssets,
        criticalAssets,
        openVulnerabilities,
        activeIncidents,
        highPriorityIncidents,
        recentIncidents,
        avgRisk: Number(avgRisk)
    };
}
