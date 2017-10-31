import { Instance } from "./Node";
import { IType } from "../api/Type";
export declare const EMPTY_ARRAY: ReadonlyArray<any>;
export declare const EMPTY_OBJECT: {};
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
/**
 * Applies a snapshot to a given model instances.
 * // TODO keep that -> ? Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
export declare function applySnapshot<S, T>(target: Instance, snapshot: S): void;
export declare function getSnapshot<S>(target: Instance): S;
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
export declare function walk(start: Instance, processor: (item: Instance) => void): void;
/**
 * Throw if the value is not a valid snapshot of the given IType.
 * @param {IType<any, any>} type
 * @param value
 */
export declare function assertType(type: IType<any, any>, value: any): void;
export declare function prettyPrintValue(value: any): string;
/**
 * Check type in production mode.
 * @param value
 * @param type
 * @param {string} rank to specify which argument is not valid: first, second, etc.
 */
export declare function assertType(value: any, type: any, rank?: string): void;
/**
 * escape slashes and backslashes
 * http://tools.ietf.org/html/rfc6901
 */
export declare function escapeJsonPath(str: string): string;
/**
 * unescape slashes and backslashes
 */
export declare function unescapeJsonPath(str: string): string;
