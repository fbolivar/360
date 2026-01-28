import { IncidentList } from "@/features/incidents/components/IncidentList";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function IncidentsPage() {
    return (
        <div className="space-y-8 text-foreground">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase mb-3 border border-amber-500/20">
                        <AlertTriangle className="w-3 h-3" /> Eventos en Tiempo Real
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">Gestión de Incidentes</h2>
                    <p className="text-muted-foreground mt-2 text-lg italic">
                        "Protegiendo la infraestructura del monitoreo ambiental nacional"
                    </p>
                </div>

                <div className="flex items-center gap-6 px-6 py-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Estado General</p>
                            <p className="text-sm font-bold text-emerald-500">Bajo Control</p>
                        </div>
                    </div>
                </div>
            </header>

            <IncidentList />
        </div>
    );
}
