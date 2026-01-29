"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    X,
    CheckCircle2,
    History,
    Loader2,
    AlertCircle,
    FileText
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useIncidentStore } from "../store/incidentStore";

const resolutionSchema = z.object({
    rootCause: z.string().min(10, "Por favor describe la causa raíz y acciones tomadas (mínimo 10 caracteres)"),
});

type ResolutionFormData = z.infer<typeof resolutionSchema>;

interface Props {
    isOpen: boolean;
    onClose: () => void;
    incidentId: string | null;
    incidentTitle: string | null;
}

export function IncidentResolutionModal({ isOpen, onClose, incidentId, incidentTitle }: Props) {
    const { resolveIncident } = useIncidentStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ResolutionFormData>({
        resolver: zodResolver(resolutionSchema)
    });

    if (!isOpen || !incidentId) return null;

    const onSubmit = async (data: ResolutionFormData) => {
        setIsSubmitting(true);
        try {
            await resolveIncident(incidentId, data.rootCause);
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
                <div className="p-6 border-b flex justify-between items-center bg-emerald-500/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Cerrar Incidente</h2>
                            <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {incidentTitle}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="bg-secondary/30 p-4 rounded-xl space-y-2 border border-dashed text-center">
                        <History className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Para formalizar el cierre del evento, es necesario documentar qué sucedió y qué acciones se ejecutaron para mitigar el riesgo.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" /> Causa Raíz y Resolución
                        </label>
                        <textarea
                            {...register("rootCause")}
                            rows={5}
                            placeholder="Describe el análisis post-mortem y la solución final..."
                            className={cn(
                                "w-full bg-secondary/50 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none",
                                errors.rootCause ? "border-rose-500" : "border-border"
                            )}
                        />
                        {errors.rootCause && (
                            <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.rootCause.message}
                            </p>
                        )}
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
                            className="flex-1 bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
                                </>
                            ) : (
                                "Confirmar Cierre"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
