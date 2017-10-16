import {ComplexType, IType, IValidationResult} from "../api/Type";
import {IObservableArray} from "mobx";
import {Instance} from "../../dist/lib/Instance";

export class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    isValidSnapshot(value: any): boolean {
        return undefined;
    }

    serialize(instance: Instance): S[] {
        return undefined;
    }

    instantiate(initialValue: any): Instance {
        return undefined;
    }
    constructor(subtype: IType<S, T>) {
        super(subtype.name);
    }

    isValidSnapshot(value: any): IValidationResult {
        throw new Error("Method not implemented.");
    }
}