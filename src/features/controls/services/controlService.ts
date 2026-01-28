"use server";

import prisma from "@/shared/lib/prisma";
import { ControlMaturity } from "../types";

export async function getControlsAndEvaluations() {
    const [controls, evaluations] = await Promise.all([
        prisma.control.findMany({ orderBy: { code: 'asc' } }),
        prisma.assetControl.findMany({
            orderBy: { evaluatedAt: 'desc' },
            include: {
                control: true,
                asset: {
                    select: { name: true }
                }
            }
        })
    ]);
    return { controls, evaluations };
}

export async function updateEvaluation(id: string, maturity: ControlMaturity, effectiveness: number) {
    return await prisma.assetControl.update({
        where: { id },
        data: {
            maturity,
            effectiveness,
            evaluatedAt: new Date(),
        },
        include: {
            control: true,
            asset: {
                select: { name: true }
            }
        }
    });
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
