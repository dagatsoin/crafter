import {Instance, getNode, isInstance, Node} from "./Node";
import {isType, IType} from "../api/Type";

declare let process: any;

export const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([]);
export const EMPTY_OBJECT: {} = Object.freeze({});


/**
 * Return the
 * @param _
 * @return {T}
 */
export function identity<T>(_: T): T {
    return _;
}

/**
 * Return true if value is a primitive type
 * @param value
 * @return {boolean}
 */
export function isPrimitive(value: any): boolean {
    if (value === null || value === undefined) return true;
    return typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value instanceof Date;
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
 * Wrapper for throwing error
 * @param message
 */
export function fail(message = "Illegal state"): never {
    throw new Error("[chewing] " + message);
}

/**
 * Return true if value is a plain object.
 * @param value
 * @return {boolean}
 */
export function isPlainObject(value: any) {
    if (value === null || typeof value !== "object") return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}


/**
 * Return true if it is a mutable object.
 * @param value
 * @return {boolean}
 */
export function isMutable(value: any) {
    return (
        value !== null &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !(value instanceof RegExp)
    );
}

/**
 * Traverse a tree from a starting Node and process each Node with a given function.
 */
export function walk(start: Instance, process: (item: Instance) => void) {
    // check all arguments
    assertType(start, "Instance", "first");
    assertType(process, "function", "second");

    const node = getNode(start);
    node.children.forEach(child => {
        if (isInstance(child.data)) walk(child.data, process);
    });
    process(node.data);
}


function safeStringify(value: any) {
    try {
        return JSON.stringify(value);
    } catch (e) {
        return `<Unserializable: ${e}>`;
    }
}

export function prettyPrintValue(value: any) {
    return typeof value === "function"
        ? `<function${value.name ? " " + value.name : ""}>`
        : isInstance(value) ? `<${value}>` : `\`${safeStringify(value)}\``;
}

/**
 * Runtime type check.
 * @param value
 * @param type
 * @param {string} rank to specify which argument is not valid: first, second, etc.
 */
export function assertType(value: any, type: any, rank?: string) {
    if (process.env.NODE_ENV !== "production") {
        if (type === "string" && typeof value !== "string") fail(`expected ${rank ? rank : ""} argument to be a string, got ${prettyPrintValue(value)} instead`);
        if (type === "boolean" && typeof value !== "boolean") fail(`expected ${rank ? rank : ""} argument to be a boolean, got ${prettyPrintValue(value)} instead`);
        if (type === "number" && typeof value !== "number") fail(`expected ${rank ? rank : ""} argument to be a number, got ${prettyPrintValue(value)} instead`);
        if (type === "function" && typeof value !== "function") fail(`expected ${rank ? rank : ""} argument to be a function, got ${prettyPrintValue(value)} instead`);
        if (type === "Type" && !isType(value)) fail(`expected ${rank ? rank : ""} argument to be a Type, got ${prettyPrintValue(value)} instead`);
        if (isType(type) && !type.validate(value)) fail(`expected ${rank ? rank : ""} argument to be a ${type.name}, got ${prettyPrintValue(value)} instead`);
        if (type === "Instance" && !isInstance(value)) fail(`expected ${rank ? rank : ""} argument to be a Type, got ${prettyPrintValue(value)} instead`);
    }
}

/**
 * escape slashes and backslashes
 * http://tools.ietf.org/html/rfc6901
 */
export function escapeJsonPath(str: string) {
    return str.replace(/~/g, "~1").replace(/\//g, "~0");
}

/**
 * unescape slashes and backslashes
 */
export function unescapeJsonPath(str: string) {
    return str.replace(/~0/g, "/").replace(/~1/g, "~");
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
    if (process.env.NODE_ENV !== "production") {
        if (!isInstance(target))
            fail("expected first argument to be a Instance, got " + target + " instead");
        if (typeof depth !== "number")
            fail("expected second argument to be a number, got " + depth + " instead");
        if (depth < 0) fail(`Invalid depth: ${depth}, should be >= 1`);
    }
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
    if (process.env.NODE_ENV !== "production") {
        if (!isInstance(target))
            fail("expected first argument to be a instance, got " + target + " instead");
        if (typeof depth !== "number")
            fail("expected second argument to be a number, got " + depth + " instead");
        if (depth < 0) fail(`Invalid depth: ${depth}, should be >= 1`);
    }
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
    if (process.env.NODE_ENV !== "production") {
        if (!isInstance(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead");
    }
    return getNode(target).root.data;
}
