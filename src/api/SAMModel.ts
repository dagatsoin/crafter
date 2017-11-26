export type Proposals = Array<{mutationType: string, data?: any}>

export interface SAMModel {
    present(proposals: Proposals): void;
}