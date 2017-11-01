"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./Node");
var Type_1 = require("../api/Type");
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
 * // TODO keep that -> ? Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
function applySnapshot(target, snapshot) {
    // check all arguments
    assertType(target, "Instance");
    Node_1.getNode(target).applySnapshot(snapshot);
}
exports.applySnapshot = applySnapshot;
function getSnapshot(target) {
    // check all arguments
    assertType(target, "Instance");
    return Node_1.getNode(target).snapshot;
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
 * Return true if it is a mutable object.
 * @param value
 * @return {boolean}
 */
function isMutable(value) {
    return (value !== null &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !(value instanceof RegExp));
}
exports.isMutable = isMutable;
/**
 * Traverse a tree from a starting Node and process each Node with a given function.
 */
function walk(start, process) {
    // check all arguments
    assertType(start, "Instance", "first");
    assertType(process, "function", "second");
    var node = Node_1.getNode(start);
    node.children.forEach(function (child) {
        if (Node_1.isInstance(child.data))
            walk(child.data, process);
    });
    process(node.data);
}
exports.walk = walk;
function safeStringify(value) {
    try {
        return JSON.stringify(value);
    }
    catch (e) {
        return "<Unserializable: " + e + ">";
    }
}
function prettyPrintValue(value) {
    return typeof value === "function"
        ? "<function" + (value.name ? " " + value.name : "") + ">"
        : Node_1.isInstance(value) ? "<" + value + ">" : "`" + safeStringify(value) + "`";
}
exports.prettyPrintValue = prettyPrintValue;
/**
 * Runtime type check.
 * @param value
 * @param type
 * @param {string} rank to specify which argument is not valid: first, second, etc.
 */
function assertType(value, type, rank) {
    if (process.env.NODE_ENV !== "production") {
        if (type === "string" && typeof value !== "string")
            fail("expected " + (rank ? rank : "") + " argument to be a string, got " + prettyPrintValue(value) + " instead");
        if (type === "boolean" && typeof value !== "boolean")
            fail("expected " + (rank ? rank : "") + " argument to be a boolean, got " + prettyPrintValue(value) + " instead");
        if (type === "number" && typeof value !== "number")
            fail("expected " + (rank ? rank : "") + " argument to be a number, got " + prettyPrintValue(value) + " instead");
        if (type === "function" && typeof value !== "function")
            fail("expected " + (rank ? rank : "") + " argument to be a function, got " + prettyPrintValue(value) + " instead");
        if (type === "Type" && !Type_1.isType(value))
            fail("expected " + (rank ? rank : "") + " argument to be a Type, got " + prettyPrintValue(value) + " instead");
        if (Type_1.isType(type) && !type.validate(value))
            fail("expected " + (rank ? rank : "") + " argument to be a " + type.name + ", got " + prettyPrintValue(value) + " instead");
        if (type === "Instance" && !Node_1.isInstance(value))
            fail("expected " + (rank ? rank : "") + " argument to be a Type, got " + prettyPrintValue(value) + " instead");
    }
}
exports.assertType = assertType;
/**
 * escape slashes and backslashes
 * http://tools.ietf.org/html/rfc6901
 */
function escapeJsonPath(str) {
    return str.replace(/~/g, "~1").replace(/\//g, "~0");
}
exports.escapeJsonPath = escapeJsonPath;
/**
 * unescape slashes and backslashes
 */
function unescapeJsonPath(str) {
    return str.replace(/~0/g, "/").replace(/~1/g, "~");
}
exports.unescapeJsonPath = unescapeJsonPath;
/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array
 *
 * @export
 * @param {Object} target
 * @param {number} depth = 1, how far should we look upward?
 * @returns {boolean}
 */
function hasParent(target, depth) {
    if (depth === void 0) { depth = 1; }
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!Node_1.isInstance(target))
            fail("expected first argument to be a Instance, got " + target + " instead");
        if (typeof depth !== "number")
            fail("expected second argument to be a number, got " + depth + " instead");
        if (depth < 0)
            fail("Invalid depth: " + depth + ", should be >= 1");
    }
    var parent = Node_1.getNode(target).parent;
    while (parent) {
        if (--depth === 0)
            return true;
        parent = parent.parent;
    }
    return false;
}
exports.hasParent = hasParent;
/**
 * Returns the immediate parent of this object, or null.
 *
 * Note that the immediate parent can be either an object, map or array, and
 * doesn't necessarily refer to the parent model
 *
 * @export
 * @param {Object} target
 * @param {number} depth = 1, how far should we look upward?
 * @returns {*}
 */
function getParent(target, depth) {
    if (depth === void 0) { depth = 1; }
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!Node_1.isInstance(target))
            fail("expected first argument to be a instance, got " + target + " instead");
        if (typeof depth !== "number")
            fail("expected second argument to be a number, got " + depth + " instead");
        if (depth < 0)
            fail("Invalid depth: " + depth + ", should be >= 1");
    }
    var d = depth;
    var parent = Node_1.getNode(target).parent;
    while (parent) {
        if (--d === 0)
            return parent.data;
        parent = parent.parent;
    }
    return fail("Failed to find the parent of " + Node_1.getNode(target) + " at depth " + depth);
}
exports.getParent = getParent;
/**
 * Given an object in a model tree, returns the root object of that tree
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
function getRoot(target) {
    // check all arguments
    if (process.env.NODE_ENV !== "production") {
        if (!Node_1.isInstance(target))
            fail("expected first argument to be a mobx-state-tree node, got " + target + " instead");
    }
    return Node_1.getNode(target).root.data;
}
exports.getRoot = getRoot;
//# sourceMappingURL=utils.js.map