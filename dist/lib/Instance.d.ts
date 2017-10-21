import { IType } from "../api/Type";
export declare class Node {
    readonly type: IType<any, any>;
    readonly storedValue: any;
    private edges;
    constructor(type: IType<any, any>, initialValue: any, initBaseType?: (baseTypeIdentity: any) => any, buildType?: (instance: Node, snapshot: any) => void);
    restore(snapshot: any): void;
    readonly snapshot: any;
    isRoot(): void;
    readonly value: any;
}
export declare function createNode<S, T>(type: IType<S, T>, initialValue: any, createEmptyInstance?: (initialValue: any) => T, hydrateInstance?: (instance: Node, snapshot: any) => void): Node;
export declare function canAttachNode(value: any): boolean;
export declare type Edge = {
    source: string;
    target: string;
};
