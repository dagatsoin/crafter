import {computed, observable} from "mobx";
import {IType} from "../api/Type";
import {fail, identity, isInstance} from "../api/utils";

export class Instance {
    readonly type: IType<any, any>;
    readonly storedValue: any;

    constructor(type: IType<any, any>,
                initialValue: any,
                createNewInstance: (initialValue: any) => any = identity) {
        this.type = type;
        this.storedValue = createNewInstance(initialValue);

        /* Add the instance of this node to the storedValue. This will allow to recognize this value as a Instance
         and use functions like restore, snapshot, type check, etc.*/

        if (this.storedValue &&
            typeof this.storedValue === "object" &&
            !(this.storedValue instanceof Date) &&
            !isInstance(this.storedValue) &&
            !Object.isFrozen(this.storedValue)) Object.defineProperty(this.storedValue, "$instance", {
            enumerable: false,
            writable: false,
            configurable: true,
            value: this,
        });
    }

    restore(snapshot: any) {
        if (snapshot !== this.snapshot) this.type.restore(this, snapshot);
    }

    @computed
    get snapshot(): any {
        return this.type.serialize(this);
    }

    isRoot() {

    }

    @computed
    get value(): any {
        return this.type.getValue(this);
    }
}

export function createInstance<S, T>(type: IType<S, T>,
                                     initialValue: any,
                                     createNewInstance: (initialValue: any) => T = identity) {
    if (isInstance(initialValue)) fail(`Passed value is already an Instance: ${initialValue}`);
    return new Instance(type, initialValue, createNewInstance);
}