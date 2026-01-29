"use client";

import { useEffect, useState } from "react";
import { useControlStore } from "../store/controlStore";
import { Badge } from "@/shared/components/ui/Badge";
import {
    ShieldCheck,
    Settings,
    Clock,
    TrendingUp,
    Target,
    FileCheck2,
    AlertCircle
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ControlMaturity, AssetControl } from "../types";
import { ControlEvaluationModal } from "./ControlEvaluationModal";
import { EvidenceModal } from "./EvidenceModal";

export function ControlList() {
    const { evaluations, loading, fetchData } = useControlStore();
    const [activeFramework, setActiveFramework] = useState<string>("ISO 27001:2022");
    const [selectedEvaluation, setSelectedEvaluation] = useState<AssetControl | null>(null);
    const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

    useEffect(() => {
        fetchData(activeFramework);
    }, [fetchData, activeFramework]);

    const handleReevaluate = (ev: AssetControl) => {
        setSelectedEvaluation(ev);
        setIsEvalModalOpen(true);
    };

    const handleViewEvidence = (ev: AssetControl) => {
        setSelectedEvaluation(ev);
        setIsEvidenceModalOpen(true);
    };

    const frameworks = ["ISO 27001:2022", "NIST CSF 2.0", "CIS Controls v8"];

    const maturityOrder: ControlMaturity[] = ['INEXISTENTE', 'INICIAL', 'REPETIBLE', 'DEFINIDO', 'GESTIONADO', 'OPTIMIZADO'];

    const stats = {
        avgMaturity: evaluations.length > 0
            ? maturityOrder[Math.round(evaluations.reduce((acc, ev) => acc + maturityOrder.indexOf(ev.maturity), 0) / evaluations.length)]
            : 'INEXISTENTE',
        avgEffectiveness: evaluations.length > 0
            ? Math.round(evaluations.reduce((acc, ev) => acc + Number(ev.effectiveness), 0) / evaluations.length)
            : 0,
        pending: evaluations.filter(ev => ev.effectiveness < 50).length
    };

    const getMaturityColor = (m: ControlMaturity) => {
        switch (m) {
            case 'OPTIMIZADO': return 'bg-emerald-500 text-white';
            case 'GESTIONADO': return 'bg-blue-500 text-white';
            case 'DEFINIDO': return 'bg-sky-500 text-white';
            case 'REPETIBLE': return 'bg-amber-500 text-white';
            default: return 'bg-rose-500 text-white';
        }
    };

    if (loading) return <div className="p-10 text-center text-muted-foreground animate-pulse font-bold">Consolidando niveles de cumplimiento...</div>;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-16 h-16" />
                    </div>
                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Madurez Promedio</p>
                    <h3 className="text-3xl font-black">{stats.avgMaturity}</h3>
                    <p className="text-xs text-muted-foreground mt-2">Basado en {evaluations.length} evaluaciones activas</p>
                </div>
                <div className="bg-card border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Target className="w-16 h-16" />
                    </div>
                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Efectividad Global</p>
                    <h3 className="text-3xl font-black">{stats.avgEffectiveness}%</h3>
                    <p className="text-xs text-muted-foreground mt-2 text-emerald-500 font-bold">Postura de seguridad actual</p>
                </div>
                <div className="bg-card border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileCheck2 className="w-16 h-16" />
                    </div>
                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Controles Críticos</p>
                    <h3 className="text-3xl font-black">{stats.pending.toString().padStart(2, '0')}</h3>
                    <p className="text-xs text-muted-foreground mt-2 text-rose-500 font-bold">Requieren atención inmediata</p>
                </div>
            </div>

            {/* Framework Selector Tabs */}
            <div className="flex bg-muted/30 p-1.5 rounded-2xl gap-2 w-fit mb-4">
                {frameworks.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFramework(f)}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-xs font-black transition-all",
                            activeFramework === f
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-muted font-bold"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Evaluaciones de Control por Activo ({activeFramework})
                </h4>

                <div className="grid gap-4">
                    {evaluations.length === 0 ? (
                        <div className="bg-card/50 border border-dashed rounded-2xl p-12 text-center space-y-3">
                            <div className="bg-muted w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-muted-foreground">
                                <FileCheck2 className="w-6 h-6" />
                            </div>
                            <h5 className="font-bold">Sin auditorías activas</h5>
                            <p className="text-xs text-muted-foreground max-w-[240px] mx-auto">
                                No se registran evaluaciones para este framework. Inicia una nueva auditoría para comenzar la medición.
                            </p>
                        </div>
                    ) : (
                        evaluations.map((ev) => (
                            <div key={ev.id} className="bg-card/50 border rounded-xl overflow-hidden hover:border-primary/40 transition-all flex flex-col md:flex-row">
                                <div className="p-5 flex-1 space-y-3">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-primary text-xs tracking-tighter bg-primary/10 px-2 py-0.5 rounded">
                                                {ev.control?.code}
                                            </span>
                                            <h5 className="font-bold text-base">{ev.control?.name}</h5>
                                        </div>
                                        {ev.control?.category && (
                                            <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 text-primary">
                                                {ev.control.category}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                            <span className="opacity-50 font-normal">Activo:</span> {ev.asset?.name}
                                        </p>
                                        {ev.asset?.riskLevel && (
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[9px] font-black border-none px-1.5 py-0",
                                                    ev.asset.riskLevel === 'CRITICO' ? 'bg-rose-500/10 text-rose-500' :
                                                        ev.asset.riskLevel === 'ALTO' ? 'bg-orange-500/10 text-orange-500' :
                                                            ev.asset.riskLevel === 'MEDIO' ? 'bg-amber-500/10 text-amber-500' :
                                                                'bg-emerald-500/10 text-emerald-500'
                                                )}
                                            >
                                                Riesgo: {ev.asset.riskLevel} ({ev.asset.residualRisk})
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-6 pt-1">
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Nivel Madurez</p>
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-1 rounded truncate",
                                                getMaturityColor(ev.maturity)
                                            )}>
                                                {ev.maturity}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Efectividad</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${ev.effectiveness}%` }} />
                                                </div>
                                                <span className="text-xs font-black">{ev.effectiveness}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 bg-muted/30 border-t md:border-t-0 md:border-l flex flex-col justify-center gap-3 md:w-56">
                                    <button
                                        onClick={() => handleReevaluate(ev)}
                                        className="w-full bg-secondary text-foreground text-xs font-bold py-2 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Settings className="w-3.5 h-3.5" /> Re-evaluar
                                    </button>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ev.evaluatedAt).toLocaleDateString()}</span>
                                        <span
                                            onClick={() => handleViewEvidence(ev)}
                                            className="text-primary hover:underline cursor-pointer font-black flex items-center gap-1"
                                        >
                                            <FileCheck2 className="w-3 h-3" /> Ver Evidencia
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <ControlEvaluationModal
                isOpen={isEvalModalOpen}
                onClose={() => setIsEvalModalOpen(false)}
                evaluation={selectedEvaluation}
            />

            <EvidenceModal
                isOpen={isEvidenceModalOpen}
                onClose={() => setIsEvidenceModalOpen(false)}
                evaluation={selectedEvaluation}
            />
        </div>
    );
}
