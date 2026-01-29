"use client";

import { Badge } from "@/shared/components/ui/Badge";
import {
    ShieldAlert,
    Clock,
    MapPin,
    ArrowLeft,
    History,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    Target
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface Props {
    incident: any;
}

export function IncidentDetails({ incident }: Props) {
    if (!incident) return null;

    const severityColors = {
        'CRITICA': 'bg-rose-500 text-white shadow-rose-500/20',
        'ALTA': 'bg-amber-500 text-white shadow-amber-500/20',
        'MEDIA': 'bg-blue-500 text-white shadow-blue-500/20',
        'BAJA': 'bg-slate-500 text-white shadow-slate-500/20'
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Navigation */}
            <div className="flex flex-col gap-4">
                <Link
                    href="/incidents"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group w-fit"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver a Incidentes
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "text-[10px] font-black px-2 py-0.5 rounded tracking-[0.2em] shadow-sm uppercase",
                                severityColors[incident.severity as keyof typeof severityColors] || 'bg-secondary text-muted-foreground'
                            )}>
                                {incident.severity}
                            </span>
                            <Badge variant={incident.status === 'OPEN' ? 'destructive' : 'secondary'}>
                                {incident.status === 'OPEN' ? 'INCIDENTE ACTIVO' : 'RESUELTO'}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase">{incident.title}</h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Event Description */}
                    <div className="bg-card border rounded-2xl p-8 space-y-6 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                        <div className="relative z-10 space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" /> Descripción del Evento
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {incident.description || "No se proporcionó una descripción adicional para este evento de seguridad."}
                            </p>
                        </div>

                        {incident.status === 'CLOSED' && (
                            <div className="mt-8 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                                <h4 className="text-sm font-bold text-emerald-500 flex items-center gap-2 uppercase tracking-wider">
                                    <CheckCircle2 className="w-4 h-4" /> Causa Raíz y Resolución
                                </h4>
                                <p className="text-emerald-500/80 font-medium">
                                    {incident.rootCause || "Incidente cerrado sin causa raíz documentada."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Timeline & Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-secondary/20 border border-border/50 rounded-2xl p-6 space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" /> Temporalidad
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Detección Inicial</p>
                                    <p className="font-bold">{new Date(incident.detectedAt).toLocaleString()}</p>
                                </div>
                                {incident.status === 'CLOSED' && (
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Cierre de Incidente</p>
                                        <p className="font-bold text-emerald-500">Documentado en Histórico</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-secondary/20 border border-border/50 rounded-2xl p-6 space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Target className="w-3.5 h-3.5" /> Analista Asignado
                            </h4>
                            <div className="space-y-1">
                                <p className="font-bold">SOC L1 / Analyst</p>
                                <p className="text-sm text-muted-foreground">Sistema Automatizado de Alertas</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info: Impacted Asset */}
                <div className="space-y-6">
                    <div className="bg-card border rounded-2xl p-6 space-y-6 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                            <ShieldAlert className="w-4 h-4" /> Activo Impactado
                        </h3>

                        {incident.asset ? (
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <p className="text-xl font-black tracking-tight">{incident.asset.name}</p>
                                    <Badge variant="outline" className="text-[10px]">
                                        {incident.asset.type}
                                    </Badge>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">{incident.asset.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <AlertTriangle className="w-4 h-4 text-primary" />
                                        <div className="space-y-1">
                                            <span className="font-medium">Criticidad Mission-Critical</span>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} className={cn("w-4 h-1 rounded-full", i <= incident.asset.criticality ? 'bg-primary' : 'bg-muted')} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Responsable Activo</p>
                                    <p className="text-sm font-bold">{incident.asset.owner?.name || "No asignado"}</p>
                                    <p className="text-xs text-muted-foreground">{incident.asset.owner?.email || "N/A"}</p>
                                </div>

                                <Link
                                    href={`/assets/${incident.assetId}`}
                                    className="block w-full text-center py-2.5 rounded-xl bg-secondary text-xs font-bold hover:bg-secondary/80 transition-all"
                                >
                                    Ver Inventario de Activo
                                </Link>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Este incidente no tiene un activo vinculado.</p>
                        )}
                    </div>

                    <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                        <h4 className="text-xs font-bold uppercase tracking-tight text-primary mb-2">Protocolo de Respuesta</h4>
                        <p className="text-xs text-primary/70 leading-relaxed font-medium">
                            Siga la guía de respuesta ante incidentes (IRP) correspondiente a la categoría del evento. Registre cada acción en el log de auditoría.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
