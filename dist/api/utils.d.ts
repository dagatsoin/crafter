import { ValueInstance, IValidationResult } from "./Type";
import { Instance } from "../lib/Instance";
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
export declare function typeCheckSuccess(): IValidationResult;
export declare function typeCheckFailure(value: any, message?: string): IValidationResult;
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
 * Get the internal Instance object of a runtime Instance.
 * @param value
 * @return {Instance}
 */
export declare function getInstance(value: ValueInstance): Instance;
/**
 * Returns true if the given value is a node in a graph.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {value is IGraphNode}
 */
export declare function isInstance(value: any): value is ValueInstance;
/**
 * Wrapper for throwing error
 * @param message
 */
export declare function fail(message?: string): never;
