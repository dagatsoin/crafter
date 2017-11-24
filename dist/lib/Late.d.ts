import { Node } from "./core/Node";
import { IType, Type } from "../api/Type";
export declare class Late<S, T> extends Type<S, T> {
    readonly definition: () => IType<S, T>;
    private _subType;
    readonly flags: number;
    readonly subType: IType<S, T>;
    constructor(name: string, definition: () => IType<S, T>);
    instantiate(parent: Node | null, subPath: string, snapshot: T): Node;
    getSnapshot(node: Node): S;
    getChildren(node: Node): Node[];
    reconcile(current: Node, newValue: any): Node;
    describe(): string;
    isValidSnapshot(value: any): boolean;
    isAssignableFrom(type: IType<any, any>): boolean;
}
