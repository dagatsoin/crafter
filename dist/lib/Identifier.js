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
var Type_1 = require("../api/Type");
var Node_1 = require("./core/Node");
var utils_1 = require("./utils");
var typeFlags_1 = require("../api/typeFlags");
var IdentifierType = /** @class */ (function (_super) {
    __extends(IdentifierType, _super);
    function IdentifierType(identifierType) {
        var _this = _super.call(this, "identifier(" + identifierType.name + ")") || this;
        _this.identifierType = identifierType;
        _this.flag = typeFlags_1.TypeFlag.Identifier;
        return _this;
    }
    IdentifierType.prototype.describe = function () {
        return this.identifierType.describe();
    };
    IdentifierType.prototype.instantiate = function (parent, subPath, snapshot) {
        if (!parent || !Node_1.isInstance(parent.data))
            return utils_1.fail("Identifier types can only be instantiated as direct child of an object type");
        if (parent.identifierAttribute)
            utils_1.fail("Cannot define property '" + subPath + "' as object identifier, property '" + parent.identifierAttribute + "' is already defined as identifier property");
        parent.identifierAttribute = subPath;
        return Node_1.createNode(this, parent, subPath, snapshot);
    };
    IdentifierType.prototype.reconcile = function (current, newValue) {
        if (current.data !== newValue)
            return utils_1.fail("Tried to change identifier from '" + current.data + "' to '" + newValue + "'. Changing identifiers is not allowed.");
        return current;
    };
    IdentifierType.prototype.isValidSnapshot = function (value) {
        if (value === undefined ||
            value === null ||
            typeof value === "string" ||
            typeof value === "number")
            return this.identifierType.validate(value);
        return false;
    };
    IdentifierType.prototype.getSnapshot = function (node) {
        return this.identifierType.getSnapshot(node);
    };
    IdentifierType.prototype.getChildren = function (node) {
        return this.identifierType.getChildren(node);
    };
    return IdentifierType;
}(Type_1.Type));
exports.IdentifierType = IdentifierType;
//# sourceMappingURL=Identifier.js.map