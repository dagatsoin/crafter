export type Proposals = Array<{mutationType: string, data: any}>

export interface SAMModel {
    propose(proposals: Proposals): void;
}