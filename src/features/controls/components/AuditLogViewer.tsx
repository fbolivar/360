"use client";

import { useEffect, useState } from "react";
import { getAuditLogs } from "../services/controlService";
import { Activity, User, Shield, Terminal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/Badge";

export function AuditLogViewer() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAuditLogs().then(data => {
            setLogs(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="animate-pulse py-8 text-center text-xs font-bold uppercase text-muted-foreground tracking-widest">Compilando traza de auditoría...</div>;

    return (
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary" /> Immutable Audit Trail
                </h4>
                <Badge variant="outline" className="text-[10px]">Real-time Streaming</Badge>
            </div>

            <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto custom-scrollbar">
                {logs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-muted/10 transition-colors flex items-start gap-4">
                        <div className={cn(
                            "p-2 rounded-lg shrink-0",
                            log.action.includes('DELETE') ? 'bg-rose-500/10 text-rose-500' :
                                log.action.includes('CREATE') ? 'bg-emerald-500/10 text-emerald-500' :
                                    'bg-blue-500/10 text-blue-500'
                        )}>
                            <Activity className="w-4 h-4" />
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold tracking-tight">{log.action}</p>
                                <span className="text-[10px] font-bold text-muted-foreground">{new Date(log.createdAt).toLocaleTimeString()}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    <User className="w-3 h-3 opacity-50" /> {log.user?.fullName || 'System'}
                                </p>
                                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    <Shield className="w-3 h-3 opacity-50" /> {log.entityType} ({log.entityId?.substring(0, 8)})
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="p-10 text-center text-muted-foreground text-sm">No se registran logs de auditoría en las últimas 24h.</div>
                )}
            </div>
        </div>
    );
}
