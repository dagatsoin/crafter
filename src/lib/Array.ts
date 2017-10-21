import {ComplexType, IType} from "../api/Type";
import {IObservableArray, observable} from "mobx";
import {Node} from "./Instance";
import {createInstance, Instance} from "./Instance";

export class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    itemType: IType<any, T>;

    constructor(name: string, itemType: IType<any, any>) {
        super(name)
        this.itemType = itemType;
    }

    getSnapshot(instance: Instance): S[] {
        return instance.storedValue.map((item: Node) => item.$instance!.snapshot);
    }

    instantiate(snapshot: S): Instance {
        return createInstance(
            this,
            snapshot,
            this.createEmptyInstance,
            this.buildInstance
        );
    }

    private createEmptyInstance = (snapshot: S[]) => {
        return observable.array();
    }

    private buildInstance = (instance: Instance, snapshot: S[]) => {
        if (snapshot && snapshot.length) snapshot.forEach((item: S, index: number) => {
            const subInstance = this.itemType.instantiate(item);
            instance.storedValue.push(subInstance.storedValue);
        });
    }

    isValidSnapshot(value: any): boolean {
        return value.constructor.name !== "array" ? false : value.some((item: any, index: any) => this.itemType.validate(item));
    }

    applySnapshot(instance: Instance, snapshot: any[]): void {
        const target = instance.storedValue as IObservableArray<any>;
        target.replace(snapshot);
    }

    getChildren(instance: Instance): Instance[] {
        return instance.storedValue.map((item: Node) => item.$instance);
    }
}