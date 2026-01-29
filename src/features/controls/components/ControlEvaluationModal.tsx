"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    X,
    ShieldCheck,
    BarChart3,
    Trophy,
    Loader2,
    FileText,
    MessageSquare
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ControlMaturity, AssetControl } from "../types";
import { useControlStore } from "../store/controlStore";

const evaluationSchema = z.object({
    maturity: z.enum(['INEXISTENTE', 'INICIAL', 'REPETIBLE', 'DEFINIDO', 'GESTIONADO', 'OPTIMIZADO']),
    effectiveness: z.number().min(0).max(100),
    evidence: z.string().optional(),
    comments: z.string().optional(),
});

type EvaluationFormData = z.infer<typeof evaluationSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    evaluation: AssetControl | null;
}

export function ControlEvaluationModal({ isOpen, onClose, evaluation }: Props) {
    const { updateEvaluation } = useControlStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<EvaluationFormData>({
        resolver: zodResolver(evaluationSchema),
        values: evaluation ? {
            maturity: evaluation.maturity,
            effectiveness: Number(evaluation.effectiveness),
            evidence: evaluation.evidence || "",
            comments: evaluation.comments || "",
        } : undefined
    });

    if (!isOpen || !evaluation) return null;

    const onSubmit = handleSubmit(async (data: EvaluationFormData) => {
        setIsSubmitting(true);
        try {
            await updateEvaluation(evaluation.id, data.maturity, data.effectiveness, data.evidence, data.comments);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    });

    const maturityDescriptions = {
        INEXISTENTE: "No hay proceso ni intención de implementarlo.",
        INICIAL: "Procesos ad-hoc y desorganizados.",
        REPETIBLE: "Procesos siguen un patrón regular, no documentado.",
        DEFINIDO: "Procesos documentados y comunicados.",
        GESTIONADO: "Procesos monitoreados y medidos.",
        OPTIMIZADO: "Enfoque en mejora continua adaptativa."
    };

    const currentMaturity = watch("maturity");
    const currentEffectiveness = watch("effectiveness");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b flex justify-between items-center bg-emerald-500/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Re-evaluar Control</h2>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{evaluation.control?.code}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-muted-foreground">Activo Evaluado</p>
                        <p className="text-lg font-black tracking-tight">{evaluation.asset?.name}</p>
                    </div>

                    {/* Madurez */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-emerald-500" /> Nivel de Madurez (CMMI)
                        </label>
                        <select
                            {...register("maturity")}
                            className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        >
                            {['INEXISTENTE', 'INICIAL', 'REPETIBLE', 'DEFINIDO', 'GESTIONADO', 'OPTIMIZADO'].map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-muted-foreground italic px-1">
                            {maturityDescriptions[currentMaturity as keyof typeof maturityDescriptions]}
                        </p>
                    </div>

                    {/* Efectividad */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-primary" /> Efectividad Operativa
                            </label>
                            <span className="text-2xl font-black text-primary">{currentEffectiveness || 0}%</span>
                        </div>
                        <input
                            type="range"
                            {...register("effectiveness", { valueAsNumber: true })}
                            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase px-1">
                            <span>0% (Inútil)</span>
                            <span>100% (Robusto)</span>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-dashed">
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-emerald-500" /> Referencia de Evidencia
                            </label>
                            <input
                                {...register("evidence")}
                                placeholder="URL o ID de documento..."
                                className="w-full bg-secondary/50 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-emerald-500" /> Comentarios
                            </label>
                            <textarea
                                {...register("comments")}
                                rows={3}
                                placeholder="Observaciones de la evaluación..."
                                className="w-full bg-secondary/50 border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                            />
                        </div>
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
                            className="flex-1 bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
                                </>
                            ) : (
                                "Guardar Evaluación"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
