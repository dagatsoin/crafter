import { ComplexType, IObjectType, IType, Type, } from "../api/Type";
import { createNode, getNode, isInstance, Node, Mutation } from "./core/Node";
import { extendShallowObservable, extras, intercept, IObjectChange, IObjectWillChange, IObservableObject, observable, observe, transaction } from "mobx";
import { isPlainObject, isPrimitive, fail, assertType, escapeJsonPath, EMPTY_OBJECT } from "./utils";
import { getPrimitiveFactoryFromValue } from "../api/Primitives";
import { optional } from "../api/Optional";
import { isType, TypeFlag } from "../api/TypeFlags";
import { IJsonPatch } from "./core/jsonPatch";
import { Instance } from "../../dist/lib/core/Node";

export type IObjectProperties<T> = {[K in keyof T]: IType<any, T[K]> | T[K]};

export class ObjectType<S, T> extends ComplexType<S, T> implements IObjectType<S, T> {
    readonly flag = TypeFlag.Object;
    readonly mutations: Array<string> = [];

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

    describe(): string {
        // optimization: cache
        return "{ " +
            this.propertiesNames
                .map(key => key + ": " + this.properties[key].describe())
                .join("; ") +
            " }";
    }

    isValidSnapshot(value: any): boolean {
        return !isPlainObject(value) ?
            false :
            this.propertiesNames.length ?
                this.propertiesNames.every(key => this.properties[key].validate(value[key]))
                :
                !Object.keys(value).length;
    }

    instantiate(parent: Node, subPath: string, initialValue?: any): Node {
        return createNode(
            this,
            parent,
            subPath,
            initialValue,
            this.createEmptyInstance,
            this.buildInstance,
        );
    }

    getSnapshot(node: Node): any {
        const res = {} as any;
        this.forAllProps((name, type) => {
            // TODO: FIXME, make sure the observable ref is used!
            (extras.getAtom(node.data, name) as any).reportObserved();
            res[name] = this.getChildNode(node, name).snapshot;
        });
        if (typeof node.data.postProcessSnapshot === "function")
            return node.data.postProcessSnapshot.call(null, res);
        return res;
    }

    applyPatchLocally(node: Node, subPath: string, patch: IJsonPatch): void {
        if (!(patch.op === "replace" || patch.op === "add"))
            fail(`object does not support operation ${patch.op}`)
        node.data[subPath] = patch.value;
    }

    applySnapshot(node: Node, snapshot: S) {
        transaction(() => {
            this.forAllProps((name, type) => {
                node.data[name] = (<any>snapshot)[name];
            });
        });
    }

    private createEmptyInstance() {
        const instance = observable.shallowObject(EMPTY_OBJECT);
        return instance as Object;
    }

    getDefaultSnapshot(): any {
        return {};
    }

    /**
     * We create the Node of the Instance. The Node is the final value the user will "see". Is is an object where each property is also a Node.
     * @param {Node} node
     * @param {S} snapshot
     */
    private buildInstance = (node: Node, snapshot: S) => {
        this.forAllProps((name, type) => {
            extendShallowObservable(node.data, {
                [name]: observable.ref(type.instantiate(node, name, (<any>snapshot)[name]))
            });
            extras.interceptReads(node.data, name, node.unbox);
        });
        intercept(node.data as IObservableObject, change => this.willChange(change));
        observe(node.data, this.didChange);
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getNode(change.object);
        const type = this.properties[change.name];
        assertType(change.newValue, type);
        change.newValue = type.reconcile(node.getChildNode(change.name), change.newValue);
        return change;
    }

    didChange(change: IObjectChange) {
        const node = getNode(change.object);
        node.emitPatch(
            {
                op: "replace",
                path: escapeJsonPath(change.name),
                value: change.newValue.snapshot,
                oldValue: change.oldValue ? change.oldValue.snapshot : undefined
            },
            node
        );
    }

    getChildNode(node: Node, key: string): Node {
        if (!(key in this.properties)) return fail("Not a value property: " + key);
        const childNode = node.data.$mobx.values[key].value;
        if (!childNode) return fail("Node not available for property " + key);
        return childNode;
    }

    private forAllProps = (fn: (name: string, type: IType<any, any>) => void) => {
        this.propertiesNames.forEach(key => fn(key, this.properties[key]));
    }

    /**
     * Return all children Instance of an object Instance.
     * @return {Array<Node>}
     */
    getChildren(node: Node): Node[] {
        const res: Node[] = [];
        this.forAllProps((name, type) => {
            res.push(this.getChildNode(node, name));
        });
        return res;
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
function sanitizeProperties<T>(properties: IObjectProperties<T>): {[K in keyof T]: IType<any, T> } {
    // loop through properties and ensures that all items are types
    return Object.keys(properties).reduce((properties, key) => {
        // the user intended to use a view
        const descriptor = Object.getOwnPropertyDescriptor(properties, key)!;
        if ("get" in descriptor) {
            fail("Getters are not supported as properties. Please use views instead");
        }
        // undefined and null are not valid
        const { value } = descriptor;
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