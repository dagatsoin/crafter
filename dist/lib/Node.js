"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var utils_1 = require("./utils");
var Node = /** @class */ (function () {
    function Node(type, parent, subPath, initialValue, initBaseType, buildType) {
        if (initBaseType === void 0) { initBaseType = utils_1.identity; }
        if (buildType === void 0) { buildType = function () {
        }; }
        this.parent = null;
        this.leafs = []; // Refs to the Node of primitives. Primitive value can't have any children and don't hold a reference to their node.
        this.identifierAttribute = undefined; // not to be modified directly, only through model initialization
        this.type = type;
        this.parent = parent;
        this.subPath = subPath;
        /* 1 - Init an empty instance of the type. If the type is an primitive type it will get its value.
         * If it it an object return {}, if it is an array it return  [], etc...
         * We also test if the node ref could be attached to the type. // todo put this as a static prop of the type */
        this.data = initBaseType(initialValue);
        /* 2 - Add a reference to this node to the data. This will allow to recognize this value as a Node
         * and use functions like restore, snapshot, type check, etc.
         * If it is a primitive type, the node ref is stored in the parent as a leaf.
         */
        if (canAttachNode(this.data)) {
            Object.defineProperty(this.data, "$node", {
                enumerable: false,
                writable: false,
                configurable: true,
                value: this,
            });
        }
        else if (parent)
            parent.leafs.push(this);
        /* 3 - Build and hydration phase. */
        if (!utils_1.isPrimitive(this.data))
            buildType(this, initialValue); // For object
        else if (utils_1.isPrimitive(this.data) && !parent) {
            // todo generate boxed observable for primitive
        }
        this.isAlive = true;
    }
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
    Node.prototype.isRoot = function () {
        return areSame(this.root, this);
    };
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
            return this.type.getValue(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "children", {
        get: function () {
            return this.type.getChildren(this);
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
    Object.defineProperty(Node.prototype, "path", {
        get: function () {
            return this.parent ? this.parent.path + "/" + utils_1.escapeJsonPath(this.subPath) : "";
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.assertAlive = function () {
        if (!this.isAlive)
            utils_1.fail(this + " cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value");
    };
    Node.prototype.beforeDestroy = function () { };
    Node.prototype.remove = function () {
        if (this.isDetaching)
            return;
        if (isInstance(this.data)) {
            // 1- Warn every other nodes that a node will be removed.
            utils_1.walk(this.data, function (child) { return getNode(child).beforeDestroy(); });
            // 2- Prevent using this node.
            utils_1.walk(this.data, function (child) { return getNode(child).destroy(); });
        }
    };
    Node.prototype.destroy = function () {
        // invariant: not called directly but from "die"
        // this.root.identifierCache!.notifyDied(this); //todo implement identifier cache
        var self = this;
        var oldPath = this.path;
        // kill the computed prop and just store the last snapshot
        Object.defineProperty(this, "snapshot", {
            enumerable: true,
            writable: false,
            configurable: true,
            value: this.snapshot
        });
        this.isAlive = false;
        this.parent = null;
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
                // newParent.root.identifierCache!.mergeCache(this); //todo implement identifier cache
                this.parent = newParent;
            }
        }
    };
    Node.prototype.getChildType = function (key) {
        return this.type.getChildType(key);
    };
    __decorate([
        mobx_1.observable
    ], Node.prototype, "parent", void 0);
    __decorate([
        mobx_1.observable
    ], Node.prototype, "leafs", void 0);
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
        !(value.data && isInstance(value.data)) &&
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