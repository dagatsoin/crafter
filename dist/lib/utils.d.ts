import { Instance, Node } from "./core/node";
import { ReferenceType } from "./reference";
export declare const EMPTY_ARRAY: ReadonlyArray<any>;
export declare const EMPTY_OBJECT: {};
export declare type IDisposer = () => void;
export declare function isArray(val: any): boolean;
/**
 * Return the
 * @param _
 * @return {T}
 */
export declare function identity<T>(_: T): T;
/**
 * Return true if value is a primitive type
 * @param value
 * @return {boolean}
 */
export declare function isPrimitive(value: any): boolean;
export declare function extend<A, B>(a: A, b: B): A & B;
export declare function extend<A, B, C>(a: A, b: B, c: C): A & B & C;
export declare function extend<A, B, C, D>(a: A, b: B, c: C, d: D): A & B & C & D;
export declare function extend(a: any, ...b: any[]): any;
/**
 * Wrapper for throwing error
 * @param message
 */
export declare function fail(message?: string): never;
/**
 * Return true if value is a plain object.
 * @param value
 * @return {boolean}
 */
export declare function isPlainObject(value: any): boolean;
/**
 * Return true if it is a mutable object.
 * @param value
 * @return {boolean}
 */
export declare function isMutable(value: any): boolean;
/**
 * Traverse a tree from a starting Node and process each Node with a given function.
 */
export declare function walk(start: Instance, process: (item: Instance) => void): void;
export declare function prettyPrintValue(value: any): string;
/**
 * Runtime type check.
 * @param value
 * @param type
 * @param {string} rank to specify which argument is not valid: first, second, etc.
 * @param force if true, run event in prod mode
 */
export declare function assertType(value: any, type: any, rank?: string, force?: boolean): void;
export declare function isReferenceType(type: any): type is ReferenceType<any>;
/**
 * escape slashes and backslashes
 * http://tools.ietf.org/html/rfc6901
 */
export declare function escapeJsonPath(str: string): string;
/**
 * unescape slashes and backslashes
 */
export declare function unescapeJsonPath(str: string): string;
export declare function addHiddenFinalProp(object: any, propName: string, value: any): void;
export declare function remove<T>(collection: T[], item: T): void;
export declare function registerEventHandler(handlers: Function[], handler: Function): IDisposer;
export declare function asArray<T>(val: undefined | null | T | T[]): T[];
export declare function resolvePath(node: Node, pathParts: string[]): Node;
export declare function resolvePath(node: Node, pathParts: string[], failIfResolveFails: boolean): Node | undefined;
