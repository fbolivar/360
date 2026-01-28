"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/features/dashboard/store/useDashboardStore";
import { useAssetStore } from "@/features/assets/store/assetStore";
import { useVulnerabilityStore } from "@/features/vulnerabilities/store/vulnerabilityStore";
import {
    Printer,
    Download,
    FileText,
    ShieldCheck,
    TrendingUp,
    AlertTriangle,
    TreePine
} from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";

export default function ReportsPage() {
    const { stats, fetchStats } = useDashboardStore();
    const { assets, fetchAssets } = useAssetStore();
    const { vulnerabilities, fetchVulnerabilities } = useVulnerabilityStore();

    useEffect(() => {
        fetchStats();
        fetchAssets();
        fetchVulnerabilities();
    }, [fetchStats, fetchAssets, fetchVulnerabilities]);

    const handlePrint = () => {
        window.print();
    };

    if (!stats) return <div className="p-20 text-center animate-pulse">Generando consolidados...</div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header de Reporte */}
            <div className="flex justify-between items-center bg-card p-8 rounded-xl border border-primary/20 shadow-sm print:border-none print:shadow-none">
                <div className="flex gap-4 items-center">
                    <div className="bg-primary p-3 rounded-xl">
                        <FileText className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Reporte de Estado de Ciberseguridad</h2>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            Parques Nacionales Naturales de Colombia <TreePine className="w-4 h-4" />
                        </p>
                    </div>
                </div>
                <div className="flex gap-3 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-semibold border"
                    >
                        <Printer className="w-4 h-4" /> Imprimir / PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-lg shadow-primary/20">
                        <Download className="w-4 h-4" /> Exportar Datos
                    </button>
                </div>
            </div>

            {/* Metas Informative */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border/50">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Postura de Riesgo Global</p>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-black text-primary">{stats.avgRisk}</div>
                        <Badge variant={stats.avgRisk >= 4 ? 'destructive' : stats.avgRisk >= 2.5 ? 'warning' : 'success'}>
                            {stats.avgRisk >= 4 ? 'CRÍTICO' : stats.avgRisk >= 2.5 ? 'MODERADO' : 'ACEPTABLE'}
                        </Badge>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border/50">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Efectividad de Controles</p>
                    <div className="flex items-center gap-2">
                        <div className="text-4xl font-black text-emerald-500">74%</div>
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl border border-border/50">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Cumplimiento Normativo</p>
                    <div className="flex items-center gap-2">
                        <div className="text-4xl font-black text-blue-500">ISO 27001</div>
                    </div>
                </div>
            </div>

            {/* Secciones detalladas */}
            <div className="grid grid-cols-1 gap-8">
                {/* Resumen de Activos */}
                <section className="bg-card rounded-xl border overflow-hidden">
                    <div className="bg-secondary/30 px-6 py-4 border-b">
                        <h3 className="font-bold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" /> Resumen de Activos de Información
                        </h3>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-muted-foreground border-b uppercase text-[10px] font-bold">
                                    <th className="pb-3 px-2">Activo</th>
                                    <th className="pb-3 px-2">Tipo</th>
                                    <th className="pb-3 px-2">Criticidad</th>
                                    <th className="pb-3 px-2 text-right">Vulnerabilidades</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.slice(0, 10).map((asset) => (
                                    <tr key={asset.id} className="border-b last:border-0 hover:bg-secondary/20 transition-colors">
                                        <td className="py-3 px-2 font-semibold">{asset.name}</td>
                                        <td className="py-3 px-2 text-muted-foreground text-xs">{asset.type}</td>
                                        <td className="py-3 px-2">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`w-2 h-2 rounded-full ${level <= asset.criticality ? 'bg-primary' : 'bg-muted'}`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-right font-medium">{asset._count.vulnerabilities}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-[10px] text-muted-foreground mt-4 italic">* Mostrando los 10 activos con mayor impacto en la misión institucional.</p>
                    </div>
                </section>

                {/* Incidentes Críticos */}
                <section className="bg-card rounded-xl border overflow-hidden">
                    <div className="bg-rose-500/10 px-6 py-4 border-b border-rose-500/20">
                        <h3 className="font-bold flex items-center gap-2 text-rose-500">
                            <AlertTriangle className="w-5 h-5" /> Incidentes que Requieren Atención Directiva
                        </h3>
                    </div>
                    <div className="p-6">
                        {stats.recentIncidents.filter((i: any) => i.severity === 'CRITICA' || i.severity === 'ALTA').length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No se registran incidentes críticos activos a la fecha.</p>
                        ) : (
                            <ul className="space-y-4">
                                {stats.recentIncidents.filter((i: any) => i.severity === 'CRITICA' || i.severity === 'ALTA').map((incident: any) => (
                                    <li key={incident.id} className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg border border-transparent hover:border-rose-500/30 transition-all">
                                        <div className="flex gap-4 items-start">
                                            <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5" />
                                            <div>
                                                <p className="text-sm font-bold">{incident.title}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase mt-1">Activo: {incident.asset?.name || 'Varios'}</p>
                                            </div>
                                        </div>
                                        <Badge variant="destructive">{incident.severity}</Badge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>

            {/* Footer de Reporte - Solo Visible en Impresión */}
            <div className="hidden print:block border-t-2 border-black/10 pt-10 mt-20">
                <div className="grid grid-cols-2 gap-20">
                    <div className="text-center">
                        <div className="h-0.5 w-full bg-black/60 mb-2" />
                        <p className="text-xs font-bold uppercase">Nombre del Responsable TIC</p>
                        <p className="text-[10px] text-muted-foreground">Admin Sistema CyberRisk 360</p>
                    </div>
                    <div className="text-center">
                        <div className="h-0.5 w-full bg-black/60 mb-2" />
                        <p className="text-xs font-bold uppercase">Firma de Auditoría</p>
                        <p className="text-[10px] text-muted-foreground">Oficina de Control Interno</p>
                    </div>
                </div>
                <div className="mt-20 flex justify-between text-[10px] text-muted-foreground">
                    <p>CyberRisk 360 - Plataforma de Gestión de Riesgo Ambiental</p>
                    <p>Fecha de Generación: {new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
