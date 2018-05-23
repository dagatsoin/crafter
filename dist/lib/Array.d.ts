import { ComplexType, IType } from "../api/type";
import { IArrayChange, IArraySplice, IObservableArray } from "mobx";
import { Instance, Node } from "./core/node";
import { TypeFlag } from "../api/typeFlags";
import { IJsonPatch } from "./core/jsonPatch";
export declare function arrayToString(this: IObservableArray<any> & Instance): string;
export declare class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    itemType: IType<any, T>;
    readonly flag: TypeFlag;
    constructor(name: string, itemType: IType<any, any>);
    describe(): string;
    getSnapshot(node: Node): S[];
    instantiate(parent: Node, subPath: string, initialValue?: any): Node;
    getDefaultSnapshot(): Array<T>;
    private createEmptyInstance;
    private buildInstance;
    isValidSnapshot(value: any): boolean;
    applySnapshot(node: Node, snapshot: any[]): void;
    getChildren(node: Node): Node[];
    getChildNode(node: Node, key: string): Node;
    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void;
    private willChange(change);
    didChange(this: {}, change: IArrayChange<any> | IArraySplice<any>): void;
    private reconcileArrayChildren<T>(parent, childType, currentNodes, newValues, newPaths);
    getChildType(key: string): IType<any, any>;
}
