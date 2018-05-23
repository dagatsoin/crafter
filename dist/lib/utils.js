"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("./core/node");
var typeFlags_1 = require("../api/typeFlags");
var jsonPatch_1 = require("./core/jsonPatch");
var mobx_1 = require("mobx");
exports.EMPTY_ARRAY = Object.freeze([]);
exports.EMPTY_OBJECT = Object.freeze({});
function isArray(val) {
    return (Array.isArray(val) || mobx_1.isObservableArray(val));
}
exports.isArray = isArray;
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
function extend(a) {
    var b = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        b[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < b.length; i++) {
        var current = b[i];
        for (var key in current)
            a[key] = current[key];
    }
    return a;
}
exports.extend = extend;
/**
 * Wrapper for throwing error
 * @param message
 */
function fail(message) {
    if (message === void 0) { message = "Illegal state"; }
    throw new Error("[crafter] " + message);
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
    assertType(start, "Instance");
    assertType(process, "function", "second");
    var node = node_1.getNode(start);
    node.children.forEach(function (child) {
        if (node_1.isInstance(child.data))
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
        : node_1.isInstance(value) ? "<" + value + ">" : "`" + safeStringify(value) + "`";
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
    if (rank === void 0) { rank = "first"; }
    if (process.env.NODE_ENV !== "production" || force) {
        if (type === "string" && typeof value !== "string")
            fail("expected " + (rank + " " || "") + "argument to be a string, got " + prettyPrintValue(value) + " instead.");
        if (type === "boolean" && typeof value !== "boolean")
            fail("expected " + (rank + " " || "") + "argument to be a boolean, got " + prettyPrintValue(value) + " instead.");
        if (type === "number" && typeof value !== "number")
            fail("expected " + (rank + " " || "") + "argument to be a number, got " + prettyPrintValue(value) + " instead.");
        if (type === "function" && typeof value !== "function")
            fail("expected " + (rank + " " || "") + "argument to be a function, got " + prettyPrintValue(value) + " instead.");
        if (type === "Type" && !typeFlags_1.isType(value))
            fail("expected " + (rank + " " || "") + "argument to be a Type, got " + prettyPrintValue(value) + " instead.");
        if (typeFlags_1.isType(type) && !type.validate(value))
            fail("expected " + (rank + " " || "") + "argument to be a " + type.name + ", got " + prettyPrintValue(value) + " instead.");
        if (type === "Instance" && !node_1.isInstance(value))
            fail("expected " + (rank + " " || "") + "argument to be an Instance, got " + prettyPrintValue(value) + " instead.");
    }
}
exports.assertType = assertType;
function isReferenceType(type) {
    return (type.flags & typeFlags_1.TypeFlag.Reference) > 0;
}
exports.isReferenceType = isReferenceType;
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
function addHiddenFinalProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value: value
    });
}
exports.addHiddenFinalProp = addHiddenFinalProp;
function remove(collection, item) {
    var idx = collection.indexOf(item);
    if (idx !== -1)
        collection.splice(idx, 1);
}
exports.remove = remove;
function registerEventHandler(handlers, handler) {
    handlers.push(handler);
    return function () {
        remove(handlers, handler);
    };
}
exports.registerEventHandler = registerEventHandler;
function asArray(val) {
    if (!val)
        return exports.EMPTY_ARRAY;
    if (isArray(val))
        return val;
    return [val];
}
exports.asArray = asArray;
function resolvePath(node, pathParts, failIfResolveFails) {
    if (failIfResolveFails === void 0) { failIfResolveFails = true; }
    // counter part of getRelativePath
    // note that `../` is not part of the JSON pointer spec, which is actually a prefix format
    // in json pointer: "" = current, "/a", attribute a, "/" is attribute "" etc...
    // so we treat leading ../ apart...
    for (var i = 0; i < pathParts.length; i++) {
        if (pathParts[i] === "")
            node = node.root;
        else if (pathParts[i] === ".." // '/bla' or 'a//b' splits to empty strings
        )
            node = node.parent;
        else if (pathParts[i] === "." || pathParts[i] === "")
            continue;
        else if (node) {
            node = node.getChildNode(pathParts[i]);
            continue;
        }
        if (!node) {
            if (failIfResolveFails)
                return fail("Could not resolve '" + pathParts[i] + "' in '" + jsonPatch_1.joinJsonPath(pathParts.slice(0, i - 1)) + "', path of the patch does not resolve");
            else
                return undefined;
        }
    }
    return node;
}
exports.resolvePath = resolvePath;
//# sourceMappingURL=utils.js.map