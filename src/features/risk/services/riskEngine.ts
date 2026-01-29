"use server";

import prisma from "@/shared/lib/prisma";
import { getSystemSettings } from "@/features/settings/services/settingsService";
import { checkRiskAlerts } from "@/features/notifications/services/alertTriggers";

export async function calculateRiskForAsset(assetId: string) {
    const asset = await prisma.asset.findUnique({
        where: { id: assetId },
        include: {
            vulnerabilities: {
                where: { status: 'ABIERTA' }
            },
            incidents: {
                where: { status: 'OPEN' }
            },
            controls: true
        }
    });

    if (!asset) return;

    // 1. IMPACTO (I)
    // Fórmula: I = (Criticidad + C + I + A) / 4
    const impact = (
        asset.criticality +
        asset.confidentiality +
        asset.integrity +
        asset.availability
    ) / 4;

    // 2. PROBABILIDAD (P)
    // Punv = min(Vulns * 0.5, 5)
    // Pinc = min(Incid * 1.5, 5)
    // P = max((Pvul + Pinc) / 2, 1)
    const pVuln = Math.min(asset.vulnerabilities.length * 0.5, 5);
    const pIncid = Math.min(asset.incidents.length * 1.5, 5);
    const probability = Math.max((pVuln + pIncid) / 2, 1);

    // 3. RIESGO INHERENTE (Ri)
    // Ri = P * I
    const inherentRisk = probability * impact;

    // 4. EFECTIVIDAD (E)
    // Promedio de efectividad de controles
    const totalEffectiveness = asset.controls.length > 0
        ? asset.controls.reduce((acc, c) => acc + c.effectiveness, 0) / asset.controls.length
        : 0;

    const eDecimal = totalEffectiveness / 100;

    // 5. RIESGO RESIDUAL (Rr)
    // Rr = Ri * (1 - E)
    const residualRisk = inherentRisk * (1 - eDecimal);

    // 6. MATRIZ DE SEVERIDAD (Dinámica desde Configuración)
    const { riskThresholds } = await getSystemSettings();
    let riskLevel = "BAJO";

    if (residualRisk > riskThresholds.high) riskLevel = "CRITICO";
    else if (residualRisk > riskThresholds.medium) riskLevel = "ALTO";
    else if (residualRisk > riskThresholds.low) riskLevel = "MEDIO";

    // UPDATING ASSET
    await prisma.asset.update({
        where: { id: assetId },
        data: {
            inherentRisk: Number(inherentRisk.toFixed(2)),
            residualRisk: Number(residualRisk.toFixed(2)),
            avgEffectiveness: Number(totalEffectiveness.toFixed(2)),
            riskLevel
        }
    });

    // TRIGGER ALERTS
    // Verificamos si el cambio de riesgo amerita notificar (Fire and forget para no bloquear)
    checkRiskAlerts(asset.id, asset.name, asset.ownerId, riskLevel, asset.riskLevel).catch(console.error);

    return { inherentRisk, residualRisk, riskLevel };
}
