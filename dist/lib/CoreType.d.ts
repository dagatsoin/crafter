import { Type } from "../api/type";
import { Node } from "./core/node";
import { TypeFlag } from "../api/typeFlags";
/**
 * From MST implementation https://github.com/mobxjs/mobx-state-tree/blob/master/src/types/primitives.ts
 */
export declare class CoreType<S, T> extends Type<S, T> {
    readonly checker: (value: any) => boolean;
    readonly initializer: (v: any) => any;
    readonly flag: TypeFlag;
    constructor(name: any, typeFlag: TypeFlag, checker: any, initializer?: (v: any) => any);
    describe(): string;
    instantiate(parent: Node, subPath: string, initialValue?: any): Node;
    isValidSnapshot(value: any): boolean;
    getSnapshot(node: Node): S;
    applySnapshot(node: Node, snapshot: S): void;
    getDefaultSnapshot(): Array<T>;
    /**
     * Return an empty array of Instance because primitive can't have children.
     * @return {Array<Node>}
     */
    getChildren(node: Node): Array<Node>;
}
