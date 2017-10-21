import { ValueInstance } from "../api/Type";
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
 * // TODO keep ? Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
export declare function restore<S, T>(target: ValueInstance, snapshot: S): void;
export declare function serialize<S>(target: ValueInstance): S;
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
 * Add a property on an object instance
 * @param object
 * @param {string} propName
 * @param value
 */
export declare function addHiddenFinalProp(object: any, propName: string, value: any): void;
