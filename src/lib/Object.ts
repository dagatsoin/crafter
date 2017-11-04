import {ComplexType, IObjectType, IType, } from "../api/Type";
import {createNode, getNode, isInstance, Node} from "./Node";
import {extendShallowObservable, observable, transaction} from "mobx";
import {isPlainObject, isPrimitive, fail} from "./utils";
import {getPrimitiveFactoryFromValue} from "../api/Primitives";
import {optional} from "../api/Optional";
import {isType, TypeFlag} from "../api/TypeFlags";

export type IObjectProperties<T> = { [K in keyof T]: IType<any, T[K]> | T[K] };

export class ObjectType<S, T> extends ComplexType<S, T> implements IObjectType<S, T> {
    readonly flag = TypeFlag.Object;
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

    instantiate(parent: Node, subPath: string, initialValue?: any): Node {
        return createNode(
            this,
            parent,
            subPath,
            initialValue,
            this.createEmptyInstance,
            this.buildInstance
        );
    }

    getSnapshot(node: Node): S {
        const value = {};
        this.forAllProps((name, type) => {
            const instance = node.data[<keyof T>name];
            (<any>value)[name] = isPrimitive(instance) ? instance : getNode(instance).snapshot;
        });
        return value as any as S;
    }

    applySnapshot(node: Node, snapshot: S) {
        transaction(() => {
            this.forAllProps((name, type) => {
                node.data[name] = (<any>snapshot)[name];
            });
        });
    }

    getValue(node: Node): T {
        return node.data;
    }

    private createEmptyInstance() {
        const object = observable.shallowObject({});
        return object as Object;
    }

    /**
     * We create the Node of the Instance. The Node is the final value the user will "see". Is is an object where each property is also a Node.
     * @param {Node} node
     * @param {S} snapshot
     */
    private buildInstance = (node: Node, snapshot: S) => {
        this.forAllProps((name, type) => {
            const instance = type.instantiate(node, name, snapshot ? (<any>snapshot)[name] : undefined).data;
            extendShallowObservable(node.data, {
                [name]: observable.ref(instance)
            });
        });
    }

    private forAllProps = (fn: (name: string, type: IType<any, any>) => void) => {
        this.propertiesNames.forEach(key => fn(key, this.properties[key]));
    }

    /**
     * Return all children Instance of an object Instance.
     * @return {Array<Node>}
     */
    getChildren(node: Node): Array<Node> {
        const children: Array<Node> = [];
        this.forAllProps((name, type) => children.push(isInstance(node.data[name]) ?
            getNode(node.data[name]) // Complex Instance
            :
            node.leafs.get(name)!)); // Primitive Instance
        return children;
    }

    getChildType(key: string): IType<any, any> {
        return this.properties[key];
    }
}

/**
 * Return safe to use properties.
 * 1- Remove function, complex object, null/undefined, getter/setter
 * 2- As the user can define primitive type directly with value, we must convert primitive to Type.
 * @param {IObjectProperties<T>} properties
 * @return {object}
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
                [key]: optional(getPrimitiveFactoryFromValue(value), value)
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