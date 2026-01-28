import { create } from 'zustand';
import { ControlStore, ControlMaturity } from '../types';
import { getControlsAndEvaluations, updateEvaluation } from '../services/controlService';

export const useControlStore = create<ControlStore>((set) => ({
    evaluations: [],
    controls: [],
    loading: false,
    error: null,
    fetchData: async () => {
        set({ loading: true, error: null });
        try {
            const { controls, evaluations } = await getControlsAndEvaluations();
            set({ controls, evaluations: evaluations as any, loading: false });
        } catch (error) {
            set({ error: 'Error al cargar datos de cumplimiento', loading: false });
        }
    },
    updateEvaluation: async (id: string, maturity: ControlMaturity, effectiveness: number) => {
        try {
            const updated = await updateEvaluation(id, maturity, effectiveness);
            set((state) => ({
                evaluations: state.evaluations.map((ev) =>
                    ev.id === id ? { ...ev, ...updated } : ev
                )
            }));
        } catch (error) {
            set({ error: 'Error al actualizar evaluación' });
        }
    },
}));
