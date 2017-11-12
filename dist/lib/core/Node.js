"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var utils_1 = require("../utils");
var IdentifierCache_1 = require("./IdentifierCache");
var jsonPatch_1 = require("./jsonPatch");
var Node = /** @class */ (function () {
    function Node(type, parent, subPath, initialValue, initBaseType, buildType) {
        if (initBaseType === void 0) { initBaseType = utils_1.identity; }
        if (buildType === void 0) { buildType = function () {
        }; }
        var _this = this;
        this._parent = null;
        this.identifierAttribute = undefined; // not to be modified directly, only through model initialization
        this._isAlive = true;
        this.isDetaching = false;
        this.autoUnbox = true; // Read the value instead of the Node
        this.patchSubscribers = [];
        this.unbox = function (childNode) {
            if (childNode && _this.autoUnbox === true)
                return childNode.value;
            return childNode;
        };
        this.type = type;
        this._parent = parent;
        this.subPath = subPath;
        /* 1 - Init an empty instance of the type. If the type is an primitive type it will get its value.
         * If it it an object return {}, if it is an array it return  [], etc...
         * We also test if the node ref could be attached to the type. // todo put this as a static prop of the type */
        this.data = initBaseType(initialValue);
        /* 2 - Add a reference to this node to the data. This will allow to recognize this value as a Node
         * and use functions like restore, snapshot, type check, etc.
         * If it is a primitive type, the node ref is stored in the parent as a leaf.
         */
        if (canAttachNode(this.data))
            utils_1.addHiddenFinalProp(this.data, "$node", this);
        if (this.isRoot)
            this.identifierCache = new IdentifierCache_1.IdentifierCache();
        var sawExceptions = true;
        try {
            /* 3 - Build and hydration phase. */
            if (!utils_1.isPrimitive(this.data))
                buildType(this, initialValue); // For object
            else if (utils_1.isPrimitive(this.data) && !parent) {
                // todo generate boxed observable for primitive
            }
            /* 4 - Add this node to the cache. The cache located in the root.
             * It is used to quickly retrieve a node based on its Identifier instead of crawling the tree.
             */
            if (this.isRoot)
                this.identifierCache.addNodeToCache(this);
            else
                this.root.identifierCache.addNodeToCache(this);
            sawExceptions = false;
        }
        finally {
            if (sawExceptions)
                this._isAlive = false;
        }
    }
    Node.prototype.applyPatches = function (patches) {
        var _this = this;
        patches.forEach(function (patch) {
            var parts = jsonPatch_1.splitJsonPath(patch.path);
            var node = utils_1.resolvePath(_this, parts.slice(0, -1));
            node.applyPatchLocally(parts[parts.length - 1], patch);
        });
    };
    Node.prototype.applySnapshot = function (snapshot) {
        var _this = this;
        mobx_1.transaction(function () {
            if (snapshot !== _this.snapshot)
                _this.type.applySnapshot(_this, snapshot);
        });
    };
    Object.defineProperty(Node.prototype, "snapshot", {
        get: function () {
            return this.type.getSnapshot(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isRoot", {
        get: function () {
            return this.parent === null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isAlive", {
        get: function () {
            return this._isAlive;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "root", {
        get: function () {
            // future optimization: store root ref in the node and maintain it
            var p, r = this;
            while ((p = r.parent))
                r = p;
            return r;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "value", {
        get: function () {
            if (!this.isAlive)
                return undefined;
            return this.type.getValue(this);
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.getChildNode = function (subPath) {
        this.assertAlive();
        this.autoUnbox = false;
        var r = this.type.getChildNode(this, subPath);
        this.autoUnbox = true;
        return r;
    };
    Object.defineProperty(Node.prototype, "children", {
        get: function () {
            this.assertAlive();
            this.autoUnbox = false;
            var res = this.type.getChildren(this);
            this.autoUnbox = true;
            return res;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "identifier", {
        get: function () {
            return this.identifierAttribute ? this.data[this.identifierAttribute] : null;
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.applyPatchLocally = function (subpath, patch) {
        this.assertAlive();
        this.type.applyPatchLocally(this, subpath, patch);
    };
    Node.prototype.onPatch = function (handler) {
        return utils_1.registerEventHandler(this.patchSubscribers, handler);
    };
    Node.prototype.emitPatch = function (basePatch, source) {
        if (this.patchSubscribers.length) {
            var localizedPatch = utils_1.extend({}, basePatch, {
                path: source.path.substr(this.path.length) + "/" + basePatch.path // calculate the relative path of the patch
            });
            var _a = jsonPatch_1.splitPatch(localizedPatch), patch_1 = _a[0], reversePatch_1 = _a[1];
            this.patchSubscribers.forEach(function (f) { return f(patch_1, reversePatch_1); });
        }
        if (this.parent)
            this.parent.emitPatch(basePatch, source);
    };
    Object.defineProperty(Node.prototype, "path", {
        get: function () {
            return this.parent ? this.parent.path + "/" + utils_1.escapeJsonPath(this.subPath) : "";
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.removeChild = function (subPath) {
        // todo implement removeChild
    };
    Node.prototype.detach = function () {
        if (!this.isAlive)
            utils_1.fail("Error while detaching, node is not alive.");
        if (this.isRoot)
            return;
        else {
            this.isDetaching = true;
            this.identifierCache = this.root.identifierCache.splitCache(this);
            this.parent.removeChild(this.subPath);
            this._parent = null;
            this.subPath = "";
            this.isDetaching = false;
        }
    };
    Node.prototype.assertAlive = function () {
        if (!this.isAlive)
            utils_1.fail(this + " cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value.");
    };
    Node.prototype.beforeDestroy = function () { };
    Node.prototype.remove = function () {
        if (this.isDetaching)
            return;
        if (isInstance(this.data)) {
            // 1 - Warn every other descendant nodes that a node will be removed.
            utils_1.walk(this.data, function (child) { return getNode(child).beforeDestroy(); });
            // 2 - Destroy this node and all this children
            utils_1.walk(this.data, function (child) { return getNode(child).destroy(); });
        }
    };
    Node.prototype.destroy = function () {
        // invariant: not called directly but from "die"
        this.root.identifierCache.notifyDied(this);
        var self = this;
        var oldPath = this.path;
        // kill the computed prop and just store the last snapshot
        Object.defineProperty(this, "snapshot", {
            enumerable: true,
            writable: false,
            configurable: true,
            value: this.snapshot
        });
        this._isAlive = false;
        this._parent = null;
        this.subPath = "";
        // This is quite a hack, once interceptable objects / arrays / maps are extracted from mobx,
        // we could express this in a much nicer way
        Object.defineProperty(this.data, "$mobx", {
            get: function () {
                utils_1.fail("This object has died and is no longer part of a state tree. It cannot be used anymore. The object (of type '" + self.type.name + "') used to live at '" + oldPath + "'. It is possible to access the last snapshot of this object using 'getSnapshot', or to create a fresh copy using 'clone'. If you want to remove an object from the tree without killing it, use 'detach' instead.");
            }
        });
    };
    Node.prototype.setParent = function (newParent, subPath) {
        if (subPath === void 0) { subPath = null; }
        if (this.parent === newParent && this.subPath === subPath)
            return;
        if (newParent) {
            if (this.parent && newParent !== this.parent)
                utils_1.fail("A node cannot exists twice in the state tree. Failed to add " + this + " to path '" + newParent.path + "/" + subPath + "'.");
            if (!this.parent && newParent.root === this)
                utils_1.fail("A state tree is not allowed to contain itself. Cannot assign " + this + " to path '" + newParent.path + "/" + subPath + "'");
        }
        if (this.parent && !newParent) {
            this.remove();
        }
        else {
            this.subPath = subPath || "";
            if (newParent && newParent !== this.parent) {
                newParent.root.identifierCache.mergeCache(this);
                this._parent = newParent;
            }
        }
    };
    Node.prototype.getChildType = function (key) {
        return this.type.getChildType(key);
    };
    __decorate([
        mobx_1.observable
    ], Node.prototype, "_parent", void 0);
    __decorate([
        mobx_1.action
    ], Node.prototype, "applyPatches", null);
    __decorate([
        mobx_1.computed
    ], Node.prototype, "snapshot", null);
    __decorate([
        mobx_1.computed
    ], Node.prototype, "root", null);
    __decorate([
        mobx_1.computed
    ], Node.prototype, "value", null);
    __decorate([
        mobx_1.computed
    ], Node.prototype, "children", null);
    __decorate([
        mobx_1.computed
    ], Node.prototype, "path", null);
    return Node;
}());
exports.Node = Node;
/**
 * Get the internal Instance object of a runtime Instance.
 * @param value
 * @return {Node}
 */
function getNode(value) {
    if (isInstance(value))
        return value.$node;
    else
        throw new Error("Value " + value + " is not a tree Node");
}
exports.getNode = getNode;
/**
 * Returns true if the given value is a instance in a tree.
 * More precisely, that is, if the value is an instance of a
 * `types.model`, `types.array` or `types.map`.
 *
 * @export
 * @param {*} value
 * @returns {boolean}
 */
function isInstance(value) {
    return !!(value && value.$node);
}
exports.isInstance = isInstance;
function createNode(type, parent, subPath, initialValue, createEmptyInstance, hydrateInstance) {
    if (createEmptyInstance === void 0) { createEmptyInstance = utils_1.identity; }
    if (hydrateInstance === void 0) { hydrateInstance = function () {
    }; }
    if (isInstance(initialValue)) {
        var targetNode = getNode(initialValue);
        if (!targetNode.isRoot)
            utils_1.fail("Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '" + (parent
                ? parent.path
                : "") + "/" + subPath + "', but it lives already at '" + targetNode.path + "'");
        targetNode.setParent(parent, subPath);
        return targetNode;
    }
    return new Node(type, parent, subPath, initialValue, createEmptyInstance, hydrateInstance);
}
exports.createNode = createNode;
function canAttachNode(value) {
    return (value &&
        typeof value === "object" &&
        !(value instanceof Date) &&
        !isInstance(value) &&
        !Object.isFrozen(value));
}
exports.canAttachNode = canAttachNode;
/**
 * Convert a value to a node at given parent and subpath. attempts to reuse old node if possible and given
 * @param {IType<any, any>} childType
 * @param {Node} parent
 * @param {string} subpath
 * @param newValue
 * @param {Node} oldNode
 * @return {any}
 */
function valueAsNode(childType, parent, subpath, newValue, oldNode) {
    // the new value has a MST node
    if (isInstance(newValue)) {
        var child = getNode(newValue);
        child.assertAlive();
        // the node lives here
        if (child.parent !== null && child.parent === parent) {
            child.setParent(parent, subpath);
            // todo die here
            if (oldNode && oldNode !== child)
                oldNode.remove();
            return child;
        }
    }
    // there is old node and new one is a value/snapshot
    if (oldNode) {
        var child = childType.reconcile(oldNode, newValue);
        child.setParent(parent, subpath);
        return child;
    }
    // nothing to do, create from scratch
    return childType.instantiate(parent, subpath, newValue);
}
exports.valueAsNode = valueAsNode;
/**
 * Return true if if the value is the Instance or a snapshot of the Node.
 * @param {Instance} node
 * @param value
 * @return {boolean}
 */
function areSame(node, value) {
    // the new value has the same node
    if (isInstance(value)) {
        return getNode(value) === node;
    }
    // the provided value is the snapshot of the node
    if (utils_1.isMutable(value) && node.snapshot === value)
        return true;
    // new value is a snapshot with the correct identifier
    return !!(node.identifier !== null &&
        node.identifierAttribute &&
        utils_1.isPlainObject(value) &&
        value[node.identifierAttribute] === node.identifier);
}
exports.areSame = areSame;
//# sourceMappingURL=Node.js.map