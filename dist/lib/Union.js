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
var type_1 = require("../api/type");
var typeFlags_1 = require("../api/typeFlags");
var Union = /** @class */ (function (_super) {
    __extends(Union, _super);
    function Union(name, types, dispatcher) {
        var _this = _super.call(this, name) || this;
        _this.dispatcher = null;
        _this.dispatcher = dispatcher;
        _this.types = types;
        return _this;
    }
    Union.prototype.getSnapshot = function (node) {
        return node.data;
    };
    Union.prototype.getChildren = function (node) {
        return [];
    };
    Object.defineProperty(Union.prototype, "flag", {
        get: function () {
            var result = typeFlags_1.TypeFlag.Union;
            this.types.forEach(function (type) {
                result |= type.flag;
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Union.prototype.isAssignableFrom = function (type) {
        return this.types.some(function (subType) { return subType.isAssignableFrom(type); });
    };
    Union.prototype.describe = function () {
        return "(" + this.types.map(function (factory) { return factory.describe(); }).join(" | ") + ")";
    };
    Union.prototype.instantiate = function (parent, subPath, initialValue) {
        return this.determineType(initialValue).instantiate(parent, subPath, initialValue);
    };
    Union.prototype.reconcile = function (current, newValue) {
        return this.determineType(newValue).reconcile(current, newValue);
    };
    Union.prototype.determineType = function (value) {
        // try the dispatcher, if defined
        if (this.dispatcher !== null) {
            return this.dispatcher(value);
        }
        // find the most accomodating type
        var applicableTypes = this.types.filter(function (type) { return type.is(value); });
        if (applicableTypes.length > 1)
            return utils_1.fail("Ambiguos snapshot " + JSON.stringify(value) + " for union " + this
                .name + ". Please provide a dispatch in the union declaration.");
        return applicableTypes[0];
    };
    Union.prototype.isValidSnapshot = function (value) {
        if (this.dispatcher !== null) {
            return this.dispatcher(value).validate(value);
        }
        return true;
    };
    return Union;
}(type_1.Type));
exports.Union = Union;
//# sourceMappingURL=union.js.map