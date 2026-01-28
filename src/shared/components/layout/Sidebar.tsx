"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ShieldCheck,
    LayoutDashboard,
    Database,
    AlertTriangle,
    FileText,
    Settings,
    ShieldAlert,
    TreePine,
    LogOut
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Database, label: "Activos", href: "/assets" },
    { icon: ShieldAlert, label: "Vulnerabilidades", href: "/vulnerabilities" },
    { icon: AlertTriangle, label: "Incidentes", href: "/incidents" },
    { icon: ShieldCheck, label: "Controles", href: "/controls" },
    { icon: FileText, label: "Reportes", href: "/reports" },
    { icon: ShieldCheck, label: "Auditoría", href: "/audit" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col pt-8">
            <div className="px-6 mb-10 flex items-center gap-2">
                <div className="bg-primary p-1.5 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-none tracking-tight">CyberRisk 360</h1>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase mt-1 flex items-center gap-1">
                        Misión Ambiental <TreePine className="w-2.5 h-2.5" />
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5",
                            pathname === item.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t mt-auto">
                <div className="flex items-center gap-3 px-3 py-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-secondary-foreground">
                        FB
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">Fernando Bolívar</p>
                        <p className="text-xs text-muted-foreground truncate">ADMIN_TIC</p>
                    </div>
                </div>
                <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
}
