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
        riskMetrics,
        assetsByType
    ] = await Promise.all([
        prisma.asset.count(),
        prisma.asset.count({ where: { residualRisk: { gt: 4.5 } } }),
        prisma.vulnerability.count({ where: { status: 'ABIERTA' } }),
        prisma.incident.count({ where: { status: 'OPEN' } }),
        prisma.incident.count({ where: { status: 'OPEN', severity: 'CRITICA' } }),
        prisma.incident.findMany({
            take: 5,
            orderBy: { detectedAt: 'desc' },
            include: { asset: true }
        }),
        prisma.asset.aggregate({
            _avg: {
                residualRisk: true
            }
        }),
        prisma.asset.groupBy({
            by: ['type'],
            _avg: {
                residualRisk: true
            }
        })
    ]);

    const avgRisk = riskMetrics._avg.residualRisk || 0;

    // Validar y crear snapshot diario si no existe
    await checkAndCreateDailySnapshot({
        avgRisk,
        openIncidents: activeIncidents,
        criticalAssets
    });

    // Obtener historial de últimos 6 meses
    const history = await prisma.riskSnapshot.findMany({
        take: 6,
        orderBy: { date: 'asc' }
    });

    const riskByAssetType = assetsByType.map(item => ({
        name: item.type,
        riesgo: Number(((item._avg.residualRisk || 0)).toFixed(1))
    }));

    return {
        totalAssets,
        criticalAssets,
        openVulnerabilities,
        activeIncidents,
        highPriorityIncidents,
        recentIncidents,
        avgRisk: Number(avgRisk.toFixed(1)),
        riskByAssetType,
        history
    };
}

async function checkAndCreateDailySnapshot(metrics: { avgRisk: number, openIncidents: number, criticalAssets: number }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.riskSnapshot.findFirst({
        where: {
            date: {
                gte: today
            }
        }
    });

    // Si ya existe foto de hoy, no hacemos nada
    if (existing) return;

    // Si no existe, creamos la foto del dia
    await prisma.riskSnapshot.create({
        data: {
            averageRisk: metrics.avgRisk,
            openIncidents: metrics.openIncidents,
            criticalAssets: metrics.criticalAssets,
            date: new Date() // Guardamos fecha con hora actual
        }
    });
}
