"use client";

import { useEffect, useState } from "react";
import { useUserRole } from "@/features/auth/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, Filter, Download, User as UserIcon, Calendar } from "lucide-react";
import { getAuditLogs, getAuditStats, AuditLogWithUser } from "@/features/audit/services/auditService";
import { Badge } from "@/shared/components/ui/Badge";

export default function AuditPage() {
    const { role, loading, canAudit } = useUserRole();
    const router = useRouter();

    const [logs, setLogs] = useState<AuditLogWithUser[]>([]);
    const [stats, setStats] = useState({ totalLogs: 0, todayLogs: 0 });
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        entityType: ""
    });

    useEffect(() => {
        if (!loading && !canAudit) {
            router.push("/");
        }
    }, [loading, canAudit, router]);

    useEffect(() => {
        if (canAudit) {
            Promise.all([
                getAuditLogs(),
                getAuditStats()
            ]).then(([fetchedLogs, fetchedStats]) => {
                setLogs(fetchedLogs);
                setStats(fetchedStats);
                setIsLoadingData(false);
            });
        }
    }, [canAudit]);

    const handleSearch = () => {
        setIsLoadingData(true);
        getAuditLogs({
            action: filters.search,
            entityType: filters.entityType
        }).then(fetchedLogs => {
            setLogs(fetchedLogs);
            setIsLoadingData(false);
        });
    };

    if (loading || isLoadingData) return <div className="p-20 text-center animate-pulse">Cargando registros de auditoría...</div>;
    if (!canAudit) return null;

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-primary" /> Auditoría del Sistema
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Traza inmutable de acciones para cumplimiento normativo (ISO 27001 / SOC 2).
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-card p-3 rounded-lg border text-center min-w-[120px]">
                        <div className="text-2xl font-bold">{stats.todayLogs}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">Eventos Hoy</div>
                    </div>
                    <div className="bg-card p-3 rounded-lg border text-center min-w-[120px]">
                        <div className="text-2xl font-bold">{stats.totalLogs}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-widest">Total Histórico</div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-card p-4 rounded-xl border flex gap-4 items-center flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por acción..."
                        className="w-full pl-9 pr-4 py-2 rounded-md border bg-background"
                        value={filters.search}
                        onChange={e => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
                <select
                    className="p-2 rounded-md border bg-background min-w-[150px]"
                    value={filters.entityType}
                    onChange={e => setFilters({ ...filters, entityType: e.target.value })}
                >
                    <option value="">Todas las Entidades</option>
                    <option value="Asset">Activos</option>
                    <option value="Vulnerability">Vulnerabilidades</option>
                    <option value="Incident">Incidentes</option>
                    <option value="Control">Controles</option>
                    <option value="User">Usuarios</option>
                    <option value="SystemSettings">Configuración</option>
                </select>
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors flex items-center gap-2"
                >
                    <Filter className="w-4 h-4" /> Filtrar
                </button>
                <button
                    className="px-4 py-2 border rounded-md hover:bg-muted transition-colors flex items-center gap-2 ml-auto"
                    onClick={() => window.print()}
                >
                    <Download className="w-4 h-4" /> Exportar Informe
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="p-4">Fecha / Hora</th>
                            <th className="p-4">Actor</th>
                            <th className="p-4">Acción</th>
                            <th className="p-4">Entidad Afectada</th>
                            <th className="p-4">Detalles</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                                    No se encontraron registros con los filtros actuales.
                                </td>
                            </tr>
                        ) : logs.map((log) => (
                            <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                                <td className="p-4 font-mono text-xs">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <UserIcon className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{log.user?.fullName || 'Sistema / Anon'}</div>
                                            <div className="text-xs text-muted-foreground">{log.user?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge variant={
                                        log.action.includes("CREATE") ? "success" :
                                            log.action.includes("DELETE") ? "destructive" :
                                                log.action.includes("UPDATE") ? "warning" : "default"
                                    }>
                                        {log.action}
                                    </Badge>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium">{log.entityType}</div>
                                    <div className="text-xs text-muted-foreground font-mono">{log.entityId?.substring(0, 8)}...</div>
                                </td>
                                <td className="p-4 text-xs font-mono text-muted-foreground max-w-xs truncate">
                                    {JSON.stringify(log.details)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-center text-xs text-muted-foreground">
                Mostrando últimos {logs.length} eventos.
            </div>
        </div>
    );
}
