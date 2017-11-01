import { Instance } from "../lib/Node";
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
export declare function clone<T extends Instance>(source: T): T;
/**
 * Applies a snapshot to a given model instances.
 * // TODO keep that -> ? Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
export declare function applySnapshot<S, T>(target: Instance, snapshot: S): void;
export declare function getSnapshot<S>(target: Instance): S;
/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array
 *
 * @export
 * @param {Object} target
 * @param {number} depth = 1, how far should we look upward?
 * @returns {boolean}
 */
export declare function hasParent(target: Instance, depth?: number): boolean;
export declare function getParent(target: Instance, depth?: number): any & Instance;
export declare function getParent<T>(target: Instance, depth?: number): T & Instance;
export declare function getRoot(target: Instance): any & Instance;
export declare function getRoot<T>(target: Instance): T & Instance;
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
export declare function isAlive(target: Instance): boolean;
