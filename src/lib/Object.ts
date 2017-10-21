import {ComplexType, IObjectType, isType, IType,} from "../api/Type";
import {createInstance, getInstance, Instance} from "./Instance";
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
        this.properties = sanitizeProperties(opts.properties || {});
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

    getSnapshot(instance: Instance): S {
        const value = {};
        this.forAllProps((name, type) => {
            const node = instance.storedValue[<keyof T>name];
            (<any>value)[name] = isPrimitive(node) ? node : getInstance(node).snapshot;
        });
        return value as any as S;
    }

    applySnapshot(instance: Instance, snapshot: S) {
        transaction(() => {
            this.forAllProps((name, type) => {
                instance.storedValue[name] = (<any>snapshot)[name];
            });
        });
    }

    getValue(instance: Instance): T {
        return instance.storedValue;
    }

    private createEmptyInstance() {
        const object = observable.shallowObject({});
        return object as Object;
    }

    /**
     * We create the Node of the Instance. The Node is the final value the user will "see". Is is an object where each property is also a Node.
     * @param {Instance} instance
     * @param {S} snapshot
     */
    private buildInstance = (instance: Instance, snapshot: S) => {
        this.forAllProps((name, type) => {
            extendShallowObservable(instance.storedValue, {
                [name]: observable.ref(type.instantiate(snapshot ? (<any>snapshot)[name] : null).storedValue)
            });
        });
    };

    private forAllProps = (fn: (name: string, type: IType<any, any>) => void) => {
        this.propertiesNames.forEach(key => fn(key, this.properties[key]));
    };

    /**
     * Return all children Instance of an object Instance.
     * @return {Array<Instance>}
     */
    getChildren(instance: Instance): Array<Instance> {
        const children: Array<Instance> = [];
        this.forAllProps((name, type) => children.push(getInstance(instance.storedValue[name])));
        return children;
    }
}

/**
 * Return safe to use properties.
 * 1- Remove function, complex object, null/undefined, getter/setter
 * 2- As the user can define primitive type directly with value, we must convert primitive to Type.
 * @param {IObjectProperties<T>} properties
 * @return {{[K in keyof T]:IType<any, T>}}
 */
function sanitizeProperties<T>(properties: IObjectProperties<T>): { [K in keyof T]: IType<any, T> } {
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
        } else if (isPrimitive(value)) {
            // its a primitive, convert to its type
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