import { ComplexType, IType } from "../api/Type";
import { IObservableArray } from "mobx";
import { Node } from "./core/Node";
import { TypeFlag } from "../api/typeFlags";
export declare class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    itemType: IType<any, T>;
    readonly flag: TypeFlag;
    constructor(name: string, itemType: IType<any, any>);
    getSnapshot(node: Node): S[];
    instantiate(parent: Node, subPath: string, initialValue?: any): Node;
    getDefaultSnapshot(): Array<T>;
    private createEmptyInstance;
    private buildInstance;
    isValidSnapshot(value: any): boolean;
    applySnapshot(node: Node, snapshot: any[]): void;
    getChildren(node: Node): Node[];
    getChildNode(node: Node, key: string): Node;
    private willChange(change);
    private reconcileArrayChildren<T>(parent, childType, currentNodes, newValues, newPaths);
    getChildType(key: string): IType<any, any>;
}
