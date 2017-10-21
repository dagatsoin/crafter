import {ComplexType, IType} from "../api/Type";
import {IObservableArray, observable} from "mobx";
import {Node} from "../../dist/lib/Instance";
import {createInstance, Instance} from "./Instance";

export class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    itemType: IType<any, T>;

    constructor(name: string, itemType: IType<any, any>) {
        super(name)
        this.itemType = itemType;
    }

    serialize(instance: Instance): S[] {
        return instance.storedValue.map((item: Node) => item.snapshot);
    }

    instantiate(snapshot: S): Instance {
        return createInstance(
            this,
            snapshot,
            this.createNewInstance
        );
    }

    createNewInstance = (snapshot: S[]) => {
        const array = observable.array();
        snapshot.forEach((item: S) => array.push(item));
        return array;
    }

    isValidSnapshot(value: any): boolean {
        return value.constructor.name !== "array" ? false : value.some((item: any, index: any) => this.itemType.validate(item));
    }

    restore(instance: Instance, snapshot: any[]): void {
        const target = instance.storedValue as IObservableArray<any>;
        target.replace(snapshot);
    }

}