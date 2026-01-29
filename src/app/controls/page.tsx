"use client";

import { ControlList } from "@/features/controls/components/ControlList";
import { AuditLogViewer } from "@/features/controls/components/AuditLogViewer";
import { ShieldCheck, History, Gavel } from "lucide-react";
import { useState } from "react";
import { NewAuditModal } from "@/features/controls/components/NewAuditModal";
import { ComplianceSummary } from "@/features/controls/components/ComplianceSummary";

export default function ControlsPage() {
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

    return (
        <div className="space-y-8 text-foreground">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase mb-3 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" /> Compliance ISO 27001:2022
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">Controles y Auditoría</h2>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Monitoreo de madurez de seguridad y trazabilidad institucional
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsAuditModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                        <Gavel className="w-4 h-4" /> Nueva Auditoría
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    <ControlList />
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                        <History className="w-4 h-4" /> Actividad Reciente
                    </div>
                    <AuditLogViewer />

                    <ComplianceSummary />
                </div>
            </div>

            <NewAuditModal
                isOpen={isAuditModalOpen}
                onClose={() => setIsAuditModalOpen(false)}
            />
        </div>
    );
}
