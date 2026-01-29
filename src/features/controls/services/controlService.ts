"use server";

import prisma from "@/shared/lib/prisma";
import { ControlMaturity } from "../types";
import { calculateRiskForAsset } from "../../risk/services/riskEngine";

export async function getControlsAndEvaluations(framework?: string) {
    const [controls, evaluations] = await Promise.all([
        prisma.control.findMany({
            where: framework ? { framework } : undefined,
            orderBy: { code: 'asc' }
        }),
        prisma.assetControl.findMany({
            where: framework ? { control: { framework } } : undefined,
            orderBy: { evaluatedAt: 'desc' },
            include: {
                control: true,
                asset: {
                    select: {
                        id: true,
                        name: true,
                        riskLevel: true,
                        residualRisk: true
                    }
                }
            }
        })
    ]);
    return { controls, evaluations };
}

export async function updateEvaluation(id: string, maturity: ControlMaturity, effectiveness: number, userId?: string, evidence?: string, comments?: string) {
    // 1. Actualizar la evaluación del control
    const baseUpdate = await prisma.assetControl.update({
        where: { id },
        data: {
            maturity,
            effectiveness,
            evidence,
            comments,
            evaluatedAt: new Date(),
        }
    });

    // 2. Recalcular riesgo (esto actualiza la tabla Asset)
    await calculateRiskForAsset(baseUpdate.assetId);

    // 3. Obtener el objeto completo refrescado con los nuevos datos de riesgo
    const updated = await prisma.assetControl.findUnique({
        where: { id },
        include: {
            control: true,
            asset: {
                select: {
                    id: true,
                    name: true,
                    riskLevel: true,
                    residualRisk: true
                }
            }
        }
    });

    if (!updated) throw new Error("No se pudo refrescar la evaluación");

    // 4. Crear log de auditoría
    await prisma.auditLog.create({
        data: {
            action: `UPDATE_CONTROL_EVALUATION`,
            entityType: 'ASSET_CONTROL',
            entityId: id,
            details: {
                maturity,
                effectiveness,
                controlCode: updated.control.code,
                assetName: updated.asset.name,
                newRiskLevel: updated.asset.riskLevel,
                newResidualRisk: updated.asset.residualRisk
            },
            userId
        }
    });

    return updated;
}

export async function createEvaluation(assetId: string, controlId: string, userId?: string) {
    // 1. Crear vinculación inicial
    const baseNew = await prisma.assetControl.create({
        data: {
            assetId,
            controlId,
            maturity: 'INICIAL',
            effectiveness: 0,
        }
    });

    // 2. Recalcular riesgo
    await calculateRiskForAsset(assetId);

    // 3. Obtener objeto completo con riesgo actualizado
    const newEvaluation = await prisma.assetControl.findUnique({
        where: { id: baseNew.id },
        include: {
            control: true,
            asset: {
                select: {
                    id: true,
                    name: true,
                    riskLevel: true,
                    residualRisk: true
                }
            }
        }
    });

    if (!newEvaluation) throw new Error("No se pudo refrescar la vinculación");

    // 4. Crear log de auditoría
    await prisma.auditLog.create({
        data: {
            action: `CREATE_CONTROL_EVALUATION`,
            entityType: 'ASSET_CONTROL',
            entityId: newEvaluation.id,
            details: {
                controlCode: newEvaluation.control.code,
                assetName: newEvaluation.asset.name,
                assetRiskLevel: newEvaluation.asset.riskLevel
            },
            userId
        }
    });

    return newEvaluation;
}

export async function getAuditLogs() {
    return await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
            user: {
                select: { fullName: true, role: true }
            }
        }
    });
}
