"use client";

import { useEffect, useState } from "react";
import { getFrameworks, getComplianceStatus } from "@/features/compliance/services/complianceService";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface FrameworkSummary {
    id: string;
    name: string;
    description: string | null;
    compliancePercentage: number;
}

export default function CompliancePage() {
    const [frameworks, setFrameworks] = useState<FrameworkSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const list = await getFrameworks();
                // Calcular progreso para cada uno
                const summaries = await Promise.all(list.map(async (fw) => {
                    const status = await getComplianceStatus(fw.id);
                    return {
                        ...fw,
                        compliancePercentage: status.percentage
                    };
                }));
                setFrameworks(summaries);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-primary" /> Compliance Manager
                </h2>
                <p className="text-muted-foreground mt-1">
                    Gestiona el cumplimiento normativo alineando tus controles técnicos con estándares internacionales.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {frameworks.map(fw => (
                    <div key={fw.id} className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all group">
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <span className="text-2xl font-bold">{fw.compliancePercentage}%</span>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg">{fw.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {fw.description}
                                </p>
                            </div>

                            {/* Barra de Progreso */}
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000 ease-out"
                                    style={{ width: `${fw.compliancePercentage}%` }}
                                />
                            </div>
                        </div>

                        <div className="bg-muted/30 p-4 border-t flex justify-between items-center group-hover:bg-muted/50 transition-colors">
                            <span className="text-xs font-medium text-muted-foreground">Ver requisitos</span>
                            <Link href={`/compliance/${fw.id}`} className="p-2 bg-background border rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}

                {/* Placeholder para agregar más */}
                <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center text-muted-foreground gap-2 hover:bg-muted/10 transition-colors cursor-not-allowed opacity-60">
                    <ShieldCheck className="w-8 h-8 opacity-50" />
                    <span className="font-bold">Agregar Framework</span>
                    <span className="text-xs">Próximamente: NIST, SOC 2</span>
                </div>
            </div>
        </div>
    );
}
