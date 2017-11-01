import { IType, Type } from "../api/Type";
import { Node } from "./Node";
export declare class IdentifierType<T> extends Type<T, T> {
    readonly identifierType: IType<T, T>;
    constructor(identifierType: IType<T, T>);
    instantiate(parent: Node | null, subPath: string, snapshot: T): Node;
    reconcile(current: Node, newValue: any): Node;
    isValidSnapshot(value: any): boolean;
    getSnapshot(node: Node): T;
    getChildren(node: Node): Array<Node>;
}