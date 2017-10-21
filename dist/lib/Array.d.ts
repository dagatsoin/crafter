import { ComplexType, IType } from "../api/Type";
import { IObservableArray } from "mobx";
import { Instance } from "./Instance";
export declare class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    itemType: IType<any, T>;
    constructor(name: string, itemType: IType<any, any>);
    getSnapshot(instance: Instance): S[];
    instantiate(snapshot: S): Instance;
    private createEmptyInstance;
    private buildInstance;
    isValidSnapshot(value: any): boolean;
    applySnapshot(instance: Instance, snapshot: any[]): void;
    getChildren(instance: Instance): Instance[];
}
