import { IType } from "../api/Type";
export declare type Node = {
    readonly $instance?: Instance;
};
export declare class Instance {
    readonly type: IType<any, any>;
    readonly storedValue: any;
    parents: Map<string, Instance>;
    children: Map<string, Instance>;
    constructor(type: IType<any, any>, initialValue: any, initBaseType?: (baseTypeIdentity: any) => any, buildType?: (instance: Instance, snapshot: any) => void);
    applySnapshot(snapshot: any): void;
    readonly snapshot: any;
    isRoot(): void;
    readonly value: any;
    getChildren(): Instance[];
}
/**
 * Get the internal Instance object of a runtime Instance.
 * @param value
 * @return {Instance}
 */
export declare function getInstance(value: Node): Instance;
/**
 * Returns true if the given value is a node in a graph.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {value is ValueInstance}
 */
export declare function isNode(value: any): value is Node;
export declare function createInstance<S, T>(type: IType<S, T>, initialValue: any, createEmptyInstance?: (initialValue: any) => T, hydrateInstance?: (instance: Instance, snapshot: any) => void): Instance;
export declare function canAttachInstance(value: any): boolean;
export declare type Edge = {
    source: string;
    target: string;
};
