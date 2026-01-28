import { create } from 'zustand';
import { Asset } from '../types';
import { getAssets, createAsset } from '../services/assetService';
import { AssetFormData } from '../schemas/assetSchema';

interface AssetStore {
    assets: any[];
    loading: boolean;
    error: string | null;
    fetchAssets: () => Promise<void>;
    addAsset: (formData: AssetFormData) => Promise<void>;
    updateAssetInStore: (id: string, asset: any) => void;
    deleteAssetFromStore: (id: string) => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
    assets: [],
    loading: false,
    error: null,
    fetchAssets: async () => {
        set({ loading: true, error: null });
        try {
            const assets = await getAssets();
            set({ assets, loading: false });
        } catch (error) {
            set({ error: 'Fallo al obtener activos', loading: false });
        }
    },
    addAsset: async (formData) => {
        set({ loading: true, error: null });
        try {
            const newAsset = await createAsset(formData);
            set((state) => ({
                assets: [newAsset, ...state.assets],
                loading: false
            }));
        } catch (error) {
            set({ error: 'Fallo al crear el activo', loading: false });
            throw error;
        }
    },
    updateAssetInStore: (id, updatedAsset) => set((state) => ({
        assets: state.assets.map((a) => a.id === id ? { ...a, ...updatedAsset } : a)
    })),
    deleteAssetFromStore: (id) => set((state) => ({
        assets: state.assets.filter((a) => a.id !== id)
    })),
}));
