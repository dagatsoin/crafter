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
var mobx_1 = require("mobx");
var Instance_1 = require("./Instance");
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(name, itemType) {
        var _this = _super.call(this, name) || this;
        _this.createEmptyInstance = function (snapshot) {
            return mobx_1.observable.array();
        };
        _this.buildInstance = function (instance, snapshot) {
            if (snapshot && snapshot.length)
                snapshot.forEach(function (item, index) {
                    var subInstance = _this.itemType.instantiate(item);
                    instance.storedValue.push(subInstance.storedValue);
                });
        };
        _this.itemType = itemType;
        return _this;
    }
    ArrayType.prototype.getSnapshot = function (instance) {
        return instance.storedValue.map(function (item) { return item.$instance.snapshot; });
    };
    ArrayType.prototype.instantiate = function (snapshot) {
        return Instance_1.createInstance(this, snapshot, this.createEmptyInstance, this.buildInstance);
    };
    ArrayType.prototype.isValidSnapshot = function (value) {
        var _this = this;
        return value.constructor.name !== "array" ? false : value.some(function (item, index) { return _this.itemType.validate(item); });
    };
    ArrayType.prototype.applySnapshot = function (instance, snapshot) {
        var target = instance.storedValue;
        target.replace(snapshot);
    };
    ArrayType.prototype.getChildren = function (instance) {
        return instance.storedValue.map(function (item) { return item.$instance; });
    };
    return ArrayType;
}(Type_1.ComplexType));
exports.ArrayType = ArrayType;
//# sourceMappingURL=Array.js.map