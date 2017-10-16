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
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(subtype) {
        return _super.call(this, subtype.name) || this;
    }
    ArrayType.prototype.isValidSnapshot = function (value) {
        return undefined;
    };
    ArrayType.prototype.serialize = function (instance) {
        return undefined;
    };
    ArrayType.prototype.instantiate = function (initialValue) {
        return undefined;
    };
    ArrayType.prototype.isValidSnapshot = function (value) {
        throw new Error("Method not implemented.");
    };
    return ArrayType;
}(Type_1.ComplexType));
exports.ArrayType = ArrayType;
//# sourceMappingURL=Array.js.map