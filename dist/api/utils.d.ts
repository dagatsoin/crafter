import { Instance } from "../lib/core/Node";
import { IDisposer } from "../lib/utils";
import { IType } from "./Type";
import { IJsonPatch } from "../lib/core/jsonPatch";
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
/**
 * Return the Type factory of an instance
 * @param {Instance} instance
 * @return {IType<any, any>}
 */
export declare function getType(instance: Instance): IType<any, any>;
/**
 * Return the Type facotry of a child
 * @param {Instance} instance
 * @param {string} childName
 * @return {IType<any, any>}
 */
export declare function getChildType(instance: Instance, childName: string): IType<any, any>;
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
export declare function resolveIdentifier(type: IType<any, any>, target: Instance, identifier: string | number): any;
/**
 * Removes a model element from the state tree, and let it live on as a new state tree
 * @param {T} target
 * @return {T}
 */
export declare function detach<T extends Instance>(target: T): T;
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
export declare function applyPatch(target: Instance, patch: IJsonPatch | IJsonPatch[]): void;
export interface IPatchRecorder {
    patches: ReadonlyArray<IJsonPatch>;
    inversePatches: ReadonlyArray<IJsonPatch>;
    stop(): any;
    replay(target?: Instance): any;
    undo(target?: Instance): void;
}
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
export declare function recordPatches(subject: Instance): IPatchRecorder;
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
export declare function onPatch(target: Instance, callback: (patch: IJsonPatch, reversePatch: IJsonPatch) => void): IDisposer;
