"use server";

import prisma from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFrameworks() {
    return await prisma.framework.findMany({
        include: {
            requirements: {
                select: { id: true }
            }
        }
    });
}

export async function getFrameworkDetails(id: string) {
    return await prisma.framework.findUnique({
        where: { id },
        include: {
            requirements: {
                include: {
                    controls: {
                        include: {
                            control: {
                                include: {
                                    assetEvaluations: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}

/**
 * Calcula el estado de cumplimiento de un framework.
 * Lógica:
 * 1. Un Requisito se cumple si tiene al menos un Control asociado con madurez >= DEFINIDO (3).
 * 2. El % total es (Requisitos Cumplidos / Total Requisitos) * 100.
 */
export async function getComplianceStatus(frameworkId: string) {
    const framework = await getFrameworkDetails(frameworkId);
    if (!framework) return { percentage: 0, requirementStatus: [], frameworkName: "Desconocido" };

    const totalRequirements = framework.requirements.length;
    let fulfilledRequirements = 0;

    const requirementStatus = framework.requirements.map(req => {
        // Buscamos si algún control asociado tiene madurez suficiente en algún activo
        // O simplificamos: Si el control en sí está "Implementado"?
        // El modelo AssetControl define la madurez por activo.
        // Asumiremos: Si el control está asignado a al menos 1 activo con madurez >= DEFINIDO

        const isFulfilled = req.controls.some(cr => {
            return cr.control.assetEvaluations.some(ac =>
                ['DEFINIDO', 'GESTIONADO', 'OPTIMIZADO'].includes(ac.maturity)
            );
        });

        if (isFulfilled) fulfilledRequirements++;

        return {
            code: req.code,
            description: req.description,
            isFulfilled,
            controlsCount: req.controls.length
        };
    });

    const percentage = totalRequirements === 0 ? 0 : Math.round((fulfilledRequirements / totalRequirements) * 100);

    return {
        percentage,
        requirementStatus,
        frameworkName: framework.name
    };
}
