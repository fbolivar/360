export type IncidentSeverity = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface Incident {
    id: string;
    title: string;
    description: string | null;
    severity: IncidentSeverity;
    status: string;
    rootCause: string | null;
    detectedAt: Date | string;
    assetId: string | null;
    asset?: {
        name: string;
        criticality: number;
        location: string | null;
    } | null;
}

export interface CreateIncidentData {
    title: string;
    description?: string;
    severity: IncidentSeverity;
    assetId: string;
}

export interface IncidentStore {
    incidents: Incident[];
    loading: boolean;
    error: string | null;
    fetchIncidents: () => Promise<void>;
    resolveIncident: (id: string, rootCause: string) => Promise<void>;
    createIncident: (data: CreateIncidentData) => Promise<void>;
}
