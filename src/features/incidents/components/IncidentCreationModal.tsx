"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    X,
    AlertTriangle,
    Database,
    ShieldAlert,
    Loader2,
    AlertCircle,
    Type
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useIncidentStore } from "../store/incidentStore";
import { useAssetStore } from "@/features/assets/store/assetStore";

const incidentSchema = z.object({
    title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
    description: z.string().min(10, "Describe brevemente lo ocurrido"),
    severity: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']),
    assetId: z.string().uuid("Debes seleccionar un activo afectado"),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function IncidentCreationModal({ isOpen, onClose }: Props) {
    const { createIncident } = useIncidentStore();
    const { assets, fetchAssets } = useAssetStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && assets.length === 0) {
            fetchAssets();
        }
    }, [isOpen, assets.length, fetchAssets]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<IncidentFormData>({
        resolver: zodResolver(incidentSchema),
        defaultValues: {
            severity: 'MEDIA'
        }
    });

    if (!isOpen) return null;

    const onSubmit = async (data: IncidentFormData) => {
        setIsSubmitting(true);
        try {
            await createIncident(data);
            reset();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b flex justify-between items-center bg-rose-500/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-rose-500/10 p-2 rounded-lg text-rose-500">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Reportar Incidente</h2>
                            <p className="text-xs text-muted-foreground">Registro inmediato de evento de seguridad</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    {/* Título */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Type className="w-4 h-4 text-primary" /> Título del Incidente
                        </label>
                        <input
                            {...register("title")}
                            placeholder="Ej: Acceso no autorizado a servidor de producción"
                            className={cn(
                                "w-full bg-secondary/50 border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none",
                                errors.title ? "border-rose-500" : "border-border"
                            )}
                        />
                        {errors.title && (
                            <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Activo */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Database className="w-4 h-4 text-primary" /> Activo Impactado
                        </label>
                        <select
                            {...register("assetId")}
                            className={cn(
                                "w-full bg-secondary/50 border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none",
                                errors.assetId ? "border-rose-500" : "border-border"
                            )}
                        >
                            <option value="">Selecciona el activo afectado...</option>
                            {assets.map((asset) => (
                                <option key={asset.id} value={asset.id}>
                                    {asset.name} ({asset.type})
                                </option>
                            ))}
                        </select>
                        {errors.assetId && (
                            <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.assetId.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Severidad */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-primary" /> Severidad
                            </label>
                            <select
                                {...register("severity")}
                                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm outline-none"
                            >
                                <option value="BAJA">Baja</option>
                                <option value="MEDIA">Media</option>
                                <option value="ALTA">Alta</option>
                                <option value="CRITICA">Crítica</option>
                            </select>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            Descripción del Suceso
                        </label>
                        <textarea
                            {...register("description")}
                            rows={3}
                            placeholder="Detalles sobre cómo se detectó, el impacto inicial y acciones tomadas..."
                            className={cn(
                                "w-full bg-secondary/50 border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none",
                                errors.description ? "border-rose-500" : "border-border"
                            )}
                        />
                        {errors.description && (
                            <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                        <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Alerta de Riesgo Automática
                        </p>
                        <p className="text-[10px] text-amber-700 leading-tight">
                            Este reporte activará el **Motor de Riesgo PNN**. El riesgo residual del activo aumentará instantáneamente hasta que el incidente sea mitigado y cerrado.
                        </p>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border font-bold text-sm hover:bg-secondary transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-rose-500 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Registrando...
                                </>
                            ) : (
                                "Reportar Evento"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
