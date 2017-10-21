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
var utils_1 = require("../lib/utils");
var Type = /** @class */ (function () {
    function Type(name) {
        this.isType = true;
        this.name = name;
    }
    Type.prototype.is = function (thing) {
        throw new Error("Method not implemented.");
    };
    Type.prototype.validate = function (thing) {
        return this.isValidSnapshot(thing);
    };
    Type.prototype.create = function (snapshot) {
        return this.instantiate(snapshot).value;
    };
    Type.prototype.applySnapshot = function (instance, snapshot) {
        utils_1.fail("Error from abstract class Type. Immutable value can't be restored.");
    };
    Type.prototype.getValue = function (instance) {
        return instance.storedValue;
    };
    return Type;
}());
exports.Type = Type;
var ComplexType = /** @class */ (function (_super) {
    __extends(ComplexType, _super);
    function ComplexType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComplexType.prototype.is = function (thing) {
        throw new Error("Method not implemented.");
    };
    ComplexType.prototype.applySnapshot = function (instance, snapshot) {
        utils_1.fail("Immutable types do not support applying snapshots");
    };
    ComplexType.prototype.applyPatch = function (instance, patch) {
        throw new Error("Method not implemented.");
    };
    return ComplexType;
}(Type));
exports.ComplexType = ComplexType;
function isType(value) {
    return typeof value === "object" && value && value.isType === true;
}
exports.isType = isType;
//# sourceMappingURL=Type.js.map