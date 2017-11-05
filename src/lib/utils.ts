import {Instance, getNode, isInstance, Node} from "./core/Node";
import {ReferenceType} from "../../dist/lib/Reference";
import {isType, TypeFlag} from "../api/TypeFlags";

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

export function extend<A, B>(a: A, b: B): A & B;
export function extend<A, B, C>(a: A, b: B, c: C): A & B & C;
export function extend<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D;
export function extend(a: any, ...b: any[]): any;
export function extend(a: any, ...b: any[]) {
    for (let i = 0; i < b.length; i++) {
        const current = b[i];
        for (let key in current) a[key] = current[key];
    }
    return a;
}

/**
 * Wrapper for throwing error
 * @param message
 */
export function fail(message = "Illegal state"): never {
    throw new Error("[crafter] " + message);
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
    assertType(start, "Instance", 1);
    assertType(process, "function", 2);

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
 * @param force if true, run event in prod mode
 */
export function assertType(value: any, type: any, rank: number = 1, force?: boolean) {
    if (process.env.NODE_ENV !== "production" || force) {
        if (type === "string" && typeof value !== "string") fail(`expected ${rank ? rank.toString() : ""} argument to be a string, got ${prettyPrintValue(value)} instead.`);
        if (type === "boolean" && typeof value !== "boolean") fail(`expected ${rank ? rank.toString() : ""} argument to be a boolean, got ${prettyPrintValue(value)} instead.`);
        if (type === "number" && typeof value !== "number") fail(`expected ${rank ? rank.toString() : ""} argument to be a number, got ${prettyPrintValue(value)} instead.`);
        if (type === "function" && typeof value !== "function") fail(`expected ${rank ? rank.toString() : ""} argument to be a function, got ${prettyPrintValue(value)} instead.`);
        if (type === "Type" && !isType(value)) fail(`expected ${rank ? rank.toString() : ""} argument to be a Type, got ${prettyPrintValue(value)} instead.`);
        if (isType(type) && !type.validate(value)) fail(`expected ${rank ? rank.toString() : ""} argument to be a ${type.name}, got ${prettyPrintValue(value)} instead.`);
        if (type === "Instance" && !isInstance(value)) fail(`expected ${rank ? rank.toString() : ""} argument to be an Instance, got ${prettyPrintValue(value)} instead.`);
    }
}

export function isReferenceType(type: any): type is ReferenceType<any> {
    return (type.flags & TypeFlag.Reference) > 0;
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