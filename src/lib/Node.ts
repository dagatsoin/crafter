import {computed, isObservable, observable} from "mobx";
import {IType} from "../api/Type";
import {escapeJsonPath, fail, identity, isMutable, isPlainObject, isPrimitive, walk} from "./utils";

export type Instance = {
    readonly $node?: Node
};

export class Node {
    readonly type: IType<any, any>;
    readonly data: any;
    @observable public parent: Node | null = null;
    identifierAttribute: string | undefined = undefined; // not to be modified directly, only through model initialization
    subPath: string;

    private isAlive: boolean;
    private isDetaching: boolean;

    constructor(type: IType<any, any>,
                parent: Node | null,
                subPath: string,
                initialValue: any,
                initBaseType: (baseTypeIdentity: any) => any = identity,
                buildType: (node: Node, snapshot: any) => void = () => {
                }) {

        this.type = type;
        this.parent = parent;
        this.subPath = subPath;

        /* 1 - Init an empty instance of the type. If the type is an primitive type it will get its value.
         * If it it an object return {}, if it is an array it return  [], etc...
         * We also test if the node ref could be attached to the type. // todo put this as a static prop of the type */
        this.data = initBaseType(initialValue);
        const canAttachNodeRef = canAttachNode(this.data);

        /* 2 - // todo Observe the stored value to transform the Instance tree in a Node tree.*/

        /* 3 - Add a reference to this node to the data. This will allow to recognize this value as a Node
         and use functions like restore, snapshot, type check, etc.*/
        if (canAttachNodeRef) {
            Object.defineProperty(this.data, "$node", {
                enumerable: false,
                writable: false,
                configurable: true,
                value: this,
            });
        }

        /* 4 - Build and hydration phase. Only needed for complex type instance */
        if (!isPrimitive(this.data)) buildType(this, initialValue);

        this.isAlive = true;
    }

    applySnapshot(snapshot: any) {
        if (snapshot !== this.snapshot) this.type.applySnapshot(this, snapshot);
    }

    @computed
    get snapshot(): any {
        return this.type.getSnapshot(this);
    }

    isRoot() {
        return areSame(this.root, this);
    }

    @computed
    get root(): Node {
        // future optimization: store root ref in the node and maintain it
        let p, r: Node = this;
        while ((p = r.parent)) r = p;
        return r;
    }

    @computed
    get value(): any {
        return this.type.getValue(this);
    }

    @computed
    get children(): Array<Node> {
        return this.type.getChildren(this);
    }

    get identifier(): string | null {
        return this.identifierAttribute ? this.data[this.identifierAttribute] : null;
    }

    @computed
    public get path(): string {
        return this.parent ? this.parent.path + "/" + escapeJsonPath(this.subPath) : "";
    }

    assertAlive() {
        if (!this.isAlive) fail(`${this} cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value`);
    }

    beforeDestroy() {}

    remove() {
        if (this.isDetaching) return;

        if (isInstance(this.data)) {
            // 1- Warn every other nodes that a node will be removed.
            walk(this.data, child => getNode(child).beforeDestroy());
            // 2- Prevent using this node.
            walk(this.data, child => getNode(child).destroy());
        }
    }

    public destroy() {
        // invariant: not called directly but from "die"
        // this.root.identifierCache!.notifyDied(this); //todo implement identifier cache
        const self = this;
        const oldPath = this.path;

        // kill the computed prop and just store the last snapshot
        Object.defineProperty(this, "snapshot", {
            enumerable: true,
            writable: false,
            configurable: true,
            value: this.snapshot
        });

        this.isAlive = false;
        this.parent = null;
        this.subPath = "";

        // This is quite a hack, once interceptable objects / arrays / maps are extracted from mobx,
        // we could express this in a much nicer way
        Object.defineProperty(this.data, "$mobx", {
            get() {
                fail(
                    `This object has died and is no longer part of a state tree. It cannot be used anymore. The object (of type '${self.type.name}') used to live at '${oldPath}'. It is possible to access the last snapshot of this object using 'getSnapshot', or to create a fresh copy using 'clone'. If you want to remove an object from the tree without killing it, use 'detach' instead.`
                );
            }
        });
    }

