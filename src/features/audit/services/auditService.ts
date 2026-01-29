"use server";

import prisma from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";

export interface AuditLogFilters {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    entityType?: string;
    action?: string;
}

export type AuditLogWithUser = Prisma.AuditLogGetPayload<{
    include: { user: { select: { fullName: true, email: true, role: true } } }
}>;

export async function getAuditLogs(filters: AuditLogFilters = {}) {
    const where: Prisma.AuditLogWhereInput = {};

    if (filters.startDate || filters.endDate) {
        where.createdAt = {};
        if (filters.startDate) where.createdAt.gte = filters.startDate;
        if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    if (filters.userId) {
        where.userId = filters.userId;
    }

    if (filters.entityType) {
        where.entityType = { contains: filters.entityType, mode: 'insensitive' };
    }

    if (filters.action) {
        where.action = { contains: filters.action, mode: 'insensitive' };
    }

    const logs = await prisma.auditLog.findMany({
        where,
        include: {
            user: {
                select: {
                    fullName: true,
                    email: true,
                    role: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 100 // Limit for performance, pagination can be added later
    });

    return logs;
}

export async function getAuditStats() {
    const totalLogs = await prisma.auditLog.count();
    const todayLogs = await prisma.auditLog.count({
        where: {
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });

    return { totalLogs, todayLogs };
}
