import { VulnerabilityList } from "@/features/vulnerabilities/components/VulnerabilityList";
import { ShieldAlert, Info } from "lucide-react";

export default function VulnerabilitiesPage() {
    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase mb-3 border border-rose-500/20">
                        <ShieldAlert className="w-3 h-3" /> Falla de Seguridad Detectada
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">Vulnerabilidades Técnicas</h2>
                    <p className="text-muted-foreground mt-2 text-lg">Control de brechas y remediación en infraestructura PNN</p>
                </div>

                <div className="flex gap-4 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 max-w-sm">
                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-[11px] text-blue-500/80 leading-relaxed font-medium">
                        El SLA de remediación para vulnerabilidades de severidad **CRÍTICA** (CVSS &gt; 9.0) es de **48 horas** según la política institucional.
                    </p>
                </div>
            </header>

            <VulnerabilityList />
        </div>
    );
}
