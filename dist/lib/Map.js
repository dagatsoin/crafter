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
var mobx_1 = require("mobx");
var utils_1 = require("./utils");
var Type_1 = require("../api/Type");
var TypeFlags_1 = require("../api/TypeFlags");
var Node_1 = require("./core/Node");
function mapToString() {
    return Node_1.getNode(this) + "(" + this.size + " items)";
}
exports.mapToString = mapToString;
function put(value) {
    if (!value)
        fail("Map.put cannot be used to set empty values");
    var node;
    if (Node_1.isInstance(value)) {
        node = Node_1.getNode(value);
    }
    else if (utils_1.isMutable(value)) {
        var targetType = Node_1.getNode(this).type.subType;
        node = Node_1.getNode(targetType.create(value));
    }
    else {
        return fail("Map.put can only be used to store complex values");
    }
    if (!node.identifierAttribute)
        fail("Map.put can only be used to store complex values that have an identifier type attribute");
    this.set(node.identifier, node.value);
    return this;
}
var MapType = /** @class */ (function (_super) {
    __extends(MapType, _super);
    function MapType(name, subType) {
        var _this = _super.call(this, name) || this;
        _this.shouldAttachNode = true;
        _this.flags = TypeFlags_1.TypeFlag.Map;
        _this.createNewInstance = function () {
            // const identifierAttr = getIdentifierAttribute(this.subType)
            var map = mobx_1.observable.shallowMap();
            utils_1.addHiddenFinalProp(map, "put", put);
            utils_1.addHiddenFinalProp(map, "toString", mapToString);
            return map;
        };
        _this.finalizeNewInstance = function (node, snapshot) {
            var instance = node.data;
            mobx_1.extras.interceptReads(instance, node.unbox);
            mobx_1.intercept(instance, function (c) { return _this.willChange(c); });
            node.applySnapshot(snapshot);
            mobx_1.observe(instance, _this.didChange);
        };
        _this.subType = subType;
        return _this;
    }
    MapType.prototype.instantiate = function (parent, subPath, initialValue) {
        return Node_1.createNode(this, parent, subPath, initialValue, this.createNewInstance, this.finalizeNewInstance);
    };
    MapType.prototype.describe = function () {
        return "Map<string, " + this.subType.describe() + ">";
    };
    MapType.prototype.getChildren = function (node) {
        return node.data.values();
    };
    MapType.prototype.getChildNode = function (node, key) {
        var childNode = node.data.get(key);
        if (!childNode)
            fail("Not a child " + key);
        return childNode;
    };
    MapType.prototype.willChange = function (change) {
        var node = Node_1.getNode(change.object);
        switch (change.type) {
            case "update":
                {
                    var newValue = change.newValue;
                    var oldValue = change.object.get(change.name);
                    if (newValue === oldValue)
                        return null;
                    utils_1.assertType(newValue, this.subType);
                    change.newValue = this.subType.reconcile(node.getChildNode(change.name), change.newValue);
                    this.verifyIdentifier(change.name, change.newValue);
                }
                break;
            case "add":
                {
                    utils_1.assertType(change.newValue, this.subType);
                    change.newValue = this.subType.instantiate(node, change.name, change.newValue);
                    this.verifyIdentifier(change.name, change.newValue);
                }
                break;
        }
        return change;
    };
    MapType.prototype.verifyIdentifier = function (expected, node) {
        var identifier = node.identifier;
        if (identifier !== null && "" + identifier !== "" + expected)
            fail("A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '" + identifier + "', but expected: '" + expected + "'");
    };
    MapType.prototype.getValue = function (node) {
        return node.data;
    };
    MapType.prototype.getSnapshot = function (node) {
        var res = {};
        node.children.forEach(function (childNode) {
            res[childNode.subPath] = childNode.snapshot;
        });
        return res;
    };
    MapType.prototype.didChange = function (change) {
        var node = Node_1.getNode(change.object);
        switch (change.type) {
            case "update":
                return void node.emitPatch({
                    op: "replace",
                    path: utils_1.escapeJsonPath(change.name),
                    value: change.newValue.snapshot,
                    oldValue: change.oldValue ? change.oldValue.snapshot : undefined
                }, node);
            case "add":
                return void node.emitPatch({
                    op: "add",
                    path: utils_1.escapeJsonPath(change.name),
                    value: change.newValue.snapshot,
                    oldValue: undefined
                }, node);
            case "delete":
                // a node got deleted, get the old snapshot and make the node die
                var oldSnapshot = change.oldValue.snapshot;
                change.oldValue.die();
                // emit the patch
                return void node.emitPatch({
                    op: "remove",
                    path: utils_1.escapeJsonPath(change.name),
                    oldValue: oldSnapshot
                }, node);
        }
    };
    MapType.prototype.applyPatchLocally = function (node, subpath, patch) {
        var target = node.data;
        switch (patch.op) {
            case "add":
            case "replace":
                target.set(subpath, patch.value);
                break;
            case "remove":
                target.delete(subpath);
                break;
        }
    };
    MapType.prototype.applySnapshot = function (node, snapshot) {
        utils_1.assertType(snapshot, this);
        var target = node.data;
        var currentKeys = {};
        target.keys().forEach(function (key) {
            currentKeys[key] = false;
        });
        // Don't use target.replace, as it will throw all existing items first
        Object.keys(snapshot).forEach(function (key) {
            target.set(key, snapshot[key]);
            currentKeys[key] = true;
        });
        Object.keys(currentKeys).forEach(function (key) {
            if (currentKeys[key] === false)
                target.delete(key);
        });
    };
    MapType.prototype.getChildType = function (key) {
        return this.subType;
    };
    MapType.prototype.isValidSnapshot = function (value) {
        var _this = this;
        return utils_1.isPlainObject(value) ? Object.keys(value).every(function (path) { return _this.subType.validate(value[path]); }) : false;
    };
    MapType.prototype.getDefaultSnapshot = function () {
        return {};
    };
    MapType.prototype.removeChild = function (node, subpath) {
        node.data.delete(subpath);
    };
    return MapType;
}(Type_1.ComplexType));
exports.MapType = MapType;
//# sourceMappingURL=Map.js.map