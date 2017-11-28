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
var Frozen = /** @class */ (function (_super) {
    __extends(Frozen, _super);
    function Frozen() {
        var _this = _super.call(this, "frozen") || this;
        _this.flag = TypeFlags_1.TypeFlag.Frozen;
        return _this;
    }
    Frozen.prototype.describe = function () {
        return "<any immutable value>";
    };
    Frozen.prototype.instantiate = function (parent, subpath, value) {
        return Node_1.createNode(this, parent, subpath, value);
    };
    Frozen.prototype.isValidSnapshot = function (value) {
        return typeof value !== "function";
    };
    Frozen.prototype.getSnapshot = function (node) {
        throw new Error("Method not implemented.");
    };
    Frozen.prototype.getChildren = function (node) {
        throw new Error("Method not implemented.");
    };
    return Frozen;
}(Type_1.Type));
exports.Frozen = Frozen;
//# sourceMappingURL=frozen.js.map