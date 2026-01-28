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
import { ControlMaturity } from "../types";

export function ControlList() {
    const { evaluations, controls, loading, fetchData, updateEvaluation } = useControlStore();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div className="p-10 text-center text-muted-foreground animate-pulse font-bold">Consolidando niveles de cumplimiento...</div>;

    const getMaturityColor = (m: ControlMaturity) => {
        switch (m) {
            case 'OPTIMIZADO': return 'bg-emerald-500 text-white';
            case 'GESTIONADO': return 'bg-blue-500 text-white';
            case 'DEFINIDO': return 'bg-sky-500 text-white';
            case 'REPETIBLE': return 'bg-amber-500 text-white';
            default: return 'bg-rose-500 text-white';
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="w-16 h-16" />
                    </div>
                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Madurez Promedio</p>
                    <h3 className="text-3xl font-black">REPETIBLE</h3>
                    <p className="text-xs text-muted-foreground mt-2">Basado en 42 evaluaciones activas</p>
                </div>
                <div className="bg-card border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Target className="w-16 h-16" />
                    </div>
                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Efectividad Global</p>
                    <h3 className="text-3xl font-black">78.4%</h3>
                    <p className="text-xs text-muted-foreground mt-2 text-emerald-500 font-bold">+2.1% vs mes anterior</p>
                </div>
                <div className="bg-card border rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <FileCheck2 className="w-16 h-16" />
                    </div>
                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">Controles Pendientes</p>
                    <h3 className="text-3xl font-black">04</h3>
                    <p className="text-xs text-muted-foreground mt-2 text-rose-500 font-bold">Vencimiento en 72h</p>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Evaluaciones de Control por Activo
                </h4>

                <div className="grid gap-4">
                    {evaluations.map((ev) => (
                        <div key={ev.id} className="bg-card/50 border rounded-xl overflow-hidden hover:border-primary/40 transition-all flex flex-col md:flex-row">
                            <div className="p-5 flex-1 space-y-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-black text-primary text-xs tracking-tighter bg-primary/10 px-2 py-0.5 rounded">
                                        {ev.control?.code}
                                    </span>
                                    <h5 className="font-bold text-base">{ev.control?.name}</h5>
                                </div>

                                <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                    <span className="opacity-50 font-normal">Activo:</span> {ev.asset?.name}
                                </p>

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
                                    onClick={() => updateEvaluation(ev.id, 'GESTIONADO', 85)}
                                    className="w-full bg-secondary text-foreground text-xs font-bold py-2 rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <Settings className="w-3.5 h-3.5" /> Re-evaluar
                                </button>
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ev.evaluatedAt).toLocaleDateString()}</span>
                                    <span className="text-primary hover:underline cursor-pointer font-bold">Ver Evidencia</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
