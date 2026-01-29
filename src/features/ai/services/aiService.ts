"use server";

import prisma from "@/shared/lib/prisma";
import { getComplianceStatus, getFrameworks } from "@/features/compliance/services/complianceService";

export interface AIResponse {
    text: string;
    data?: any; // Para mostrar tarjetas o listas enriquecidas en el futuro
}

/**
 * Procesa una consulta en lenguaje natural usando patrones simples (Local Intelligence).
 * No requiere API Keys externas.
 */
export async function processQuery(query: string): Promise<AIResponse> {
    const q = query.toLowerCase();

    // 1. INTENCIÓN: ACTIVOS CRÍTICOS / RIESGO
    if (q.includes("crítico") || q.includes("critico") || q.includes("riesgo") || q.includes("peligro")) {
        const assets = await prisma.asset.findMany({
            where: {
                riskLevel: { in: ['ALTO', 'CRITICO'] }
            },
            take: 5,
            orderBy: { residualRisk: 'desc' },
            select: { name: true, riskLevel: true, residualRisk: true }
        });

        if (assets.length === 0) {
            return { text: "¡Buenas noticias! No detecto activos con riesgo ALTO o CRÍTICO en este momento. Tu superficie de ataque parece controlada." };
        }

        const assetNames = assets.map(a => `• ${a.name} (${a.riskLevel})`).join("\n");
        return {
            text: `He encontrado ${assets.length} activos que requieren atención inmediata:\n\n${assetNames}\n\nTe recomiendo revisar sus controles o aplicar mitigaciones.`
        };
    }

    // 2. INTENCIÓN: CUMPLIMIENTO / ISO
    if (q.includes("cumplimiento") || q.includes("iso") || q.includes("norma") || q.includes("auditoría")) {
        const frameworks = await getFrameworks();
        if (frameworks.length === 0) return { text: "Aún no has configurado ninguna norma de cumplimiento." };

        // Tomamos la primera (ej. ISO 27001)
        const fw = frameworks[0];
        const status = await getComplianceStatus(fw.id);

        return {
            text: `Tu estado de cumplimiento para **${fw.name}** es del **${status.percentage}%**.\n\n` +
                `Actualmente cumples con ${status.requirementStatus.filter((r: any) => r.isFulfilled).length} de ${status.requirementStatus.length} requisitos principales.\n` +
                `Puedes ver el detalle completo en la sección de Compliance.`
        };
    }

    // 3. INTENCIÓN: INCIDENTES
    if (q.includes("incidente") || q.includes("problema") || q.includes("fuego")) {
        const incidents = await prisma.incident.findMany({
            where: { status: 'OPEN' },
            take: 3,
            orderBy: { detectedAt: 'desc' }
        });

        if (incidents.length === 0) {
            return { text: "Todo tranquilo por aquí. No hay incidentes abiertos reportados en el sistema." };
        }

        const list = incidents.map(i => `• ${i.title} (Reportado: ${i.detectedAt.toLocaleDateString()})`).join("\n");
        return {
            text: `Tengo registrados ${incidents.length} incidentes abiertos recientes:\n\n${list}\n\n¿Necesitas ayuda para gestionar alguno?`
        };
    }

    // 4. INTENCIÓN: RESUMEN / HOLA
    if (q.includes("hola") || q.includes("resumen") || q.includes("estado") || q.includes("dia") || q.includes("día")) {
        const assetCount = await prisma.asset.count();
        const incidentCount = await prisma.incident.count({ where: { status: 'OPEN' } });

        return {
            text: `¡Hola! Soy tu asistente CISO.\n\n` +
                `📊 **Resumen Rápido:**\n` +
                `• Activos Monitoreados: ${assetCount}\n` +
                `• Incidentes Abiertos: ${incidentCount}\n` +
                `\nPuedes preguntarme por "activos críticos", "cumplimiento" o "incidentes".`
        };
    }

    // DEFAULT
    return {
        text: "Lo siento, como soy una IA Local, por ahora solo entiendo de Riesgos, Cumplimiento e Incidentes. Intenta preguntar: '¿Cuáles son mis activos críticos?'"
    };
}
