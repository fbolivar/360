"use client";

import { useEffect } from "react";
import { useAssetStore } from "../store/assetStore";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/Badge";
import {
    Database,
    MapPin,
    User,
    ShieldCheck,
    AlertTriangle,
    ExternalLink,
    Plus
} from "lucide-react";

import { useState } from "react";
import { AssetCreationModal } from "./AssetCreationModal";
import Link from "next/link";

export function AssetList() {
    const { assets, loading, fetchAssets } = useAssetStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    if (loading && assets.length === 0) return <div className="p-10 text-center text-muted-foreground animate-pulse">Cargando inventario de activos...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold">Inventario de Activos</h3>
                    <p className="text-sm text-muted-foreground">Gestión y control de activos de información institucional</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" /> Nuevo Activo
                </button>
            </div>

            <AssetCreationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="grid gap-4">
                {assets.length === 0 ? (
                    <div className="p-20 border-2 border-dashed rounded-xl text-center">
                        <Database className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">No hay activos registrados en este entorno.</p>
                    </div>
                ) : (
                    assets.map((asset) => (
                        <div key={asset.id} className="bg-card border rounded-xl p-5 hover:border-primary/40 transition-all group relative overflow-hidden">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="bg-secondary p-3 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Database className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-lg">{asset.name}</h4>
                                            <Badge variant={asset.classification === 'RESTRINGIDA' ? 'destructive' : 'secondary'}>
                                                {asset.classification}
                                            </Badge>
                                            <Badge variant="outline" className="font-normal text-[10px]">
                                                {asset.type}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5" /> {asset.location || 'Sede Central'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" /> {asset.owner?.fullName || 'Sin asignar'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Cálculo de Riesgo</p>
                                        <div className="flex flex-col items-end">
                                            <span className={cn(
                                                "text-sm font-black tracking-tight",
                                                asset.riskLevel === 'CRITICO' ? 'text-rose-500' :
                                                    asset.riskLevel === 'ALTO' ? 'text-orange-500' :
                                                        asset.riskLevel === 'MEDIO' ? 'text-amber-500' :
                                                            'text-emerald-500'
                                            )}>
                                                {asset.riskLevel} ({asset.residualRisk})
                                            </span>
                                            <div className="flex gap-0.5 mt-1">
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={cn(
                                                            "w-3 h-1 rounded-full",
                                                            level <= Math.ceil(asset.residualRisk)
                                                                ? asset.riskLevel === 'CRITICO' ? "bg-rose-500" :
                                                                    asset.riskLevel === 'ALTO' ? "bg-orange-500" :
                                                                        asset.riskLevel === 'MEDIO' ? "bg-amber-500" : "bg-emerald-500"
                                                                : "bg-muted"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex gap-2">
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                                                <ShieldCheck className="w-2.5 h-2.5" /> {asset._count.vulnerabilities} Vulns
                                            </span>
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
                                                <AlertTriangle className="w-2.5 h-2.5" /> {asset._count.incidents} Incid
                                            </span>
                                        </div>
                                        <Link
                                            href={`/assets/${asset.id}`}
                                            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                        >
                                            Ver detalles <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

