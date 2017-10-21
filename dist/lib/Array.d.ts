import { ComplexType, IType } from "../api/Type";
import { IObservableArray } from "mobx";
import { Instance } from "./Instance";
export declare class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    itemType: IType<any, T>;
    constructor(name: string, itemType: IType<any, any>);
    serialize(instance: Instance): S[];
    instantiate(snapshot: S): Instance;
    createNewInstance: (snapshot: S[]) => IObservableArray<{}>;
    isValidSnapshot(value: any): boolean;
    restore(instance: Instance, snapshot: any[]): void;
}
