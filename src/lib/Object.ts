import {ComplexType, IObjectType, isType, IType, } from "../api/Type";
import {createInstance, Instance} from "./Instance";
import {extendShallowObservable, observable, transaction} from "mobx";
import {isPlainObject, isPrimitive, fail} from "./utils";
import {getPrimitiveFactoryFromValue} from "../api/Primitives";

export type IObjectProperties<T> = { [K in keyof T]: IType<any, T[K]> | T[K] };

export class ObjectType<S, T> extends ComplexType<S, T> implements IObjectType<S, T> {
    private readonly propertiesNames: string[];
    private properties: { [K: string]: ComplexType<any, any> } = {};

    constructor(opts: {
        name?: string;
        properties?: object
    }) {
        super(opts.name || "AnonymousObject");
        this.properties = checkProperties(opts.properties || {});
        this.propertiesNames = Object.keys(this.properties);
    }

    isValidSnapshot(value: any): boolean {
        return !isPlainObject(value) ? false : this.propertiesNames.some(key => this.properties[key].validate(value[key]));
    }

    instantiate(snapshot: S): Instance {
        return createInstance(
            this,
            snapshot,
            this.createEmptyInstance,
            this.buildInstance
        );
    }

    serialize(instance: Instance): S {
        const value = {};
        this.forAllProps((name, type) => {
            (<any>value)[name] = instance.children.get(name)!.snapshot;
        });
        return value as any as S;
    }

    restore(instance: Instance, snapshot: S) {
        transaction(() => {
            this.forAllProps((name, type) => {
                instance.storedValue[name] = (<any>snapshot)[name];
            });
        });
    }

// todo this must be includes the child node $instance
    getValue(instance: Instance): T {
        return instance.storedValue;
        //return isNode(instance.storedValue) ? instance.storedValue : instance.storedValue.value;
        /*const value = {};
        this.forAllProps((name, type) => {
            const v = isNode(instance.storedValue[name]) ? instance.storedValue[name] : instance.storedValue[name].value;
            console.log(v);
            (<any>value)[name] = v;
        });
        return value as any as T;*/
    }

    private createEmptyInstance() {
        const object = observable.shallowObject({});
        return object as Object;
    }

    /**
     * We build the instance:
     * 1- create the Node of the Instance. The Node is the public readonly value which is actually used. Is is an object where each properties is also a Node.
     * 2- register all properties Node as child.
     * @param {Instance} instance
     * @param {S} snapshot
     */
    private buildInstance = (instance: Instance, snapshot: S) => {
        this.forAllProps((name, type) => {
            const childInstance = type.instantiate((<any>snapshot)[name]);
            extendShallowObservable(instance.storedValue, {
                [name]: observable.ref(childInstance.storedValue)
            });
            instance.children.set(name, childInstance);
        });
    }

    private forAllProps = (fn: (name: string, type: IType<any, any>) => void) => {
        this.propertiesNames.forEach(key => fn(key, this.properties[key]));
    }
}

function checkProperties<T>(properties: IObjectProperties<T>): { [K in keyof T]: IType<any, T> } {
    // loop through properties and ensures that all items are types
    return Object.keys(properties).reduce((properties, key) => {
        // the user intended to use a view
        const descriptor = Object.getOwnPropertyDescriptor(properties, key);
        if ("get" in descriptor) {
            fail("Getters are not supported as properties. Please use views instead");
        }
        // undefined and null are not valid
        const {value} = descriptor;
        if (value === null || undefined) {
            fail(
                "The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?"
            );
            // its a primitive, convert to its type
        } else if (isPrimitive(value)) {
            return Object.assign({}, properties, {
                [key]: getPrimitiveFactoryFromValue(value) // todo set optional
            });
        } else if (isType(value)) {
            // its already a type
            return properties;
        } else if (typeof value === "object") {
            // no other complex values
            fail(`In property '${key}': base model's should not contain complex values: '${value}'`);
        } else {
            fail(`Unexpected value for property '${key}'`);
        }
    }, properties as any);
}