import {Node, getNode, Instance} from "../lib/core/Node";
import {fail, assertType} from "../lib/utils";
import {IType} from "./Type";
import {isType} from "./TypeFlags";

declare const process: any;
/**
 * Returns a deep copy of the given state tree node as new tree.
 * Short hand for `snapshot(x) = getType(x).create(getSnapshot(x))`
 *
 * _Tip: clone will create a literal copy, including the same identifiers. To modify identifiers etc during cloning, don't use clone but take a snapshot of the tree, modify it, and create new instance_
 *
 * @export
 * @template T
 * @param {T} source
 * @returns {T}
 */
export function clone<T extends Instance>(source: T): T {
    // check all arguments
    assertType(source, "Instance");
    const node = getNode(source);
    return node.type.create(node.snapshot) as T;
}

/**
 * Applies a snapshot to a given model instances.
 * // TODO keep that -> ? Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
export function applySnapshot<S, T>(target: Instance, snapshot: S) {
    // check all arguments
    assertType(target, "Instance");
    getNode(target).applySnapshot(snapshot);
}

export function getSnapshot<S>(target: Instance): S {
    // check all arguments
    assertType(target, "Instance");
    return getNode(target).snapshot;
}

/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array
 *
 * @export
 * @param {Object} target
 * @param {number} depth = 1, how far should we look upward?
 * @returns {boolean}
 */
export function hasParent(target: Instance, depth: number = 1): boolean {
    // check all arguments
    assertType(target, "Instance");
    assertType(depth, "number", "first");
    if (process.env.NODE_ENV !== "production" && depth < 0) fail(`Invalid depth: ${depth}, should be >= 1`);

    let parent: Node | null = getNode(target).parent;
    while (parent) {
        if (--depth === 0) return true;
        parent = parent.parent;
    }
    return false;
}

export function getParent(target: Instance, depth?: number): any & Instance;
export function getParent<T>(target: Instance, depth?: number): T & Instance;
/**
 * Returns the immediate parent of this object, or null.
 *
 * Note that the immediate parent can be either an object, map or array, and
 * doesn't necessarily refer to the parent model
 *
 * @export
 * @param {Object} target
 * @param {number} depth = 1, how far should we look upward?
 * @returns {*}
 */
export function getParent<T>(target: Instance, depth = 1): T & Instance {
    // check all arguments
    assertType(target, "Instance");
    assertType(depth, "number");
    if (process.env.NODE_ENV !== "production" && depth < 0) fail(`Invalid depth: ${depth}, should be >= 1`);

    let d = depth;
    let parent: Node | null = getNode(target).parent;
    while (parent) {
        if (--d === 0) return parent.data;
        parent = parent.parent;
    }
    return fail(`Failed to find the parent of ${getNode(target)} at depth ${depth}`);
}

export function getRoot(target: Instance): any & Instance;
export function getRoot<T>(target: Instance): T & Instance;
/**
 * Given an object in a model tree, returns the root object of that tree
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export function getRoot(target: Instance): Instance {
    // check all arguments
    assertType(target, "Instance");
    return getNode(target).root.data;
}

/**
 * Returns true if the given state tree node is not killed yet.
 * This means that the node is still a part of a tree, and that `destroy`
 * has not been called. If a node is not alive anymore, the only thing one can do with it
 * is requesting it's last path and snapshot
 *
 * @export
 * @param {Instance} target
 * @returns {boolean}
 */
export function isAlive(target: Instance): boolean {
    // check all arguments
    assertType(target, "Instance", "first", true);
    return getNode(target).isAlive;
}

/**
 * Return the Type factory of an instance
 * @param {Instance} instance
 * @return {IType<any, any>}
 */
export function getType(instance: Instance): IType<any, any> {
    return getNode(instance).type;
}

/**
 * Return the Type facotry of a child
 * @param {Instance} instance
 * @param {string} childName
 * @return {IType<any, any>}
 */
export function getChildType(instance: Instance, childName: string): IType<any, any> {
    return getNode(instance).getChildType(childName);
}

/**
 * Resolves a model instance given a root target, the type and the identifier you are searching for.
 * Returns undefined if no value can be found.
 *
 * @export
 * @param {IType<any, any>} type
 * @param {Instance} target
 * @param {(string | number)} identifier
 * @returns {*}
 */
export function resolveIdentifier(type: IType<any, any>, target: Instance, identifier: string | number) {
    assertType(type, "Type", "first", true);
    assertType(target, "Instance", "second", true);
    const node = getNode(target).root.identifierCache!.resolve(type, "" + identifier);
    return node ? node.value : undefined;
}

/**
 * Removes a model element from the state tree, and let it live on as a new state tree
 * @param {T} target
 * @return {T}
 */
export function detach<T extends Instance>(target: T): T {
    assertType(target, "Instance");
    getNode(target).detach();
    return target;
}