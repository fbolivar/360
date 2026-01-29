export type ControlMaturity = 'INEXISTENTE' | 'INICIAL' | 'REPETIBLE' | 'DEFINIDO' | 'GESTIONADO' | 'OPTIMIZADO';

export interface Control {
    id: string;
    code: string;
    name: string;
    description: string | null;
    framework: string;
    category?: string | null;
}

export interface AssetControl {
    id: string;
    assetId: string;
    controlId: string;
    maturity: ControlMaturity;
    effectiveness: number;
    evaluatedAt: Date | string;
    nextEvaluationAt: Date | string | null;
    evidence: string | null;
    comments: string | null;
    control?: Control;
    asset?: {
        id: string;
        name: string;
        riskLevel?: string;
        residualRisk?: number;
    };
}

export interface ControlStore {
    evaluations: AssetControl[];
    controls: Control[];
    loading: boolean;
    error: string | null;
    fetchData: (framework?: string) => Promise<void>;
    updateEvaluation: (id: string, maturity: ControlMaturity, effectiveness: number, evidence?: string, comments?: string) => Promise<void>;
    createEvaluation: (assetId: string, controlId: string) => Promise<void>;
}
