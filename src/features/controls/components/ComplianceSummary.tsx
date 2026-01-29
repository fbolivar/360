"use client";

import { useMemo } from "react";
import { useControlStore } from "../store/controlStore";
import { FileSearch } from "lucide-react";

export function ComplianceSummary() {
    const { evaluations, controls, loading } = useControlStore();

    const summary = useMemo(() => {
        if (loading) return "Cargando análisis institucional...";
        if (evaluations.length === 0) return "No hay datos de auditoría suficientes para generar un resumen detallado para este framework.";

        // Calculate weakest category
        const categoryStats: Record<string, { total: number, effectiveness: number }> = {};

        evaluations.forEach(ev => {
            const cat = ev.control?.category || "General";
            if (!categoryStats[cat]) categoryStats[cat] = { total: 0, effectiveness: 0 };
            categoryStats[cat].total += 1;
            categoryStats[cat].effectiveness += Number(ev.effectiveness);
        });

        const averages = Object.entries(categoryStats).map(([cat, stats]) => ({
            name: cat,
            avg: stats.effectiveness / stats.total
        }));

        const weakestCategory = averages.sort((a, b) => a.avg - b.avg)[0];
        const frameworks = Array.from(new Set(evaluations.map(ev => ev.control?.framework)));
        const activeFramework = frameworks[0] || "normativa";

        let analysis = "";

        if (weakestCategory.avg < 60) {
            analysis = `El sistema detecta una brecha de cumplimiento crítica en el dominio **${weakestCategory.name}**. `;
            analysis += `Se recomienda re-evaluar urgentemente los controles en esta categoría para mitigar riesgos operativos asociados a la **${activeFramework}**.`;
        } else if (weakestCategory.avg < 85) {
            analysis = `La implementación de controles en **${weakestCategory.name}** es estable pero requiere optimización documentada. `;
            analysis += `El cumplimiento global bajo **${activeFramework}** es aceptable pero existen oportunidades de mejora en la madurez de los procesos.`;
        } else {
            analysis = `La organización mantiene una postura de cumplimiento excepcional bajo los estándares de **${activeFramework}**. `;
            analysis += `Se recomienda avanzar hacia el nivel 'Optimizado' mediante la automatización de la recolección de evidencia.`;
        }

        return analysis;
    }, [evaluations, loading]);

    return (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
            <h5 className="text-sm font-bold mb-3 flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-primary" /> Análisis de Cumplimiento
            </h5>
            <div
                className="text-xs text-muted-foreground leading-relaxed transition-all duration-500"
                dangerouslySetInnerHTML={{ __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }}
            />
        </div>
    );
}
