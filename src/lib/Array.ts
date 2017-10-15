import {ComplexType, IType, IValidationResult} from "../api/Type";
import {IObservableArray} from "mobx";

export class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    constructor(subtype: IType<S, T>) {
        super(subtype.name);
    }

    isValidSnapshot(value: any): IValidationResult {
        throw new Error("Method not implemented.");
    }
}