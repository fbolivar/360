"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Info, AlertTriangle, XCircle, Trash2 } from "lucide-react";
import { getUserNotifications, markNotificationAsRead, markAllAsRead, NotificationType } from "../services/notificationService";
import { useUserRole } from "@/features/auth/hooks/useUserRole"; // Assuming we can get user ID or just rely on session cookies? 
// Actually, `getUserNotifications` uses server-side session user if we pass userId? 
// Wait, `getUserNotifications` takes `userId`. Client doesn't easily have userId unless exposed.
// Let's check `useUserRole` or `authService`. If not available, we might need a wrapper action that gets current user id.

// ... Let's create a server action wrapper that gets the current user ID automatically.
// Refactoring logic plan: I'll modify the Component to call a new server action that infers UserID. 
// OR simpler: `getUserNotifications` could assume current user if userId param is omitted/handled inside?
// Let's assume for now I need to fetch it.

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { role } = useUserRole(); // We might need a way to get the actual User object/ID.

    // Polling logic
    const fetchNotifs = async () => {
        // TODO: Pass actual user ID. For now, since authService.getCurrentUserRole only returns role,
        // we heavily rely on server actions knowing the user. 
        // Let's modify `notificationService` to have a `getMyNotifications` that infers ID from session.
        // For this step, I will Assume `getMyNotifications` exists or I will create it in a moment.
        // I'll define the import as `getMyNotifications` and assume I'll add it to service next.
        try {
            // Temporary hack: we need the ID. 
            // If I can't get ID easily in client, I should make a Server Action `getMyNotifications`
            const data = await getMyNotifications();
            setNotifications(data);
            setUnreadCount(data.filter((n: any) => !n.read).length);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkRead = async (id: string) => {
        await markNotificationAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleMarkAllRead = async () => {
        await markAllMyNotificationsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }

    // Helper for icons
    const getIcon = (type: string) => {
        switch (type) {
            case "WARNING": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case "CRITICAL": return <XCircle className="w-4 h-4 text-rose-500" />;
            case "SUCCESS": return <Check className="w-4 h-4 text-emerald-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-secondary transition-colors"
                title="Notificaciones"
            >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-background animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border rounded-xl shadow-xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
                        <h3 className="font-semibold text-sm">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" /> Marcar leídas
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                No tienes notificaciones nuevas.
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 hover:bg-muted/50 transition-colors flex gap-3 ${!notif.read ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className={`text-sm ${!notif.read ? 'font-semibold' : 'font-medium'} leading-snug`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground pt-1">
                                                {new Date(notif.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notif.read && (
                                            <button
                                                onClick={() => handleMarkRead(notif.id)}
                                                className="self-start text-muted-foreground hover:text-primary transition-colors p-1"
                                                title="Marcar como leída"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-primary block" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Server Actions wrappers (Import these or define them here temporarily? Better to put in service)
import { getMyNotifications, markAllMyNotificationsRead } from "../services/notificationService";
