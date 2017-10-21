import {computed, isObservable} from "mobx";
import {IType} from "../api/Type";
import {fail, identity, isPrimitive} from "./utils";

export type Node = {
    readonly $instance?: Instance
};

export class Instance {
    readonly type: IType<any, any>;
    readonly storedValue: any;
    public parents: Map<string, Instance> = new Map();
    public children: Map<string, Instance> = new Map();

    constructor(type: IType<any, any>,
                initialValue: any,
                initBaseType: (baseTypeIdentity: any) => any = identity,
                buildType: (instance: Instance, snapshot: any) => void = () => {
                }) {

        this.type = type;

        /* 1 - Init an empty instance of the type. If the type is an primitive type it will get its value.
         * If it it an object return {}, if it is an array it return  [], etc...
         * We also test if the node ref could be attached to the type. // todo put this as a static prop of the type */
        this.storedValue = initBaseType(initialValue);
        const canAttachInstanceRef = canAttachInstance(this.storedValue);

        /* 2 - Build and hydrate phase only needed for complex type instance */
        if (!isPrimitive(this.storedValue)) buildType(this, initialValue);

        /* 3 - Add a reference to this node to the storedValue. This will allow to recognize this value as a Instance
         and use functions like restore, snapshot, type check, etc.*/
        if (canAttachInstanceRef) {
            Object.defineProperty(this.storedValue, "$instance", {
                enumerable: false,
                writable: false,
                configurable: true,
                value: this,
            });
        }
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
        console.log(isObservable(this.type.getValue(this)))
        return this.type.getValue(this);
    }
}

/**
 * Get the internal Instance object of a runtime Instance.
 * @param value
 * @return {Instance}
 */
export function getInstance(value: Node): Instance {
    if (isNode(value)) return value.$instance!;
    else throw new Error(`Value ${value} is not a graph Node`);
}

/**
 * Returns true if the given value is a node in a graph.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {value is ValueInstance}
 */
export function isNode(value: any): value is Node {
    return !!(value && value.$instance);
}

export function createInstance<S, T>(type: IType<S, T>,
                                     initialValue: any,
                                     createEmptyInstance: (initialValue: any) => T = identity,
                                     hydrateInstance: (instance: Instance, snapshot: any) => void = () => {
                                     }) {
    if (isNode(initialValue)) fail(`Passed value is already an a node: ${initialValue}`);
    return new Instance(type, initialValue, createEmptyInstance, hydrateInstance);
}

export function canAttachInstance(value: any) {
    return (
        value &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !(value.storedValue && isNode(value.storedValue)) &&
        !isNode(value) &&
        !Object.isFrozen(value)
    );
}

export type Edge = {
    source: string,
    target: string,
};