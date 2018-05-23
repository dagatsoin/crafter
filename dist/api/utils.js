"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("../lib/core/node");
var utils_1 = require("../lib/utils");
var type_1 = require("./type");
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
    var node = node_1.getNode(source);
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
    node_1.getNode(target).applySnapshot(snapshot);
}
exports.applySnapshot = applySnapshot;
function getSnapshot(target) {
    // check all arguments
    utils_1.assertType(target, "Instance");
    return node_1.getNode(target).snapshot;
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
    utils_1.assertType(depth, "number", "first");
    if (process.env.NODE_ENV !== "production" && depth < 0)
        utils_1.fail("Invalid depth: " + depth + ", should be >= 1");
    var parent = node_1.getNode(target).parent;
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
    utils_1.assertType(depth, "number");
    if (process.env.NODE_ENV !== "production" && depth < 0)
        utils_1.fail("Invalid depth: " + depth + ", should be >= 1");
    var d = depth;
    var parent = node_1.getNode(target).parent;
    while (parent) {
        if (--d === 0)
            return parent.data;
        parent = parent.parent;
    }
    return utils_1.fail("Failed to find the parent of " + node_1.getNode(target) + " at depth " + depth);
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
    return node_1.getNode(target).root.data;
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
    utils_1.assertType(target, "Instance", "first", true);
    return node_1.getNode(target).isAlive;
}
exports.isAlive = isAlive;
/**
 * Return the Type factory of an instance
 * @param {Instance} instance
 * @return {IType<any, any>}
 */
function getType(instance) {
    return node_1.getNode(instance).type;
}
exports.getType = getType;
/**
 * Return the Type facotry of a child
 * @param {Instance} instance
 * @param {string} childName
 * @return {IType<any, any>}
 */
function getChildType(instance, childName) {
    return node_1.getNode(instance).getChildType(childName);
}
exports.getChildType = getChildType;
/**
 * Resolves a model instance given a root target, the type and the identifier you are searching for.
 * Returns undefined if no value can be found.
 *
 * @export
 * @param {IType<any, any>} type
 * @param {Instance} target
 * @param {(string | number)} identifier
 * @returns {*}
 */
function resolveIdentifier(type, target, identifier) {
    utils_1.assertType(type, "Type", "first", true);
    utils_1.assertType(target, "Instance", "second", true);
    var node = node_1.getNode(target).root.identifierCache.resolve(type, "" + identifier);
    return node ? node.value : undefined;
}
exports.resolveIdentifier = resolveIdentifier;
/**
 * Removes a model element from the state tree, and let it live on as a new state tree
 * @param {T} target
 * @return {T}
 */
function detach(target) {
    utils_1.assertType(target, "Instance");
    node_1.getNode(target).detach();
    return target;
}
exports.detach = detach;
/**
 * Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
 *
 * Can apply a single past, or an array of patches.
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch} patch
 * @returns
 */
function applyPatch(target, patch) {
    // check all arguments
    utils_1.assertType(target, "Instance");
    utils_1.assertType(patch, "object", "second");
    node_1.getNode(target).applyPatches(utils_1.asArray(patch));
}
exports.applyPatch = applyPatch;
/**
 * Small abstraction around `onPatch` and `applyPatch`, attaches a patch listener to a tree and records all the patches.
 * Returns an recorder object with the following signature:
 *
 * @example
 * export interface IPatchRecorder {
 *      // the recorded patches
 *      patches: IJsonPatch[]
 *      // the inverse of the recorded patches
 *      inversePatches: IJsonPatch[]
 *      // stop recording patches
 *      stop(target?: Instance): any
 *      // resume recording patches
 *      resume()
 *      // apply all the recorded patches on the given target (the original subject if omitted)
 *      replay(target?: Instance): any
 *      // reverse apply the recorded patches on the given target  (the original subject if omitted)
 *      // stops the recorder if not already stopped
 *      undo(): void
 * }
 *
 * @export
 * @param {Instance} subject
 * @returns {IPatchRecorder}
 */
function recordPatches(subject) {
    // check all arguments
    utils_1.assertType(subject, "Instance");
    var disposer = null;
    function resume() {
        if (disposer)
            return;
        disposer = onPatch(subject, function (patch, inversePatch) {
            recorder.rawPatches.push([patch, inversePatch]);
        });
    }
    var recorder = {
        rawPatches: [],
        get patches() {
            return this.rawPatches.map(function (_a) {
                var a = _a[0];
                return a;
            });
        },
        get inversePatches() {
            return this.rawPatches.map(function (_a) {
                var _ = _a[0], b = _a[1];
                return b;
            });
        },
        stop: function () {
            if (disposer)
                disposer();
            disposer = null;
        },
        resume: resume,
        replay: function (target) {
            applyPatch(target || subject, recorder.patches);
        },
        undo: function (target) {
            applyPatch(target || subject, recorder.inversePatches.slice().reverse());
        }
    };
    resume();
    return recorder;
}
exports.recordPatches = recordPatches;
/**
 * Registers a function that will be invoked for each mutation that is applied to the provided model instance, or to any of its children.
 * See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details. onPatch events are emitted immediately and will not await the end of a transaction.
 * Patches can be used to deep observe a model tree.
 *
 * @export
 * @param {Object} target the model instance from which to receive patches
 * @param {(patch: IJsonPatch, reversePatch) => void} callback the callback that is invoked for each patch. The reversePatch is a patch that would actually undo the emitted patch
 * @returns {IDisposer} function to remove the listener
 */
function onPatch(target, callback) {
    // check all arguments
    utils_1.assertType(target, "Instance");
    utils_1.assertType(callback, "function");
    return node_1.getNode(target).onPatch(callback);
}
exports.onPatch = onPatch;
/**
 * Register a mutation globally to be used on any Type.
 * @param mutationType
 * @param mutation
 */
function registerMutation(mutationType, mutation) {
    type_1.Type.registerMutation(mutationType, mutation);
}
exports.registerMutation = registerMutation;
/**
 * Add a mutation on an instance.
 * @param instance
 * @param mutationType
 */
function addInstanceMutation(instance, mutationType) {
    utils_1.assertType(instance, "Instance");
    node_1.getNode(instance).addMutation(mutationType);
}
exports.addInstanceMutation = addInstanceMutation;
/**
 * Remove a mutation from an instance.
 * @param instance
 * @param mutationType
 */
function removeInstanceMutation(instance, mutationType) {
    utils_1.assertType(instance, "Instance");
    node_1.getNode(instance).removeMutation(mutationType);
}
exports.removeInstanceMutation = removeInstanceMutation;
//# sourceMappingURL=utils.js.map