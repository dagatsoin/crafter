import {Node, IValidationResult} from "../api/Type";
import {getInstance, Instance} from "./Instance";

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
 * Add a property on an object instance
 * @param object
 * @param {string} propName
 * @param value
 */
export function addHiddenFinalProp(object: any, propName: string, value: any) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value
    });
}