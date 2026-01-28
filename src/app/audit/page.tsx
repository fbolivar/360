import { AuditLogViewer } from "@/features/controls/components/AuditLogViewer";
import { Terminal, Download, Filter } from "lucide-react";

export default function AuditPage() {
    return (
        <div className="space-y-8 text-foreground">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase mb-3 border border-blue-500/20">
                        <Terminal className="w-3 h-3" /> Logs Inmutables
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">Trazabilidad de Auditoría</h2>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Evidencia técnica y operativa para entes de control
                    </p>
                </div>

                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-secondary text-foreground text-xs font-bold hover:bg-secondary/80 transition-all flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filtrar
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                        <Download className="w-4 h-4" /> Exportar Reporte
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto">
                <AuditLogViewer />
                <div className="mt-6 p-4 rounded-xl bg-card border border-dashed border-border flex items-center justify-between">
                    <p className="text-xs text-muted-foreground italic">
                        * Los logs de auditoría son inmutables y cumplen con los requisitos de la Ley 1581 de Protección de Datos Personales.
                    </p>
                    <span className="text-[10px] font-black text-emerald-500 uppercase">Verificado por System Integrity</span>
                </div>
            </div>
        </div>
    );
}
