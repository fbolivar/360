"use client";

import { ShieldCheck, TreePine, Lock, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder login - Simply redirect to main
        router.push("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-[120px]" />
                <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-500 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md space-y-8 glass p-10 rounded-2xl relative z-10 border border-border/50 shadow-2xl">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Acceso Institucional</h1>
                    <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1.5 text-sm uppercase font-semibold tracking-wider">
                        CyberRisk 360 <span className="text-primary">•</span> PNN <TreePine className="w-3.5 h-3.5" />
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Correo Electrónico</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                                type="email"
                                required
                                className="w-full bg-secondary/50 border border-border px-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                placeholder="usuario@pnn.gov.co"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Contraseña</label>
                            <a href="#" className="text-[10px] text-primary hover:underline font-bold uppercase">¿Olvidó su contraseña?</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <input
                                type="password"
                                required
                                className="w-full bg-secondary/50 border border-border px-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] mt-4"
                    >
                        Iniciar Sesión Segura
                    </button>
                </form>

                <p className="text-center text-[10px] text-muted-foreground uppercase font-medium tracking-widest pt-4 border-t border-border/10">
                    Uso restringido a personal autorizado
                </p>
            </div>
        </div>
    );
}
