import {extras, IMapChange, IMapWillChange, intercept, observable, ObservableMap, observe} from "mobx";
import {addHiddenFinalProp, assertType, escapeJsonPath, isMutable, isPlainObject} from "./utils";
import {ComplexType, IComplexType, IType} from "../api/type";
import {TypeFlag} from "../api/typeFlags";
import {Node, getNode, Instance, isInstance, createNode} from "./core/node";
import {IJsonPatch} from "./core/jsonPatch";

interface IMapFactoryConfig {
    isMapFactory: true;
}

export interface IExtendedObservableMap<T> extends ObservableMap<T> {
    put(value: T | any): this; // downtype to any, again, because we cannot type the snapshot, see
}

export function mapToString(this: ObservableMap<any>) {
    return `${getNode(this as Instance)}(${this.size} items)`;
}

function put(this: ObservableMap<any>, value: any) {
    if (!value) fail(`Map.put cannot be used to set empty values`);
    let node: Node;
    if (isInstance(value)) {
        node = getNode(value);
    } else if (isMutable(value)) {
        const targetType = (getNode(this as Instance).type as MapType<any, any>).subType;
        node = getNode(targetType.create(value));
    } else {
        return fail(`Map.put can only be used to store complex values`);
    }
    if (!node.identifierAttribute)
        fail(
            `Map.put can only be used to store complex values that have an identifier type attribute`
        );
    this.set(node.identifier!, node.value);
    return this;
}

export class MapType<S, T> extends ComplexType<{ [key: string]: S }, IExtendedObservableMap<T>> {
    shouldAttachNode = true;
    subType: IType<any, any>;
    readonly flags = TypeFlag.Map;

    constructor(name: string, subType: IType<any, any>) {
        super(name);
        this.subType = subType;
    }

    instantiate(parent: Node | any, subPath: string, initialValue?: any): Node {
        return createNode(
            this,
            parent,
            subPath,
            initialValue,
            this.createNewInstance,
            this.finalizeNewInstance
        );
    }

    describe() {
        return "Map<string, " + this.subType.describe() + ">";
    }

    createNewInstance = () => {
        // const identifierAttr = getIdentifierAttribute(this.subType)
        const map = observable.shallowMap();
        addHiddenFinalProp(map, "put", put);
        addHiddenFinalProp(map, "toString", mapToString);
        return map;
    }

    finalizeNewInstance = (node: Node, snapshot: any) => {
        const instance = node.data as ObservableMap<any>;
        extras.interceptReads(instance, node.unbox);
        intercept(instance, c => this.willChange(c));
        node.applySnapshot(snapshot);
        observe(instance, this.didChange);
    }

    getChildren(node: Node): Node[] {
        return (node.data as ObservableMap<any>).values();
    }

    getChildNode(node: Node, key: string): Node {
        const childNode = node.data.get(key);
        if (!childNode) fail("Not a child " + key);
        return childNode;
    }

    willChange(change: IMapWillChange<any>): IMapWillChange<any> | null {
        const node = getNode(change.object as Instance);

        switch (change.type) {
            case "update":
                {
                    const { newValue } = change;
                    const oldValue = change.object.get(change.name);
                    if (newValue === oldValue) return null;
                    assertType(newValue, this.subType);
                    change.newValue = this.subType.reconcile(
                        node.getChildNode(change.name),
                        change.newValue
                    );
                    this.verifyIdentifier(change.name, change.newValue as Node);
                }
                break;
            case "add":
                {
                    assertType(change.newValue, this.subType);
                    change.newValue = this.subType.instantiate(
                        node,
                        change.name,
                        change.newValue
                    );
                    this.verifyIdentifier(change.name, change.newValue as Node);
                }
                break;
        }
        return change;
    }

    private verifyIdentifier(expected: string, node: Node) {
        const identifier = node.identifier;
        if (identifier !== null && "" + identifier !== "" + expected)
            fail(
                `A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '${identifier}', but expected: '${expected}'`
            );
    }

    getValue(node: Node): any {
        return node.data;
    }

    getSnapshot(node: Node): { [key: string]: any } {
        const res: { [key: string]: any } = {};
        node.children.forEach(childNode => {
            res[childNode.subPath] = childNode.snapshot;
        });
        return res;
    }

    didChange(change: IMapChange<any>): void {
        const node = getNode(change.object as Instance);
        switch (change.type) {
            case "update":
                return void node.emitPatch(
                    {
                        op: "replace",
                        path: escapeJsonPath(change.name),
                        value: change.newValue.snapshot,
                        oldValue: change.oldValue ? change.oldValue.snapshot : undefined
                    },
                    node
                );
            case "add":
                return void node.emitPatch(
                    {
                        op: "add",
                        path: escapeJsonPath(change.name),
                        value: change.newValue.snapshot,
                        oldValue: undefined
                    },
                    node
                );
            case "delete":
                // a node got deleted, get the old snapshot and make the node die
                const oldSnapshot = change.oldValue.snapshot;
                change.oldValue.die();
                // emit the patch
                return void node.emitPatch(
                    {
                        op: "remove",
                        path: escapeJsonPath(change.name),
                        oldValue: oldSnapshot
                    },
                    node
                );
        }
    }

    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void {
        const target = node.data as ObservableMap<any>;
        switch (patch.op) {
            case "add":
            case "replace":
                target.set(subpath, patch.value);
                break;
            case "remove":
                target.delete(subpath);
                break;
        }
    }

    applySnapshot(node: Node, snapshot: any): void {
        assertType(snapshot, this);
        const target = node.data as ObservableMap<any>;
        const currentKeys: { [key: string]: boolean } = {};
        target.keys().forEach(key => {
            currentKeys[key] = false;
        });
        // Don't use target.replace, as it will throw all existing items first
        Object.keys(snapshot).forEach(key => {
            target.set(key, snapshot[key]);
            currentKeys[key] = true;
        });
        Object.keys(currentKeys).forEach(key => {
            if (currentKeys[key] === false) target.delete(key);
        });
    }

    getChildType(key: string): IType<any, any> {
        return this.subType;
    }

    isValidSnapshot(value: any): boolean {
        return isPlainObject(value) ? Object.keys(value).every(path => this.subType.validate(value[path])) : false;
    }

    getDefaultSnapshot() {
        return {};
    }

    removeChild(node: Node, subpath: string) {
        (node.data as ObservableMap<any>).delete(subpath);
    }
}