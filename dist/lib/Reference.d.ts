import { Node } from "./core/Node";
import { IType, Type } from "../api/Type";
import { TypeFlag } from "../api/TypeFlags";
export declare class ReferenceType<T> extends Type<string | number, T> {
    private readonly targetType;
    readonly flag: TypeFlag;
    constructor(targetType: IType<any, T>);
    describe(): string;
    getValue(node: Node): any;
    getSnapshot(node: Node): any;
    instantiate(parent: Node | null, subPath: string, snapshot: any): Node;
    reconcile(current: Node, newValue: any): Node;
    isAssignableFrom(type: IType<any, any>): boolean;
    isValidSnapshot(value: any): boolean;
    getChildren(node: Node): Array<Node>;
}
