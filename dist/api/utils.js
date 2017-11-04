"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("../lib/core/Node");
var utils_1 = require("../lib/utils");
/**
 * Returns a deep copy of the given state tree node as new tree.
 * Short hand for `snapshot(x) = getType(x).create(getSnapshot(x))`
 *
 * _Tip: clone will create a literal copy, including the same identifiers. To modify identifiers etc during cloning, don't use clone but take a snapshot of the tree, modify it, and create new instance_
 *
 * @export
 * @template T
 * @param {T} source
 * @returns {T}
 */
function clone(source) {
    // check all arguments
    utils_1.assertType(source, "Instance");
    var node = Node_1.getNode(source);
    return node.type.create(node.snapshot);
}
exports.clone = clone;
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
    utils_1.assertType(target, "Instance");
    Node_1.getNode(target).applySnapshot(snapshot);
}
exports.applySnapshot = applySnapshot;
function getSnapshot(target) {
    // check all arguments
    utils_1.assertType(target, "Instance");
    return Node_1.getNode(target).snapshot;
}
exports.getSnapshot = getSnapshot;
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
    utils_1.assertType(target, "Instance");
    utils_1.assertType(depth, "number", 1);
    if (process.env.NODE_ENV !== "production" && depth < 0)
        utils_1.fail("Invalid depth: " + depth + ", should be >= 1");
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
    utils_1.assertType(target, "Instance");
    utils_1.assertType(depth, "number", 1);
    if (process.env.NODE_ENV !== "production" && depth < 0)
        utils_1.fail("Invalid depth: " + depth + ", should be >= 1");
    var d = depth;
    var parent = Node_1.getNode(target).parent;
    while (parent) {
        if (--d === 0)
            return parent.data;
        parent = parent.parent;
    }
    return utils_1.fail("Failed to find the parent of " + Node_1.getNode(target) + " at depth " + depth);
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
    utils_1.assertType(target, "Instance");
    return Node_1.getNode(target).root.data;
}
exports.getRoot = getRoot;
/**
 * Returns true if the given state tree node is not killed yet.
 * This means that the node is still a part of a tree, and that `destroy`
 * has not been called. If a node is not alive anymore, the only thing one can do with it
 * is requesting it's last path and snapshot
 *
 * @export
 * @param {Instance} target
 * @returns {boolean}
 */
function isAlive(target) {
    // check all arguments
    utils_1.assertType(target, "Instance");
    return Node_1.getNode(target).isAlive;
}
exports.isAlive = isAlive;
/**
 * Return the Type factory of an instance
 * @param {Instance} instance
 * @return {IType<any, any>}
 */
function getType(instance) {
    return Node_1.getNode(instance).type;
}
exports.getType = getType;
/**
 * Return the Type facotry of a child
 * @param {Instance} instance
 * @param {string} childName
 * @return {IType<any, any>}
 */
function getChildType(instance, childName) {
    return Node_1.getNode(instance).getChildType(childName);
}
exports.getChildType = getChildType;
//# sourceMappingURL=utils.js.map