import { ComplexType, IType, IValidationResult } from "../api/Type";
import { IObservableArray } from "mobx";
export declare class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    constructor(subtype: IType<S, T>);
    isValidSnapshot(value: any): IValidationResult;
}
