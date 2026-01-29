"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    X,
    Gavel,
    Database,
    Shield,
    Loader2,
    AlertCircle,
    LayoutGrid
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useControlStore } from "../store/controlStore";
import { useAssetStore } from "@/features/assets/store/assetStore";

const auditSchema = z.object({
    assetId: z.string().uuid("Debes seleccionar un activo válido"),
    controlId: z.string().uuid("Debes seleccionar un control válido"),
});

type AuditFormData = z.infer<typeof auditSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function NewAuditModal({ isOpen, onClose }: Props) {
    const { createEvaluation, controls, fetchData } = useControlStore();
    const { assets, fetchAssets } = useAssetStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFramework, setSelectedFramework] = useState<string>("ISO 27001:2022");

    const frameworks = ["ISO 27001:2022", "NIST CSF 2.0", "CIS Controls v8"];

    useEffect(() => {
        if (isOpen) {
            if (assets.length === 0) fetchAssets();
            fetchData(selectedFramework);
        }
    }, [isOpen, assets.length, selectedFramework, fetchAssets, fetchData]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AuditFormData>({
        resolver: zodResolver(auditSchema)
    });

    if (!isOpen) return null;

    const onSubmit = async (data: AuditFormData) => {
        setIsSubmitting(true);
        try {
            await createEvaluation(data.assetId, data.controlId);
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
                <div className="p-6 border-b flex justify-between items-center bg-primary/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <Gavel className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Nueva Auditoría</h2>
                            <p className="text-xs text-muted-foreground">Vincular activo a control normativo</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Selector de Activo */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Database className="w-4 h-4 text-primary" /> Activo bajo Evaluación
                        </label>
                        <select
                            {...register("assetId")}
                            className={cn(
                                "w-full bg-secondary/50 border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none",
                                errors.assetId ? "border-rose-500" : "border-border"
                            )}
                        >
                            <option value="">Selecciona un activo...</option>
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

                    {/* Selector de Framework */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-primary" /> Marco Normativo (Framework)
                        </label>
                        <div className="flex bg-muted/30 p-1 rounded-xl gap-1">
                            {frameworks.map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setSelectedFramework(f)}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-[10px] font-black transition-all",
                                        selectedFramework === f
                                            ? "bg-primary text-white shadow-md shadow-primary/20"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selector de Control */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" /> Control Aplicable ({selectedFramework})
                        </label>
                        <select
                            {...register("controlId")}
                            className={cn(
                                "w-full bg-secondary/50 border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none",
                                errors.controlId ? "border-rose-500" : "border-border"
                            )}
                        >
                            <option value="">Selecciona el control...</option>
                            {controls.map((control) => (
                                <option key={control.id} value={control.id}>
                                    {control.code} - {control.name}
                                </option>
                            ))}
                        </select>
                        {errors.controlId && (
                            <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.controlId.message}
                            </p>
                        )}
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl space-y-2 border border-dashed">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Nota de Cumplimiento</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Al vincular un control de **{selectedFramework}**, se iniciará una nueva traza de auditoría. El responsable del activo recibirá una notificación para proveer evidencia técnica.
                        </p>
                    </div>

                    <div className="pt-4 flex gap-3">
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
                            className="flex-1 bg-primary text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Vinculando...
                                </>
                            ) : (
                                "Iniciar Auditoría"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
