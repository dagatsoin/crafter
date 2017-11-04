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
    Type.prototype.create = function (snapshot, check) {
        if (check)
            utils_1.assertType(snapshot, this, 0, check);
        return this.instantiate(null, "", snapshot).value;
    };
    Type.prototype.applySnapshot = function (node, snapshot) {
        utils_1.fail("Error from abstract class Type. Immutable value can't be restored.");
    };
    Type.prototype.getValue = function (node) {
        return node.data;
    };
    Type.prototype.reconcile = function (current, newValue) {
        // reconcile only if type and value are still the same
        if (current.type === this && current.data === newValue)
            return current;
        var res = this.instantiate(current.parent, current.subPath, newValue);
        current.remove();
        return res;
    };
    Type.prototype.getChildType = function (key) {
        return utils_1.fail("No child '" + key + "' available in type: " + this.name);
    };
    Type.prototype.isAssignableFrom = function (type) {
        return type === this;
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
    ComplexType.prototype.applySnapshot = function (node, snapshot) {
        utils_1.fail("Immutable types do not support applying snapshots");
    };
    ComplexType.prototype.applyPatch = function (node, patch) {
        throw new Error("Method not implemented.");
    };
    return ComplexType;
}(Type));
exports.ComplexType = ComplexType;
//# sourceMappingURL=Type.js.map