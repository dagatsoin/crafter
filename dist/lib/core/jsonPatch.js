"use strict";
// https://tools.ietf.org/html/rfc6902
// http://jsonpatch.com/
Object.defineProperty(exports, "__esModule", { value: true });
function splitPatch(patch) {
    if (!("oldValue" in patch))
        utils_1.fail("Patches without `oldValue` field cannot be inversed");
    return [stripPatch(patch), invertPatch(patch)];
}
exports.splitPatch = splitPatch;
function stripPatch(patch) {
    // strips `oldvalue` information from the patch, so that it becomes a patch conform the json-patch spec
    // this removes the ability to undo the patch
    switch (patch.op) {
        case "add":
            return { op: "add", path: patch.path, value: patch.value };
        case "remove":
            return { op: "remove", path: patch.path };
        case "replace":
            return { op: "replace", path: patch.path, value: patch.value };
    }
}
exports.stripPatch = stripPatch;
function invertPatch(patch) {
    switch (patch.op) {
        case "add":
            return {
                op: "remove",
                path: patch.path
            };
        case "remove":
            return {
                op: "add",
                path: patch.path,
                value: patch.oldValue
            };
        case "replace":
            return {
                op: "replace",
                path: patch.path,
                value: patch.oldValue
            };
    }
}
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
function joinJsonPath(path) {
    // `/` refers to property with an empty name, while `` refers to root itself!
    if (path.length === 0)
        return "";
    return "/" + path.map(escapeJsonPath).join("/");
}
exports.joinJsonPath = joinJsonPath;
function splitJsonPath(path) {
    // `/` refers to property with an empty name, while `` refers to root itself!
    var parts = path.split("/").map(unescapeJsonPath);
    // path '/a/b/c' -> a b c
    // path '../../b/c -> .. .. b c
    return parts[0] === "" ? parts.slice(1) : parts;
}
exports.splitJsonPath = splitJsonPath;
var utils_1 = require("../utils");
//# sourceMappingURL=jsonPatch.js.map