"use client";

import { useEffect, useState } from "react";
import { useIncidentStore } from "../store/incidentStore";
import { Badge } from "@/shared/components/ui/Badge";
import {
    AlertTriangle,
    Clock,
    MapPin,
    ShieldAlert,
    CheckCircle2,
    History,
    Activity,
    ArrowUpRight,
    PlusCircle
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { IncidentCreationModal } from "./IncidentCreationModal";
import { IncidentResolutionModal } from "./IncidentResolutionModal";

export function IncidentList() {
    const { incidents, loading, fetchIncidents } = useIncidentStore();
    const [activeTab, setActiveTab] = useState<string>("OPEN");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // State for resolution modal
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState<{ id: string; title: string } | null>(null);

    useEffect(() => {
        fetchIncidents();
    }, [fetchIncidents]);

    const handleOpenResolve = (id: string, title: string) => {
        setSelectedIncident({ id, title });
        setIsResolveModalOpen(true);
    };

    const filteredIncidents = incidents.filter(inc => inc.status === activeTab);

    if (loading) return <div className="p-10 text-center text-muted-foreground animate-pulse">Escaneando eventos de seguridad...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-1">
                <div className="flex items-center gap-4">
                    {["OPEN", "CLOSED"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={cn(
                                "px-4 py-3 text-sm font-bold transition-all relative",
                                activeTab === status
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {status === 'OPEN' ? 'Incidentes Activos' : 'Histórico Resuelto'}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all mb-2 sm:mb-0"
                >
                    <PlusCircle className="w-4 h-4" /> Reportar Incidente
                </button>
            </div>

            <div className="grid gap-6">
                {filteredIncidents.length === 0 ? (
                    <div className="p-20 border border-dashed rounded-2xl text-center bg-secondary/20">
                        <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No hay incidentes registrados en este estado.</p>
                    </div>
                ) : (
                    filteredIncidents.map((incident: any) => (
                        <div key={incident.id} className="relative group overflow-hidden bg-card border rounded-2xl p-6 hover:border-primary/50 transition-all shadow-sm">
                            {/* Accents for high severity */}
                            {incident.severity === 'CRITICA' && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 animate-pulse" />
                            )}

                            <div className="flex flex-col lg:flex-row justify-between gap-8">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={cn(
                                                    "text-[10px] font-black px-2 py-0.5 rounded tracking-widest",
                                                    incident.severity === 'CRITICA' ? 'bg-rose-500 text-white' :
                                                        incident.severity === 'ALTA' ? 'bg-amber-500 text-white' :
                                                            'bg-blue-500 text-white'
                                                )}>
                                                    {incident.severity}
                                                </span>
                                                <h4 className="text-xl font-bold tracking-tight">{incident.title}</h4>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                                                "{incident.description || 'Sin descripción adicional'}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Activo Impactado</p>
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <ShieldAlert className="w-4 h-4 text-primary" /> {incident.asset?.name || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Ubicación</p>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                                <MapPin className="w-4 h-4" /> {incident.asset?.location || 'Sede Regional'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Detección</p>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                                <Clock className="w-4 h-4" /> {new Date(incident.detectedAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Riesgo Activo</p>
                                            <div className="flex flex-col items-end">
                                                <span className={cn(
                                                    "text-[10px] font-black",
                                                    incident.asset?.riskLevel === 'CRITICO' ? 'text-rose-500' :
                                                        incident.asset?.riskLevel === 'ALTO' ? 'text-orange-500' :
                                                            'text-emerald-500'
                                                )}>
                                                    {incident.asset?.riskLevel || 'N/A'}
                                                </span>
                                                <div className="flex justify-end gap-0.5 mt-1">
                                                    {[1, 2, 3, 4, 5].map(l => (
                                                        <div key={l} className={cn("w-3 h-1 rounded-full", l <= (incident.asset?.residualRisk || 1) ? (incident.asset?.riskLevel === 'CRITICO' ? 'bg-rose-500' : 'bg-primary') : 'bg-muted')} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {incident.status === 'CLOSED' && (
                                        <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                            <h5 className="text-xs font-bold text-emerald-500 uppercase flex items-center gap-2 mb-1">
                                                <History className="w-3.5 h-3.5" /> Resolución / Causa Raíz
                                            </h5>
                                            <p className="text-sm text-emerald-500/80 font-medium">
                                                {incident.rootCause}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="lg:w-48 flex flex-col justify-center gap-3">
                                    {incident.status === 'OPEN' ? (
                                        <button
                                            onClick={() => handleOpenResolve(incident.id, incident.title)}
                                            className="w-full bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Cerrar Incidente
                                        </button>
                                    ) : (
                                        <div className="text-center p-3 rounded-xl bg-muted/50 border border-dashed text-muted-foreground">
                                            <p className="text-[10px] font-bold uppercase tracking-widest">RESUELTO</p>
                                        </div>
                                    )}
                                    <Link
                                        href={`/incidents/${incident.id}`}
                                        className="w-full bg-secondary text-foreground py-2.5 rounded-xl text-xs font-bold hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
                                    >
                                        Detalles <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <IncidentCreationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            <IncidentResolutionModal
                isOpen={isResolveModalOpen}
                onClose={() => {
                    setIsResolveModalOpen(false);
                    setSelectedIncident(null);
                }}
                incidentId={selectedIncident?.id || null}
                incidentTitle={selectedIncident?.title || null}
            />
        </div>
    );
}
