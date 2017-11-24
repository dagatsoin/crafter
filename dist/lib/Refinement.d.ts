import { IType, Type } from "../api/Type";
import { Node } from "./core/Node";
export declare class Refinement<S, T> extends Type<S, T> {
    readonly type: IType<any, any>;
    readonly predicate: (v: any) => boolean;
    readonly message: (v: any) => string;
    constructor(name: string, type: IType<any, any>, predicate: (v: any) => boolean, message: (v: any) => string);
    getSnapshot(node: Node): any;
    readonly flag: number;
    getChildren(node: Node): Node[];
    describe(): string;
    instantiate(parent: Node, subPath: string, value: any): Node;
    isAssignableFrom(type: IType<any, any>): boolean;
    isValidSnapshot(value: any): boolean;
}
