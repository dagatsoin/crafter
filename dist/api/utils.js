"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_ARRAY = Object.freeze([]);
exports.EMPTY_OBJECT = Object.freeze({});
/**
 * Return the
 * @param _
 * @return {T}
 */
function identity(_) {
    return _;
}
exports.identity = identity;
/**
 * Return true if value is a primitive type
 * @param value
 * @return {boolean}
 */
function isPrimitive(value) {
    if (value === null || value === undefined)
        return true;
    return typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value instanceof Date;
}
exports.isPrimitive = isPrimitive;
function typeCheckSuccess() {
    return exports.EMPTY_ARRAY;
}
exports.typeCheckSuccess = typeCheckSuccess;
function typeCheckFailure(//  context: IContext,
    value, message) {
    return [{ /* context, */ value: value, message: message }];
}
exports.typeCheckFailure = typeCheckFailure;
/**
 * Applies a snapshot to a given model instances.
 * // TODO keep ? Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
function restore(target, snapshot) {
    getInstance(target).restore(snapshot);
}
exports.restore = restore;
function serialize(target) {
    return getInstance(target).snapshot;
}
exports.serialize = serialize;
/**
 * Get the internal Instance object of a runtime Instance.
 * @param value
 * @return {Instance}
 */
function getInstance(value) {
    if (isInstance(value))
        return value.$instance;
    else
        throw new Error("Value " + value + " is not a graph Node");
}
exports.getInstance = getInstance;
/**
 * Returns true if the given value is a node in a graph.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {value is IGraphNode}
 */
function isInstance(value) {
    return !!(value && value.$instance);
}
exports.isInstance = isInstance;
/**
 * Wrapper for throwing error
 * @param message
 */
function fail(message) {
    if (message === void 0) { message = "Illegal state"; }
    throw new Error("[mobx-state-tree] " + message);
}
exports.fail = fail;
//# sourceMappingURL=utils.js.map