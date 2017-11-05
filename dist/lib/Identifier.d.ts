import { IType, Type } from "../api/Type";
import { Node } from "./core/Node";
import { TypeFlag } from "../api/typeFlags";
export declare class IdentifierType<T> extends Type<T, T> {
    readonly identifierType: IType<T, T>;
    readonly flag: TypeFlag;
    constructor(identifierType: IType<T, T>);
    describe(): string;
    instantiate(parent: Node | null, subPath: string, snapshot: T): Node;
    reconcile(current: Node, newValue: any): Node;
    isValidSnapshot(value: any): boolean;
    getSnapshot(node: Node): T;
    getChildren(node: Node): Array<Node>;
}
