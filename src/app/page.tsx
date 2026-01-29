"use client";

import {
  ShieldAlert,
  Database,
  AlertTriangle,
  TrendingUp,
  Map as MapIcon,
  Activity
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useEffect } from "react";
import { useDashboardStore } from "@/features/dashboard/store/useDashboardStore";

const dataRiesgo = [
  { name: 'Monitoreo', riesgo: 45 },
  { name: 'SIG', riesgo: 30 },
  { name: 'Radio', riesgo: 65 },
  { name: 'Sedes', riesgo: 25 },
  { name: 'TIC', riesgo: 55 },
];

const dataTendencia = [
  { fecha: 'Ene', valor: 20 },
  { fecha: 'Feb', valor: 35 },
  { fecha: 'Mar', valor: 45 },
  { fecha: 'Abr', valor: 30 },
  { fecha: 'May', valor: 55 },
  { fecha: 'Jun', valor: 40 },
];

const dataIncidentes = [
  { name: 'Phishing', value: 400 },
  { name: 'Indisponibilidad', value: 300 },
  { name: 'Fuga Info', value: 200 },
  { name: 'Otros', value: 100 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

import { InsightsWidget } from "@/features/intelligence/components/InsightsWidget";

export default function DashboardPage() {
  const { stats, loading, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) return <div className="p-20 text-center animate-pulse text-muted-foreground">Cargando visión estratégica global...</div>;

  const displayStats = stats || {
    totalAssets: 0,
    criticalAssets: 0,
    openVulnerabilities: 0,
    activeIncidents: 0,
    highPriorityIncidents: 0,
    recentIncidents: [],
    avgRisk: 0,
    riskByAssetType: [],
    history: []
  };

  /* 
   * Procesamiento de historial real
   * Si no hay historial, mostramos un punto inicial con el riesgo actual
   */
  const historyData = displayStats.history?.length
    ? displayStats.history.map(h => ({
      fecha: new Date(h.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      valor: Number(h.averageRisk.toFixed(1))
    }))
    : [{ fecha: 'Hoy', valor: displayStats.avgRisk }];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel Ejecutivo</h2>
          <p className="text-muted-foreground mt-1">Gestión de Riesgo Cibernético - Parques Nacionales Naturales</p>
        </div>
        <div className="flex gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <Activity className="w-3 h-3" /> Sistema Nominal
          </span>
        </div>
      </header>

      {/* Intelligent Insights */}
      <InsightsWidget />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Activos Registrados"
          value={displayStats.totalAssets.toLocaleString()}
          sub={`${displayStats.criticalAssets} de criticidad alta`}
          icon={Database}
          color="text-primary"
        />
        <KPICard
          title="Vulnerabilidades"
          value={displayStats.openVulnerabilities.toLocaleString()}
          sub="Pendientes de mitigación"
          icon={ShieldAlert}
          color="text-amber-500"
        />
        <KPICard
          title="Incidentes Activos"
          value={displayStats.activeIncidents}
          sub={`${displayStats.highPriorityIncidents} prioridad crítica`}
          icon={AlertTriangle}
          color="text-rose-500"
        />
        <KPICard
          title="Postura de Riesgo"
          value={`${displayStats.avgRisk >= 4 ? 'Alto' : displayStats.avgRisk >= 2.5 ? 'Medio' : 'Bajo'} (${displayStats.avgRisk})`}
          sub="Basado en impacto misional"
          icon={TrendingUp}
          color={displayStats.avgRisk >= 4 ? "text-rose-500" : displayStats.avgRisk >= 2.5 ? "text-amber-500" : "text-emerald-500"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-8 rounded-xl border">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Riesgo por Tipo de Activo
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayStats.riskByAssetType || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickFormatter={(val) => val.length > 10 ? `${val.substring(0, 10)}...` : val}
                />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="riesgo" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-8 rounded-xl border">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Tendencia Histórica de Amenazas
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="fecha" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                />
                <Line type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card p-8 rounded-xl border">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-primary" /> Incidentes Recientes en territorio
          </h3>
          <div className="space-y-4">
            {displayStats.recentIncidents.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground outline-dashed outline-1 rounded-lg">No hay incidentes reportados recientemente.</p>
            ) : (
              displayStats.recentIncidents.map((incident: any) => (
                <IncidentItem
                  key={incident.id}
                  title={incident.title}
                  severity={incident.severity}
                  time={new Date(incident.detectedAt).toLocaleDateString()}
                  assetName={incident.asset?.name}
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-card p-8 rounded-xl border flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Distribución de Alertas</h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataIncidentes}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataIncidentes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {dataIncidentes.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, sub, icon: Icon, color }: any) {
  return (
    <div className="bg-card p-6 rounded-xl border hover:border-primary/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg bg-secondary", color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px] font-bold">{title}</p>
      <h4 className="text-2xl font-bold mt-1 group-hover:text-primary transition-colors">{value}</h4>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function IncidentItem({ title, severity, time, assetName }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-transparent hover:border-border transition-all cursor-default">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-2 h-2 rounded-full",
          severity === 'CRITICA' ? 'bg-rose-500 animate-pulse' :
            severity === 'ALTA' ? 'bg-amber-500' : 'bg-blue-500'
        )} />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <div className="flex gap-2 items-center mt-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{time}</p>
            {assetName && <span className="text-[10px] text-primary font-bold px-1.5 bg-primary/10 rounded">{assetName}</span>}
          </div>
        </div>
      </div>
      <span className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded border",
        severity === 'CRITICA' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
          severity === 'ALTA' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
            'bg-blue-500/10 text-blue-500 border-blue-500/20'
      )}>
        {severity}
      </span>
    </div>
  );
}

