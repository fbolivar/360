import { create } from 'zustand';
import { ControlStore, ControlMaturity } from '../types';
import { getControlsAndEvaluations, updateEvaluation, createEvaluation } from '../services/controlService';

export const useControlStore = create<ControlStore>((set) => ({
    evaluations: [],
    controls: [],
    loading: false,
    error: null,
    fetchData: async (framework?: string) => {
        set({ loading: true, error: null });
        try {
            const { controls, evaluations } = await getControlsAndEvaluations(framework);
            set({ controls, evaluations: evaluations as any, loading: false });
        } catch (error) {
            set({ error: 'Error al cargar datos de cumplimiento', loading: false });
        }
    },
    updateEvaluation: async (id: string, maturity: ControlMaturity, effectiveness: number, evidence?: string, comments?: string) => {
        try {
            const updated = await updateEvaluation(id, maturity, effectiveness, undefined, evidence, comments);
            set((state) => ({
                evaluations: state.evaluations.map((ev) =>
                    ev.id === id ? { ...ev, ...updated } : ev
                )
            }));
        } catch (error) {
            set({ error: 'Error al actualizar evaluación' });
        }
    },
    createEvaluation: async (assetId: string, controlId: string) => {
        set({ loading: true, error: null });
        try {
            const newEv = await createEvaluation(assetId, controlId);
            set((state) => ({
                evaluations: [newEv as any, ...state.evaluations],
                loading: false
            }));
        } catch (error) {
            set({ error: 'Error al crear vinculación de control', loading: false });
        }
    },
}));
