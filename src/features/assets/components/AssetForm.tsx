"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetSchema, AssetFormData } from "../schemas/assetSchema";
import { AssetType, ClassificationLevel } from "@prisma/client";
import {
    Database,
    MapPin,
    Shield,
    User,
    FileText,
    CheckCircle2,
    Loader2,
    AlertTriangle
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
    onSubmit: (data: AssetFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function AssetForm({ onSubmit, onCancel, isLoading }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AssetFormData>({
        resolver: zodResolver(assetSchema),
        defaultValues: {
            type: 'SERVIDOR',
            classification: 'USO_INTERNO',
            criticality: 3,
            confidentiality: 3,
            integrity: 3,
            availability: 3,
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" /> Nombre del Activo
                        </label>
                        <input
                            {...register("name")}
                            placeholder="Ej: Servidor SIG Central"
                            className={cn(
                                "w-full bg-secondary/50 border rounded-lg px-4 py-2.5 text-sm transition-all focus:ring-1 focus:ring-primary",
                                errors.name ? "border-rose-500" : "border-border/50"
                            )}
                        />
                        {errors.name && <p className="text-[10px] text-rose-500 font-bold">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Database className="w-3.5 h-3.5" /> Tipo de Activo
                        </label>
                        <select
                            {...register("type")}
                            className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                        >
                            {Object.values(AssetType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5" /> Clasificación
                        </label>
                        <select
                            {...register("classification")}
                            className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                        >
                            {Object.values(ClassificationLevel).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" /> Ubicación
                        </label>
                        <input
                            {...register("location")}
                            placeholder="Ej: Sede Regional Pacífico"
                            className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5" /> Dimensiones de Criticidad
                    </h4>

                    {[
                        { name: 'criticality', label: 'Impacto Misional' },
                        { name: 'confidentiality', label: 'Confidencialidad' },
                        { name: 'integrity', label: 'Integridad' },
                        { name: 'availability', label: 'Disponibilidad' },
                    ].map((dim) => (
                        <div key={dim.name} className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold text-muted-foreground">{dim.label}</label>
                                <span className="text-[10px] font-black text-primary">NIVEL</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                {...register(dim.name as any, { valueAsNumber: true })}
                                className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-[8px] font-bold text-muted-foreground px-1 uppercase tracking-tighter">
                                <span>Bajo</span>
                                <span>Crítico</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Descripción / Propósito Misional
                </label>
                <textarea
                    {...register("description")}
                    rows={3}
                    placeholder="Describe por qué este activo es vital para la conservación..."
                    className="w-full bg-secondary/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary transition-all"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Registrar Activo
                </button>
            </div>
        </form>
    );
}
