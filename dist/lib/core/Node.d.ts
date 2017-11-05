import { IType } from "../../api/Type";
import { IdentifierCache } from "./IdentifierCache";
import { IReversibleJsonPatch } from "./jsonPatch";
export declare type Instance = {
    readonly $node?: Node;
};
export declare class Node {
    readonly type: IType<any, any>;
    readonly data: any;
    parent: Node | null;
    identifierAttribute: string | undefined;
    identifierCache: IdentifierCache | undefined;
    subPath: string;
    isAlive: boolean;
    private isDetaching;
    private autoUnbox;
    private readonly patchSubscribers;
    constructor(type: IType<any, any>, parent: Node | null, subPath: string, initialValue: any, initBaseType?: (baseTypeIdentity: any) => any, buildType?: (node: Node, snapshot: any) => void);
    applySnapshot(snapshot: any): void;
    readonly snapshot: any;
    readonly isRoot: boolean;
    readonly root: Node;
    readonly value: any;
    getChildNode(subPath: string): Node;
    readonly children: Array<Node>;
    readonly identifier: string | null;
    emitPatch(basePatch: IReversibleJsonPatch, source: Node): void;
    unbox: (childNode: Node) => any;
    readonly path: string;
    removeChild(subPath: string): void;
    detach(): void;
    assertAlive(): void;
    beforeDestroy(): void;
    remove(): void;
    destroy(): void;
    setParent(newParent: Node | null, subPath?: string | null): void;
    getChildType(key: string): IType<any, any>;
}
/**
 * Get the internal Instance object of a runtime Instance.
 * @param value
 * @return {Node}
 */
export declare function getNode(value: Instance): Node;
/**
 * Returns true if the given value is a instance in a tree.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export declare function isInstance(value: any): value is Instance;
export declare function createNode<S, T>(type: IType<S, T>, parent: Node | null, subPath: string, initialValue: any, createEmptyInstance?: (initialValue: any) => T, hydrateInstance?: (node: Node, snapshot: any) => void): Node;
export declare function canAttachNode(value: any): boolean;
/**
 * Convert a value to a node at given parent and subpath. attempts to reuse old node if possible and given
 * @param {IType<any, any>} childType
 * @param {Node} parent
 * @param {string} subpath
 * @param newValue
 * @param {Node} oldNode
 * @return {any}
 */
export declare function valueAsNode(childType: IType<any, any>, parent: Node, subpath: string, newValue: any, oldNode?: Node): Node;
/**
 * Return true if if the value is the Instance or a snapshot of the Node.
 * @param {Instance} node
 * @param value
 * @return {boolean}
 */
export declare function areSame(node: Node, value: any): boolean;
