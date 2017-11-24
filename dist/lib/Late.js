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
var typeFlags_1 = require("../api/typeFlags");
var Type_1 = require("../api/Type");
var Late = /** @class */ (function (_super) {
    __extends(Late, _super);
    function Late(name, definition) {
        var _this = _super.call(this, name) || this;
        _this._subType = null;
        _this.definition = definition;
        return _this;
    }
    Object.defineProperty(Late.prototype, "flags", {
        get: function () {
            return this.subType.flag | typeFlags_1.TypeFlag.Late;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Late.prototype, "subType", {
        get: function () {
            if (this._subType === null) {
                this._subType = this.definition();
            }
            return this._subType;
        },
        enumerable: true,
        configurable: true
    });
    Late.prototype.instantiate = function (parent, subPath, snapshot) {
        return this.subType.instantiate(parent, subPath, snapshot);
    };
    Late.prototype.getSnapshot = function (node) {
        return this.subType.getSnapshot(node);
    };
    Late.prototype.getChildren = function (node) {
        return this.subType.getChildren(node);
    };
    Late.prototype.reconcile = function (current, newValue) {
        return this.subType.reconcile(current, newValue);
    };
    Late.prototype.describe = function () {
        return this.subType.name;
    };
    Late.prototype.isValidSnapshot = function (value) {
        return this.subType.validate(value);
    };
    Late.prototype.isAssignableFrom = function (type) {
        return this.subType.isAssignableFrom(type);
    };
    return Late;
}(Type_1.Type));
exports.Late = Late;
//# sourceMappingURL=Late.js.map