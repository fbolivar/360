"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import prisma from "@/shared/lib/prisma";
import { UserRole } from "@prisma/client";

export async function getCurrentUserRole(): Promise<UserRole | null> {

    // BYPASS LOCAL: Si no hay configuración de Supabase, retornamos ADMIN
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("⚠️ MODO LOCAL DETECTADO: Usando rol de Administrador por defecto.");
        return "ADMIN_TIC";
    }

    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet: any) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }: any) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Ignore update from Server Component
                        }
                    },
                },
            }
        );

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user || !user.email) {
            return null;
        }

        // Buscar usuario en nuestra tabla local por email
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email }
        });

        if (!dbUser) {
            return null;
        }

        return dbUser.role;
    } catch (error) {
        console.error("Error en authService:", error);
        // Fallback seguro en caso de error
        return null;
    }
}
