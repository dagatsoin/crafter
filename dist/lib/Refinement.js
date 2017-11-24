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
var TypeFlags_1 = require("../api/TypeFlags");
var Node_1 = require("./core/Node");
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
            return this.type.flag | TypeFlags_1.TypeFlag.Refinement;
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
        return this.predicate(Node_1.isInstance(value) ? Node_1.getNode(value).snapshot : value);
    };
    return Refinement;
}(Type_1.Type));
exports.Refinement = Refinement;
//# sourceMappingURL=Refinement.js.map