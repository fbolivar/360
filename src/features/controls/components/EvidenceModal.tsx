"use client";

import { useState } from "react";
import {
    X,
    FileText,
    MessageSquare,
    Save,
    Loader2,
    ShieldCheck,
    AlertCircle,
    ExternalLink
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useControlStore } from "../store/controlStore";
import { AssetControl } from "../types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    evaluation: AssetControl | null;
}

export function EvidenceModal({ isOpen, onClose, evaluation }: Props) {
    const { updateEvaluation } = useControlStore();
    const [isSaving, setIsSaving] = useState(false);
    const [evidence, setEvidence] = useState(evaluation?.evidence || "");
    const [comments, setComments] = useState(evaluation?.comments || "");

    if (!isOpen || !evaluation) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateEvaluation(
                evaluation.id,
                evaluation.maturity,
                evaluation.effectiveness,
                evidence,
                comments
            );
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b flex justify-between items-center bg-primary/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Evidencia de Cumplimiento</h2>
                            <p className="text-xs text-muted-foreground">
                                {evaluation.control?.code} - {evaluation.control?.name}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2 text-primary">
                                <FileText className="w-4 h-4" /> Link o Referencia de Evidencia
                            </label>
                            <input
                                type="text"
                                value={evidence}
                                onChange={(e) => setEvidence(e.target.value)}
                                placeholder="URL de SharePoint, ID de documento o descripción física..."
                                className="w-full bg-secondary/50 border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Indica dónde se encuentra el artefacto que soporta este control.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2 text-primary">
                                <MessageSquare className="w-4 h-4" /> Comentarios del Auditor
                            </label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                rows={4}
                                placeholder="Observaciones detalladas sobre la implementación del control..."
                                className="w-full bg-secondary/50 border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                            />
                        </div>
                    </div>

                    <div className="bg-secondary/20 p-4 rounded-xl border border-dashed flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                            <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estado de Madurez Actual</p>
                            <p className="text-sm font-semibold">{evaluation.maturity} ({Math.round(evaluation.effectiveness * 100)}% Efectivo)</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-secondary/30 border-t flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border font-bold text-sm bg-background hover:bg-secondary transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Guardar Evidencia
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
