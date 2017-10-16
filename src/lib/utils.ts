import {ValueInstance, IValidationResult} from "../api/Type";
import {Instance} from "./Instance";

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

export function typeCheckSuccess(): IValidationResult {
    return EMPTY_ARRAY as any;
}

export function typeCheckFailure(//  context: IContext,
                                 value: any,
                                 message?: string): IValidationResult {
    return [{/* context, */value, message}];
}

/**
 * Applies a snapshot to a given model instances.
 * // TODO keep ? Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
export function restore<S, T>(target: ValueInstance, snapshot: S) {
    getInstance(target).restore(snapshot);
}

export function serialize<S>(target: ValueInstance): S {
    return getInstance(target).snapshot;
}

/**
 * Get the internal Instance object of a runtime Instance.
 * @param value
 * @return {Instance}
 */
export function getInstance(value: ValueInstance): Instance {
    if (isInstance(value)) return value.$instance!;
    else throw new Error(`Value ${value} is not a graph Node`);
}

/**
 * Returns true if the given value is a node in a graph.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {value is IGraphNode}
 */
export function isInstance(value: any): value is ValueInstance {
    return !!(value && value.$instance);
}

/**
 * Wrapper for throwing error
 * @param message
 */
export function fail(message = "Illegal state"): never {
    throw new Error("[mobx-state-tree] " + message);
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