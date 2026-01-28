import { create } from 'zustand';
import { IncidentStore } from '../types';
import { getIncidents, closeIncident } from '../services/incidentService';

export const useIncidentStore = create<IncidentStore>((set) => ({
    incidents: [],
    loading: false,
    error: null,
    fetchIncidents: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getIncidents();
            set({ incidents: data as any, loading: false });
        } catch (error) {
            set({ error: 'Error al cargar incidentes', loading: false });
        }
    },
    resolveIncident: async (id: string, rootCause: string) => {
        try {
            const updated = await closeIncident(id, rootCause);
            set((state) => ({
                incidents: state.incidents.map((inc) =>
                    inc.id === id ? { ...inc, ...updated } : inc
                )
            }));
        } catch (error) {
            set({ error: 'Error al cerrar el incidente' });
        }
    },
}));
