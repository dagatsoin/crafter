"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("../api/type");
var utils_1 = require("./utils");
var mobx_1 = require("mobx");
var node_1 = require("./core/node");
var typeFlags_1 = require("../api/typeFlags");
function arrayToString() {
    return node_1.getNode(this) + "(" + this.length + " items)";
}
exports.arrayToString = arrayToString;
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(name, itemType) {
        var _this = _super.call(this, name) || this;
        _this.flag = typeFlags_1.TypeFlag.Array;
        _this.createEmptyInstance = function (snapshot) {
            var array = mobx_1.observable.shallowArray();
            utils_1.addHiddenFinalProp(array, "toString", arrayToString);
            return array;
        };
        _this.buildInstance = function (node, snapshot) {
            mobx_1.extras.getAdministration(node.data).dehancer = node.unbox;
            mobx_1.intercept(node.data, function (change) { return _this.willChange(change); });
            node.applySnapshot(snapshot);
            mobx_1.observe(node.data, _this.didChange);
        };
        _this.itemType = itemType;
        return _this;
    }
    ArrayType.prototype.describe = function () {
        return this.itemType.describe() + "[]";
    };
    ArrayType.prototype.getSnapshot = function (node) {
        return node.children.map(function (childNode) { return childNode.snapshot; });
    };
    ArrayType.prototype.instantiate = function (parent, subPath, initialValue) {
        return node_1.createNode(this, parent, subPath, initialValue, this.createEmptyInstance, this.buildInstance);
    };
    ArrayType.prototype.getDefaultSnapshot = function () {
        return [];
    };
    ArrayType.prototype.isValidSnapshot = function (value) {
        var _this = this;
        return (Array.isArray(value) || mobx_1.isObservableArray(value)) && value.length ?
            value.every(function (item, index) { return _this.itemType.validate(item); }) : true;
    };
    ArrayType.prototype.applySnapshot = function (node, snapshot) {
        var target = node.data;
        target.replace(snapshot);
    };
    ArrayType.prototype.getChildren = function (node) {
        return node.data.peek();
    };
    ArrayType.prototype.getChildNode = function (node, key) {
        var index = parseInt(key, 10);
        if (index < node.data.length)
            return node.data[index];
        return utils_1.fail("Not a child: " + key);
    };
    ArrayType.prototype.applyPatchLocally = function (node, subpath, patch) {
        var target = node.data;
        var index = subpath === "-" ? target.length : parseInt(subpath);
        switch (patch.op) {
            case "replace":
                target[index] = patch.value;
                break;
            case "add":
                target.splice(index, 0, patch.value);
                break;
            case "remove":
                target.splice(index, 1);
                break;
        }
    };
    ArrayType.prototype.willChange = function (change) {
        var node = node_1.getNode(change.object);
        var children = node.children;
        switch (change.type) {
            case "update":
                if (change.newValue === change.object[change.index])
                    return null;
                change.newValue = this.reconcileArrayChildren(node, this.itemType, [children[change.index]], [change.newValue], [change.index])[0].data;
                break;
            case "splice":
                var index_1 = change.index, removedCount = change.removedCount, added = change.added;
                change.added = this.reconcileArrayChildren(node, this.itemType, children.slice(index_1, index_1 + removedCount), added, added.map(function (_, i) { return index_1 + i; }));
                // update paths of remaining items
                for (var i = index_1 + removedCount; i < children.length; i++) {
                    children[i].setParent(node, "" + (i + added.length - removedCount));
                }
                break;
        }
        return change;
    };
    ArrayType.prototype.didChange = function (change) {
        var node = node_1.getNode(change.object);
        switch (change.type) {
            case "update":
                return void node.emitPatch({
                    op: "replace",
                    path: "" + change.index,
                    value: change.newValue.snapshot,
                    oldValue: change.oldValue ? change.oldValue.snapshot : undefined
                }, node);
            case "splice":
                for (var i = change.removedCount - 1; i >= 0; i--)
                    node.emitPatch({
                        op: "remove",
                        path: "" + (change.index + i),
                        oldValue: change.removed[i].snapshot
                    }, node);
                for (var i = 0; i < change.addedCount; i++)
                    node.emitPatch({
                        op: "add",
                        path: "" + (change.index + i),
                        value: node.getChildNode("" + (change.index + i)).snapshot,
                        oldValue: undefined
                    }, node);
                return;
        }
    };
    ArrayType.prototype.reconcileArrayChildren = function (parent, childType, currentNodes, newValues, newPaths) {
        var currentNode, newValue, hasNewNode = false, currentMatch = undefined;
        for (var i = 0;; i++) {
            currentNode = currentNodes[i];
            newValue = newValues[i];
            hasNewNode = i <= newValues.length - 1;
            // both are empty, end
            if (!currentNode && !hasNewNode) {
                break;
                // new one does not exists, old one dies
            }
            else if (!hasNewNode) {
                currentNode.remove();
                currentNodes.splice(i, 1);
                i--;
                // there is no old node, create it
            }
            else if (!currentNode) {
                // check if already belongs to the same parent. if so, avoid pushing item in. only swapping can occur.
                if (node_1.isInstance(newValue) && node_1.getNode(newValue).parent === parent) {
                    // this node is owned by this parent, but not in the reconcilable set, so it must be double
                    utils_1.fail("Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '" + parent.path + newPaths[i] + "', but it lives already at '" + node_1.getNode(newValue).path + "'");
                }
                currentNodes.splice(i, 0, node_1.valueAsNode(childType, parent, "" + newPaths[i], newValue));
                // both are the same, reconcile
            }
            else if (node_1.areSame(currentNode, newValue)) {
                currentNodes[i] = node_1.valueAsNode(childType, parent, "" + newPaths[i], newValue, currentNode);
                // nothing to do, try to reorder
            }
            else {
                currentMatch = undefined;
                // find a possible candidate to reuse
                for (var j = i; j < currentNodes.length; j++) {
                    if (node_1.areSame(currentNodes[j], newValue)) {
                        currentMatch = currentNodes.splice(j, 1)[0];
                        break;
                    }
                }
                currentNodes.splice(i, 0, node_1.valueAsNode(childType, parent, "" + newPaths[i], newValue, currentMatch));
            }
        }
        return currentNodes;
    };
    ArrayType.prototype.getChildType = function (key) {
        return this.itemType;
    };
    return ArrayType;
}(type_1.ComplexType));
exports.ArrayType = ArrayType;
//# sourceMappingURL=array.js.map