"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Instance_1 = require("./Instance");
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
/**
 * Applies a snapshot to a given model instances.
 * // TODO keep ? Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
function applySnapshot(target, snapshot) {
    Instance_1.getInstance(target).applySnapshot(snapshot);
}
exports.applySnapshot = applySnapshot;
function getSnapshot(target) {
    return Instance_1.getInstance(target).snapshot;
}
exports.getSnapshot = getSnapshot;
/**
 * Wrapper for throwing error
 * @param message
 */
function fail(message) {
    if (message === void 0) { message = "Illegal state"; }
    throw new Error("[chewing] " + message);
}
exports.fail = fail;
/**
 * Return true if value is a plain object.
 * @param value
 * @return {boolean}
 */
function isPlainObject(value) {
    if (value === null || typeof value !== "object")
        return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
exports.isPlainObject = isPlainObject;
/**
 * Add a property on an object instance
 * @param object
 * @param {string} propName
 * @param value
 */
function addHiddenFinalProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value: value
    });
}
exports.addHiddenFinalProp = addHiddenFinalProp;
//# sourceMappingURL=utils.js.map