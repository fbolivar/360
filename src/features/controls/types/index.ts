export type ControlMaturity = 'INEXISTENTE' | 'INICIAL' | 'REPETIBLE' | 'DEFINIDO' | 'GESTIONADO' | 'OPTIMIZADO';

export interface Control {
    id: string;
    code: string;
    name: string;
    description: string | null;
    framework: string;
}

export interface AssetControl {
    id: string;
    assetId: string;
    controlId: string;
    maturity: ControlMaturity;
    effectiveness: number;
    evaluatedAt: Date | string;
    nextEvaluationAt: Date | string | null;
    control?: Control;
    asset?: {
        name: string;
    };
}

export interface ControlStore {
    evaluations: AssetControl[];
    controls: Control[];
    loading: boolean;
    error: string | null;
    fetchData: () => Promise<void>;
    updateEvaluation: (id: string, maturity: ControlMaturity, effectiveness: number) => Promise<void>;
}
