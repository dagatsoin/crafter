import { ComplexType, IType } from "../api/Type";
import { IObservableArray } from "mobx";
import { Instance } from "../../dist/lib/Instance";
export declare class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    serialize(instance: Instance): S[];
    instantiate(initialValue: any): Instance;
    constructor(subtype: IType<S, T>);
}
