"use server";

import prisma from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export type NotificationType = "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";

export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = "INFO"
) {
    try {
        await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type
            }
        });
        // En un sistema real con WebSockets, aquí emitiríamos el evento.
        // Por ahora, confiamos en el polling del cliente o revalidación.
        revalidatePath("/");
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}

export async function getUserNotifications(userId: string) {
    if (!userId) return [];

    return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20 // Últimas 20
    });
}

export async function markNotificationAsRead(notificationId: string) {
    try {
        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true }
        });
        revalidatePath("/");
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
}

export async function markAllAsRead(userId: string) {
    try {
        await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true }
        });
        revalidatePath("/");
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
    }
}

// Helpers que infieren el usuario actual (Manejo de Sesión)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getCurrentUserId(): Promise<string | null> {
    // Modo Local Bypass
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // En modo local, buscamos el primer usuario admin o retornamos un ID fijo de prueba si existe en seed
        // Para consistencia con authService, buscamos por email de user mock si es necesario
        // O simplificamos: buscamos el primer usuario en DB
        const firstUser = await prisma.user.findFirst();
        return firstUser?.id || null;
    }

    // Modo Supabase real
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: { getAll: () => cookieStore.getAll(), setAll: () => { } }
            }
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) return null;

        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        return dbUser?.id || null;
    } catch {
        return null;
    }
}

export async function getMyNotifications() {
    const userId = await getCurrentUserId();
    if (!userId) return [];
    return getUserNotifications(userId);
}

export async function markAllMyNotificationsRead() {
    const userId = await getCurrentUserId();
    if (userId) {
        await markAllAsRead(userId);
    }
}
