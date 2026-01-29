"use client";

import { useEffect, useState } from "react";
import { useUserRole } from "@/features/auth/hooks/useUserRole";
import { useRouter } from "next/navigation";
import { Settings, Save, ShieldAlert } from "lucide-react";
import { getSystemSettings, updateSystemSettings } from "@/features/settings/services/settingsService";
// import { useToast } from "@/shared/components/ui/use-toast"; // Assuming toast exists or use alert

export default function SettingsPage() {
    const { role, loading, isAdmin } = useUserRole();
    const router = useRouter();
    // const { toast } = useToast(); // If available

    const [formData, setFormData] = useState({
        companyName: "",
        nit: "",
        riskLow: 1.5,
        riskMedium: 3.5,
        riskHigh: 4.5
    });
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push("/");
        }
    }, [loading, isAdmin, router]);

    // Cargar configuración al iniciar
    useEffect(() => {
        if (isAdmin) {
            getSystemSettings().then(settings => {
                setFormData({
                    companyName: settings.companyName,
                    nit: settings.nit,
                    riskLow: settings.riskThresholds.low,
                    riskMedium: settings.riskThresholds.medium,
                    riskHigh: settings.riskThresholds.high
                });
                setIsLoadingData(false);
            });
        }
    }, [isAdmin]);

    if (loading || isLoadingData) return <div className="p-20 text-center animate-pulse">Cargando configuración...</div>;
    if (!isAdmin) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateSystemSettings({
                companyName: formData.companyName,
                nit: formData.nit,
                riskThresholds: {
                    low: formData.riskLow,
                    medium: formData.riskMedium,
                    high: formData.riskHigh
                }
            });
            alert("Configuración actualizada correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al guardar configuración");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-20">
            <div className="flex gap-4 items-center bg-card p-8 rounded-xl border border-primary/20 shadow-sm">
                <div className="bg-primary p-3 rounded-xl">
                    <Settings className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h2>
                    <p className="text-muted-foreground mt-1">
                        Ajustes globales de la organización y umbrales de riesgo.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Perfil de Empresa */}
                <section className="bg-card p-6 rounded-xl border">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        Perfil de Organización
                    </h3>
                    <form className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nombre de la Empresa</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded-md border bg-background mt-1"
                                placeholder="Ej: Mi Empresa SAS"
                                value={formData.companyName}
                                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">NIT / Identificación</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded-md border bg-background mt-1"
                                placeholder="Ej: 900.123.456-7"
                                value={formData.nit}
                                onChange={e => setFormData({ ...formData, nit: e.target.value })}
                            />
                        </div>
                    </form>
                </section>

                {/* Umbrales de Riesgo */}
                <section className="bg-card p-6 rounded-xl border">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-amber-500" /> Matriz de Riesgo
                    </h3>
                    <div className="space-y-8">
                        <p className="text-xs text-muted-foreground">
                            Ajuste los umbrales para la clasificación de riesgo.
                            Los cambios afectarán el cálculo de riesgos futuros.
                        </p>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-rose-500 flex justify-between items-center">
                                <span>Nivel Crítico</span>
                                <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-xs">Mayores a {formData.riskHigh}</span>
                            </label>
                            <input
                                type="range" min="3" max="5" step="0.1"
                                className="w-full accent-rose-500 cursor-pointer"
                                value={formData.riskHigh}
                                onChange={e => setFormData({ ...formData, riskHigh: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-orange-500 flex justify-between items-center">
                                <span>Nivel Alto</span>
                                <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs">Mayores a {formData.riskMedium}</span>
                            </label>
                            <input
                                type="range" min="2" max="4.5" step="0.1"
                                className="w-full accent-orange-500 cursor-pointer"
                                value={formData.riskMedium}
                                onChange={e => setFormData({ ...formData, riskMedium: parseFloat(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-emerald-500 flex justify-between items-center">
                                <span>Nivel Medio</span>
                                <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-xs">Mayores a {formData.riskLow}</span>
                            </label>
                            <input
                                type="range" min="0" max="3" step="0.1"
                                className="w-full accent-emerald-500 cursor-pointer"
                                value={formData.riskLow}
                                onChange={e => setFormData({ ...formData, riskLow: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                </section>
            </div>

            <div className="flex justify-end pt-4 border-t">
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-bold shadow-lg disabled:opacity-50"
                >
                    {isSaving ? (
                        <>Guardando...</>
                    ) : (
                        <><Save className="w-4 h-4" /> Guardar Configuración</>
                    )}
                </button>
            </div>
        </div>
    );
}
