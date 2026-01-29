import { createNotification } from "./notificationService";

/**
 * Verifica si un cambio de riesgo amerita una alerta.
 * Se llama después de recalcular el riesgo de un activo.
 */
export async function checkRiskAlerts(
    assetId: string,
    assetName: string,
    ownerId: string | null,
    newRiskLevel: string,
    oldRiskLevel: string
) {
    // Solo nos interesa si el riesgo AUMENTÓ a niveles peligrosos
    if (newRiskLevel === oldRiskLevel) return;

    // Mapa de severidad para comparar
    const levels = ["BAJO", "MEDIO", "ALTO", "CRITICO"];
    const newIdx = levels.indexOf(newRiskLevel);
    const oldIdx = levels.indexOf(oldRiskLevel);

    // Si el riesgo subió
    if (newIdx > oldIdx) {
        // Alerta si llega a ALTO o CRITICO
        if (newRiskLevel === "ALTO" || newRiskLevel === "CRITICO") {
            const type = newRiskLevel === "CRITICO" ? "CRITICAL" : "WARNING";
            const message = `El activo "${assetName}" ha aumentado su nivel de riesgo de ${oldRiskLevel} a ${newRiskLevel}. Se requiere revisión inmediata.`;

            // Notificar al dueño si existe
            if (ownerId) {
                await createNotification(ownerId, "Escalada de Riesgo Detectada", message, type);
            }

            // TODO: Se podría notificar también a los admins aquí
        }
    }
}
