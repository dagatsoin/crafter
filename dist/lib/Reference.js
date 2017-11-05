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
var utils_1 = require("./utils");
var Node_1 = require("./core/Node");
var Type_1 = require("../api/Type");
var TypeFlags_1 = require("../api/TypeFlags");
var StoredReference = /** @class */ (function () {
    function StoredReference(mode, value) {
        this.mode = mode;
        this.value = value;
        if (mode === "object") {
            if (!Node_1.isInstance(value))
                utils_1.fail("Can only store references to tree nodes, got: '" + value + "'");
            var targetNode = Node_1.getNode(value);
            if (!targetNode.identifierAttribute)
                utils_1.fail("Can only store references with a defined identifier attribute.");
        }
    }
    return StoredReference;
}());
var ReferenceType = /** @class */ (function (_super) {
    __extends(ReferenceType, _super);
    function ReferenceType(targetType) {
        var _this = _super.call(this, "reference(" + targetType.name + ")") || this;
        _this.targetType = targetType;
        _this.flags = TypeFlags_1.TypeFlag.Reference;
        return _this;
    }
    ReferenceType.prototype.describe = function () {
        return this.name;
    };
    ReferenceType.prototype.getValue = function (node) {
        var ref = node.data;
        if (ref.mode === "object")
            return ref.value;
        if (!node.isAlive)
            return undefined;
        // reference was initialized with the identifier of the target
        var target = node.root.identifierCache.resolve(this.targetType, ref.value);
        if (!target)
            return utils_1.fail("Failed to resolve reference of type " + this.targetType
                .name + ": '" + ref.value + "' (in: " + node.path + ")");
        return target.value;
    };
    ReferenceType.prototype.getSnapshot = function (node) {
        var ref = node.data;
        switch (ref.mode) {
            case "identifier":
                return ref.value;
            case "object":
                return Node_1.getNode(ref.value).identifier;
        }
    };
    ReferenceType.prototype.instantiate = function (parent, subPath, snapshot) {
        var isComplex = Node_1.isInstance(snapshot);
        return Node_1.createNode(this, parent, subPath, new StoredReference(isComplex ? "object" : "identifier", snapshot));
    };
    ReferenceType.prototype.reconcile = function (current, newValue) {
        var targetMode = Node_1.isInstance(newValue) ? "object" : "identifier";
        if (utils_1.isReferenceType(current.type)) {
            var ref = current.data;
            if (targetMode === ref.mode && ref.value === newValue)
                return current;
        }
        var newNode = this.instantiate(current.parent, current.subPath, newValue);
        current.remove();
        return newNode;
    };
    ReferenceType.prototype.isAssignableFrom = function (type) {
        return this.targetType.isAssignableFrom(type);
    };
    ReferenceType.prototype.isValidSnapshot = function (value) {
        return (typeof value === "string" || typeof value === "number")
            || (Node_1.isInstance(value) && this.targetType.isAssignableFrom(Node_1.getNode(value).type));
    };
    ReferenceType.prototype.getChildren = function (node) {
        return [];
    };
    return ReferenceType;
}(Type_1.Type));
exports.ReferenceType = ReferenceType;
/**
 * Creates a reference to another type, which should have defined an identifier.
 * See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.
 *
 * @export
 * @alias types.reference
 */
function reference(subType) {
    // check that a type is given
    utils_1.assertType(subType, "Type");
    return new ReferenceType(subType);
}
exports.reference = reference;
//# sourceMappingURL=Reference.js.map