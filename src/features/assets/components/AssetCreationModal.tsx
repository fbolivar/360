"use client";

import { X } from "lucide-react";
import { AssetForm } from "./AssetForm";
import { AssetFormData } from "../schemas/assetSchema";
import { useAssetStore } from "../store/assetStore";
import { useState } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function AssetCreationModal({ isOpen, onClose }: Props) {
    const addAsset = useAssetStore((state) => state.addAsset);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (data: AssetFormData) => {
        setIsSubmitting(true);
        try {
            await addAsset(data);
            onClose();
        } catch (error) {
            console.error("Fallo al crear activo", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-card border border-border/50 shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="px-8 py-6 border-b border-border/50 flex justify-between items-center bg-muted/30">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">Registrar Nuevo Activo</h3>
                        <p className="text-xs text-muted-foreground mt-1 uppercase font-black tracking-widest">Inventario Institucional PNN</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <AssetForm
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        isLoading={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}
