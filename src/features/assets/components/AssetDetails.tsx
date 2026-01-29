"use client";

import { Badge } from "@/shared/components/ui/Badge";
import { cn } from "@/shared/lib/utils";
import {
    Database,
    MapPin,
    User as UserIcon,
    ShieldCheck,
    AlertTriangle,
    ArrowLeft,
    Shield,
    Lock,
    RefreshCw,
    Activity
} from "lucide-react";
import Link from "next/link";

interface Props {
    asset: any; // Using any for brevity in this step, but in a real app we'd use the proper Asset type
}

export function AssetDetails({ asset }: Props) {
    if (!asset) return null;

    const riskMetrics = [
        { label: "Criticidad", value: asset.criticality, icon: Activity, color: "rose" },
        { label: "Confidencialidad", value: asset.confidentiality, icon: Lock, color: "amber" },
        { label: "Integridad", value: asset.integrity, icon: Shield, color: "blue" },
        { label: "Disponibilidad", value: asset.availability, icon: RefreshCw, color: "green" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cabecera */}
            <div className="flex flex-col gap-4">
                <Link
                    href="/assets"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Volver al inventario
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-bold tracking-tight">{asset.name}</h2>
                            <Badge variant={asset.classification === 'RESTRINGIDA' ? 'destructive' : 'secondary'} className="px-3 py-1">
                                {asset.classification}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Database className="w-4 h-4" /> {asset.type}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" /> {asset.location || 'Sede Central'}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <UserIcon className="w-4 h-4" /> {asset.owner?.fullName || 'Sin asignar'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Métricas de Riesgo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {riskMetrics.map((metric) => (
                    <div key={metric.label} className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className={cn("p-2 rounded-lg bg-opacity-10", `bg-${metric.color}-500`, `text-${metric.color}-500`)}>
                                <metric.icon className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-bold">{metric.value}/5</span>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                        <div className="mt-3 flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1.5 flex-1 rounded-full",
                                        i <= metric.value ? `bg-${metric.color}-500` : "bg-muted"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vulnerabilidades */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-amber-500" />
                            Vulnerabilidades Detectadas
                        </h3>
                        <Badge variant="outline">{asset.vulnerabilities?.length || 0}</Badge>
                    </div>

                    <div className="bg-card border rounded-xl overflow-hidden">
                        {asset.vulnerabilities && asset.vulnerabilities.length > 0 ? (
                            <div className="divide-y">
                                {asset.vulnerabilities.map((vuln: any) => (
                                    <div key={vuln.id} className="p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-semibold text-sm line-clamp-1">{vuln.description}</p>
                                            <Badge className={cn(
                                                vuln.severity >= 7 ? "bg-rose-500" : "bg-amber-500"
                                            )}>
                                                {vuln.severity}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>Estado: {vuln.status}</span>
                                            <span>•</span>
                                            <span>Detectada: {new Date(vuln.detectedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-muted-foreground italic">
                                No se han detectado vulnerabilidades técnicas en este activo.
                            </div>
                        )}
                    </div>
                </div>

                {/* Incidentes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                            Incidentes de Seguridad
                        </h3>
                        <Badge variant="outline">{asset.incidents?.length || 0}</Badge>
                    </div>

                    <div className="bg-card border rounded-xl overflow-hidden">
                        {asset.incidents && asset.incidents.length > 0 ? (
                            <div className="divide-y">
                                {asset.incidents.map((incident: any) => (
                                    <div key={incident.id} className="p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-semibold text-sm">{incident.title}</h4>
                                            <Badge variant="destructive" className="text-[10px] uppercase">
                                                {incident.severity}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{incident.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded border capitalize",
                                                incident.status === 'OPEN' ? "text-rose-500 border-rose-500/20 bg-rose-500/5" : "text-green-500 border-green-500/20 bg-green-500/5"
                                            )}>
                                                {incident.status}
                                            </span>
                                            <span>{new Date(incident.detectedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-muted-foreground italic">
                                No hay incidentes de seguridad reportados para este activo.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-secondary/30 border border-secondary p-6 rounded-xl">
                <h4 className="font-bold mb-4">Información de Gestión</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Descripción del Activo</p>
                        <p className="font-medium">{asset.description || "Sin descripción proporcionada."}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Fecha de Creación</p>
                        <p className="font-medium">{new Date(asset.createdAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
