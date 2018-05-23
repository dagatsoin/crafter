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
var typeFlags_1 = require("../api/typeFlags");
var node_1 = require("./core/node");
var Refinement = /** @class */ (function (_super) {
    __extends(Refinement, _super);
    function Refinement(name, type, predicate, message) {
        var _this = _super.call(this, name) || this;
        _this.type = type;
        _this.predicate = predicate;
        _this.message = message;
        return _this;
    }
    Refinement.prototype.getSnapshot = function (node) {
        return node.data;
    };
    Object.defineProperty(Refinement.prototype, "flag", {
        get: function () {
            return this.type.flag | typeFlags_1.TypeFlag.Refinement;
        },
        enumerable: true,
        configurable: true
    });
    Refinement.prototype.getChildren = function (node) {
        return [];
    };
    Refinement.prototype.describe = function () {
        return this.name;
    };
    Refinement.prototype.instantiate = function (parent, subPath, value) {
        return this.type.instantiate(parent, subPath, value);
    };
    Refinement.prototype.isAssignableFrom = function (type) {
        return this.type.isAssignableFrom(type);
    };
    Refinement.prototype.isValidSnapshot = function (value) {
        if (!this.type.validate(value))
            return false;
        return this.predicate(node_1.isInstance(value) ? node_1.getNode(value).snapshot : value);
    };
    return Refinement;
}(type_1.Type));
exports.Refinement = Refinement;
//# sourceMappingURL=refinement.js.map