export type VulnerabilityStatus = 'ABIERTA' | 'MITIGADA' | 'ACEPTADA';

export interface Vulnerability {
    id: string;
    cve?: string | null;
    description: string;
    severity: number | null;
    status: VulnerabilityStatus;
    detectedAt: string | Date;
    mitigationDeadline?: string | Date | null;
    mitigatedAt?: string | Date | null;
    assetId: string;
    asset?: {
        name: string;
        criticality: number;
    } | null;
}

export interface VulnerabilityStore {
    vulnerabilities: Vulnerability[];
    loading: boolean;
    error: string | null;
    fetchVulnerabilities: () => Promise<void>;
    updateStatus: (id: string, status: VulnerabilityStatus) => Promise<void>;
}
