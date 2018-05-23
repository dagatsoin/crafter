import { IType, Type } from "../api/type";
import { Node } from "./core/node";
import { TypeFlag } from "../api/typeFlags";
export declare type IFunctionReturn<T> = () => T;
export declare type IOptionalValue<S, T> = S | T | IFunctionReturn<S> | IFunctionReturn<T>;
export declare class OptionalValue<S, T> extends Type<S, T> {
    readonly type: IType<S, T>;
    readonly defaultValue: IOptionalValue<S, T>;
    readonly flag: TypeFlag;
    constructor(type: IType<S, T>, defaultValue: IOptionalValue<S, T>);
    describe(): string;
    instantiate(parent: Node, subPath: string, value: S): Node;
    reconcile(current: Node, newValue: any): Node;
    private getDefaultValue();
    isValidSnapshot(value: any): boolean;
    getSnapshot(node: Node): S;
    getChildren(node: Node): Node[];
}
