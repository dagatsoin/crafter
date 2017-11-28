import {Instance, getNode, isInstance, Node} from "./core/node";
import {isType, TypeFlag} from "../api/typeFlags";
import {ReferenceType} from "./reference";
import {joinJsonPath} from "./core/jsonPatch";
import {isObservableArray} from "mobx";

declare let process: any;

export const EMPTY_ARRAY: ReadonlyArray<any> = Object.freeze([]);
export const EMPTY_OBJECT: {} = Object.freeze({});
export type IDisposer = () => void;

export function isArray(val: any): boolean {
    return (Array.isArray(val) || isObservableArray(val)) as boolean;
}

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
    assertType(start, "Instance");
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
 * @param force if true, run event in prod mode
 */
export function assertType(value: any, type: any, rank: string = "first", force?: boolean) {
    if (process.env.NODE_ENV !== "production" || force) {
        if (type === "string" && typeof value !== "string") fail(`expected ${rank + " " || ""}argument to be a string, got ${prettyPrintValue(value)} instead.`);
        if (type === "boolean" && typeof value !== "boolean") fail(`expected ${rank + " " || ""}argument to be a boolean, got ${prettyPrintValue(value)} instead.`);
        if (type === "number" && typeof value !== "number") fail(`expected ${rank + " " || ""}argument to be a number, got ${prettyPrintValue(value)} instead.`);
        if (type === "function" && typeof value !== "function") fail(`expected ${rank + " " || ""}argument to be a function, got ${prettyPrintValue(value)} instead.`);
        if (type === "Type" && !isType(value)) fail(`expected ${rank + " " || ""}argument to be a Type, got ${prettyPrintValue(value)} instead.`);
        if (isType(type) && !type.validate(value)) fail(`expected ${rank + " " || ""}argument to be a ${type.name}, got ${prettyPrintValue(value)} instead.`);
        if (type === "Instance" && !isInstance(value)) fail(`expected ${rank + " " || ""}argument to be an Instance, got ${prettyPrintValue(value)} instead.`);
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

export function addHiddenFinalProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value
    });
}

export function remove<T>(collection: T[], item: T) {
    const idx = collection.indexOf(item);
    if (idx !== -1) collection.splice(idx, 1);
}

export function registerEventHandler(handlers: Function[], handler: Function): IDisposer {
    handlers.push(handler);
    return () => {
        remove(handlers, handler);
    };
}

export function asArray<T>(val: undefined | null | T | T[]): T[] {
    if (!val) return (EMPTY_ARRAY as any) as T[];
    if (isArray(val)) return val as T[];
    return [val] as T[];
}

export function resolvePath(node: Node, pathParts: string[]): Node;
export function resolvePath(node: Node, pathParts: string[], failIfResolveFails: boolean): Node | undefined;
export function resolvePath(node: Node, pathParts: string[], failIfResolveFails: boolean = true): Node | undefined {
    // counter part of getRelativePath
    // note that `../` is not part of the JSON pointer spec, which is actually a prefix format
    // in json pointer: "" = current, "/a", attribute a, "/" is attribute "" etc...
    // so we treat leading ../ apart...
    for (let i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === "") node = node!.root;
        else if (
            pathParts[i] === ".." // '/bla' or 'a//b' splits to empty strings
        )
            node = node.parent!;
        else if (pathParts[i] === "." || pathParts[i] === "") continue;
        else if (node) {
            node = node.getChildNode(pathParts[i]);
            continue;
        }

        if (!node) {
            if (failIfResolveFails)
                return fail(
                    `Could not resolve '${pathParts[i]}' in '${joinJsonPath(
                        pathParts.slice(0, i - 1)
                    )}', path of the patch does not resolve`
                );
            else return undefined;
        }
    }
    return node!;
}