    setParent(newParent: Node | null, subPath: string | null = null) {
        if (this.parent === newParent && this.subPath === subPath) return;
        if (newParent) {
            if (this.parent && newParent !== this.parent)
                fail(`A node cannot exists twice in the state tree. Failed to add ${this} to path '${newParent.path}/${subPath}'.`);
            if (!this.parent && newParent.root === this)
                fail(`A state tree is not allowed to contain itself. Cannot assign ${this} to path '${newParent.path}/${subPath}'`);
        }
        if (this.parent && !newParent) {
            this.remove();
        } else {
            this.subPath = subPath || "";
            if (newParent && newParent !== this.parent) {
                // newParent.root.identifierCache!.mergeCache(this); //todo implement identifier cache
                this.parent = newParent;
            }
        }
    }
}

/**
 * Get the internal Instance object of a runtime Instance.
 * @param value
 * @return {Node}
 */
export function getNode(value: Instance): Node {
    if (isInstance(value)) return value.$node!;
    else throw new Error(`Value ${value} is not a tree Node`);
}

/**
 * Returns true if the given value is a instance in a tree.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
export function isInstance(value: any): value is Instance {
    return !!(value && value.$node);
}

export function createNode<S, T>(type: IType<S, T>,
                                 parent: Node | null,
                                 subPath: string,
                                 initialValue: any,
                                 createEmptyInstance: (initialValue: any) => T = identity,
                                 hydrateInstance: (node: Node, snapshot: any) => void = () => {
                                 }) {
    if (isInstance(initialValue)) {
        const targetNode = getNode(initialValue);
        if (!targetNode.isRoot)
            fail(
                `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${parent
                    ? parent.path
                    : ""}/${subPath}', but it lives already at '${targetNode.path}'`
            );
        targetNode.setParent(parent, subPath);
        return targetNode;
    }
    return new Node(type, parent, subPath, initialValue, createEmptyInstance, hydrateInstance);
}

export function canAttachNode(value: any) {
    return (
        value &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !(value.data && isInstance(value.data)) &&
        !isInstance(value) &&
        !Object.isFrozen(value)
    );
}

/**
 * Convert a value to a node at given parent and subpath. attempts to reuse old node if possible and given
 * @param {IType<any, any>} childType
 * @param {Node} parent
 * @param {string} subpath
 * @param newValue
 * @param {Node} oldNode
 * @return {any}
 */
export function valueAsNode(childType: IType<any, any>,
                            parent: Node,
                            subpath: string,
                            newValue: any,
                            oldNode?: Node) {
    // the new value has a MST node
    if (isInstance(newValue)) {
        const child = getNode(newValue);
        child.assertAlive();

        // the node lives here
        if (child.parent !== null && child.parent === parent) {
            child.setParent(parent, subpath);
            // todo die here
            if (oldNode && oldNode !== child) oldNode.remove();
            return child;
        }
    }
    // there is old node and new one is a value/snapshot
    if (oldNode) {
        const child = childType.reconcile(oldNode, newValue);
        child.setParent(parent, subpath);
        return child;
    }
    // nothing to do, create from scratch
    return childType.instantiate(parent, subpath, newValue);
}

/**
 * Return true if if the value is the Instance or a snapshot of the Node.
 * @param {Instance} node
 * @param value
 * @return {boolean}
 */
export function areSame(node: Node, value: any) {
    // the new value has the same node
    if (isInstance(value)) {
        return getNode(value) === node;
    }
    // the provided value is the snapshot of the node
    if (isMutable(value) && node.snapshot === value) return true;
    // new value is a snapshot with the correct identifier
    return !!(node.identifier !== null &&
        node.identifierAttribute &&
        isPlainObject(value) &&
        value[node.identifierAttribute] === node.identifier);
}