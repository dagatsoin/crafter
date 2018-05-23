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
var node_1 = require("./core/node");
var utils_1 = require("./utils");
var typeFlags_1 = require("../api/typeFlags");
var OptionalValue = /** @class */ (function (_super) {
    __extends(OptionalValue, _super);
    function OptionalValue(type, defaultValue) {
        var _this = _super.call(this, type.name) || this;
        _this.flag = typeFlags_1.TypeFlag.Optional;
        _this.type = type;
        _this.defaultValue = defaultValue;
        return _this;
    }
    OptionalValue.prototype.describe = function () {
        return this.type.describe() + "?";
    };
    OptionalValue.prototype.instantiate = function (parent, subPath, value) {
        if (value === undefined) {
            var defaultValue = this.getDefaultValue();
            var defaultSnapshot = node_1.isInstance(defaultValue)
                ? node_1.getNode(defaultValue).snapshot
                : defaultValue;
            return this.type.instantiate(parent, subPath, defaultSnapshot);
        }
        return this.type.instantiate(parent, subPath, value);
    };
    OptionalValue.prototype.reconcile = function (current, newValue) {
        return this.type.reconcile(current, this.type.is(newValue) ? newValue : this.getDefaultValue());
    };
    OptionalValue.prototype.getDefaultValue = function () {
        var defaultValue = typeof this.defaultValue === "function" ? this.defaultValue() : this.defaultValue;
        if (typeof this.defaultValue === "function")
            utils_1.assertType(this, defaultValue);
        return defaultValue;
    };
    OptionalValue.prototype.isValidSnapshot = function (value) {
        // defaulted values can be skipped
        if (value === undefined)
            return true;
        // bounce validation to the sub-type
        return this.type.validate(value);
    };
    OptionalValue.prototype.getSnapshot = function (node) {
        return this.type.getSnapshot(node);
    };
    OptionalValue.prototype.getChildren = function (node) {
        return this.type.getChildren(node);
    };
    return OptionalValue;
}(type_1.Type));
exports.OptionalValue = OptionalValue;
//# sourceMappingURL=Optional.js.map