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
    assertType(start, "Instance", 1);
    assertType(process, "function", 2);
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
 * @param force if true, run event in prod mode
 */
function assertType(value, type, rank, force) {
    if (process.env.NODE_ENV !== "production" || force) {
        if (type === "string" && typeof value !== "string")
            fail("expected " + (rank ? rank.toString() : "") + " argument to be a string, got " + prettyPrintValue(value) + " instead");
        if (type === "boolean" && typeof value !== "boolean")
            fail("expected " + (rank ? rank.toString() : "") + " argument to be a boolean, got " + prettyPrintValue(value) + " instead");
        if (type === "number" && typeof value !== "number")
            fail("expected " + (rank ? rank.toString() : "") + " argument to be a number, got " + prettyPrintValue(value) + " instead");
        if (type === "function" && typeof value !== "function")
            fail("expected " + (rank ? rank.toString() : "") + " argument to be a function, got " + prettyPrintValue(value) + " instead");
        if (type === "Type" && !Type_1.isType(value))
            fail("expected " + (rank ? rank.toString() : "") + " argument to be a Type, got " + prettyPrintValue(value) + " instead");
        if (Type_1.isType(type) && !type.validate(value))
            fail("expected " + (rank ? rank.toString() : "") + " argument to be a " + type.name + ", got " + prettyPrintValue(value) + " instead");
        if (type === "Instance" && !Node_1.isInstance(value))
            fail("expected " + (rank ? rank.toString() : "") + " argument to be a Type, got " + prettyPrintValue(value) + " instead");
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
//# sourceMappingURL=utils.js.map