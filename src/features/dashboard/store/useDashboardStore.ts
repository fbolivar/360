import { create } from 'zustand';
import { getDashboardStats } from '../services/dashboardService';

interface DashboardStore {
    stats: {
        totalAssets: number;
        criticalAssets: number;
        openVulnerabilities: number;
        activeIncidents: number;
        highPriorityIncidents: number;
        recentIncidents: any[];
        avgRisk: number;
    } | null;
    loading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    stats: null,
    loading: false,
    error: null,
    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const stats = await getDashboardStats();
            set({ stats, loading: false });
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            set({ error: "No se pudieron cargar las estadísticas del panel.", loading: false });
        }
    },
}));
