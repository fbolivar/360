"use client";

import { useEffect, useState } from "react";
import { Lightbulb, ArrowRight, X } from "lucide-react";
import { Recommendation, getRecommendations } from "../services/recommendationEngine";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";

export function InsightsWidget() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        getRecommendations().then(recs => {
            setRecommendations(recs);
            setLoading(false);
        });
    }, []);

    if (loading || !visible || recommendations.length === 0) return null;

    // Solo mostrar las top 3
    const displayRecs = recommendations.slice(0, 3);

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-900/10 p-6 rounded-xl border border-indigo-100 dark:border-indigo-900/50 mb-8 relative">
            <button
                onClick={() => setVisible(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-500/10 p-2 rounded-full">
                    <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-indigo-950 dark:text-indigo-100">Insights de Seguridad</h3>
                    <p className="text-sm text-indigo-600/80 dark:text-indigo-300">Recomendaciones automáticas para mejorar tu postura.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayRecs.map((rec) => (
                    <div key={rec.id} className="bg-white dark:bg-card p-4 rounded-lg shadow-sm border border-indigo-50 dark:border-indigo-900/20 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant={rec.priority === "HIGH" ? "destructive" : "warning"}>
                                {rec.priority}
                            </Badge>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                            {rec.description}
                        </p>
                        <Link
                            href={rec.actionUrl}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            {rec.actionLabel} <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
