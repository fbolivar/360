"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Corrected import
import { getComplianceStatus } from "@/features/compliance/services/complianceService";
import { ArrowLeft, CheckCircle2, Circle, AlertCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";

export default function FrameworkDetailPage() {
    const params = useParams(); // useParams returns params object directly
    const frameworkId = params?.id as string;
    const router = useRouter();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!frameworkId) return;
        getComplianceStatus(frameworkId).then(result => {
            setData(result);
            setLoading(false);
        });
    }, [frameworkId]);

    if (loading) return <div className="p-20 text-center">Cargando detalles de la norma...</div>;
    if (!data) return <div className="p-20 text-center">Norma no encontrada.</div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/compliance" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        {data.frameworkName}
                    </h2>
                    <p className="text-sm text-muted-foreground">Detalle de requisitos y cobertura técnica</p>
                </div>
                <div className="ml-auto flex items-center gap-3 bg-card border px-4 py-2 rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-muted-foreground">Cobertura Global</span>
                    <span className="text-2xl font-bold text-primary">{data.percentage}%</span>
                </div>
            </div>

            {/* Requisitos List */}
            <div className="grid gap-4">
                {data.requirementStatus.map((req: any) => (
                    <div key={req.code} className="bg-card border rounded-xl p-5 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 flex-shrink-0 ${req.isFulfilled ? 'text-emerald-500' : 'text-muted-foreground/30'}`}>
                                {req.isFulfilled ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono font-bold text-lg">{req.code}</span>
                                    <h3 className="font-semibold">{req.description}</h3>
                                </div>

                                <div className="bg-muted/30 rounded-lg p-3 text-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                                            Controles Vinculados ({req.controlsCount})
                                        </span>
                                        {req.controlsCount === 0 && (
                                            <span className="flex items-center gap-1 text-rose-500 text-xs font-bold">
                                                <AlertCircle className="w-3 h-3" /> Sin Controles
                                            </span>
                                        )}
                                    </div>

                                    {/* Aquí podríamos listar los controles específicos si el backend los devolviera detallados en este nivel */}
                                    {/* Por ahora mostramos resumen */}
                                    {req.isFulfilled ? (
                                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                                            <ShieldCheck className="w-4 h-4" /> Al menos un control técnico implementado
                                        </div>
                                    ) : (
                                        <div className="text-xs text-muted-foreground italic">
                                            Se requiere implementar y madurar controles asociados (Madurez ≥ Definido).
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
