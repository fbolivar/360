"use client";

import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";
import { getCurrentUserRole } from "../services/authService";

export function useUserRole() {
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRole() {
            try {
                // Como getCurrentUserRole es una Server Action (use server), podemos llamarla desde aquí
                const userRole = await getCurrentUserRole();
                setRole(userRole);
            } catch (error) {
                console.error("Error fetching user role:", error);
                setRole(null);
            } finally {
                setLoading(false);
            }
        }

        loadRole();
    }, []);

    const isAdmin = role === 'ADMIN_TIC';
    const isAuditor = role === 'AUDITOR_INTERNO';
    const isManager = role === 'RESPONSABLE_RIESGO' || role === 'DIRECTIVO';

    return {
        role,
        loading,
        isAdmin,
        isAuditor,
        isManager,
        // Helper para verificar permisos específicos
        canEditConfig: isAdmin,
        canAudit: isAuditor || isAdmin,
        canManageRisks: isManager || isAdmin,
    };
}
