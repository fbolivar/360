"use server";

import prisma from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export interface RiskThresholds {
    low: number;
    medium: number;
    high: number;
}

export interface SystemConfig {
    companyName: string;
    nit: string;
    logoUrl: string | null;
    riskThresholds: RiskThresholds;
}

const DEFAULT_THRESHOLDS: RiskThresholds = {
    low: 1.5,
    medium: 3.5,
    high: 4.5
};

export async function getSystemSettings(): Promise<SystemConfig> {
    const settings = await prisma.systemSettings.findFirst();

    if (!settings) {
        // Return defaults if no settings exist (or create one)
        return {
            companyName: "Mi Empresa SAS",
            nit: "",
            logoUrl: null,
            riskThresholds: DEFAULT_THRESHOLDS
        };
    }

    const thresholds = settings.riskThresholds as unknown as RiskThresholds || DEFAULT_THRESHOLDS;

    return {
        companyName: settings.companyName,
        nit: settings.nit || "",
        logoUrl: settings.logoUrl,
        riskThresholds: {
            low: thresholds.low ?? DEFAULT_THRESHOLDS.low,
            medium: thresholds.medium ?? DEFAULT_THRESHOLDS.medium,
            high: thresholds.high ?? DEFAULT_THRESHOLDS.high
        }
    };
}

export async function updateSystemSettings(data: Partial<SystemConfig>) {
    // Upsert logic: update first record or create if none
    const existing = await prisma.systemSettings.findFirst();

    if (existing) {
        await prisma.systemSettings.update({
            where: { id: existing.id },
            data: {
                companyName: data.companyName,
                nit: data.nit,
                logoUrl: data.logoUrl,
                riskThresholds: data.riskThresholds as any
            }
        });
    } else {
        await prisma.systemSettings.create({
            data: {
                companyName: data.companyName || "Mi Empresa SAS",
                nit: data.nit,
                logoUrl: data.logoUrl,
                riskThresholds: (data.riskThresholds || DEFAULT_THRESHOLDS) as any
            }
        });
    }

    revalidatePath("/settings");
    return { success: true };
}
