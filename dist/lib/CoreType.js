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
var utils_1 = require("./utils");
var node_1 = require("./core/node");
/**
 * From MST implementation https://github.com/mobxjs/mobx-state-tree/blob/master/src/types/primitives.ts
 */
var CoreType = /** @class */ (function (_super) {
    __extends(CoreType, _super);
    function CoreType(name, typeFlag, checker, initializer) {
        if (initializer === void 0) { initializer = utils_1.identity; }
        var _this = _super.call(this, name) || this;
        _this.checker = checker;
        _this.flag = typeFlag;
        _this.initializer = initializer;
        return _this;
    }
    CoreType.prototype.describe = function () {
        return this.name;
    };
    CoreType.prototype.instantiate = function (parent, subPath, initialValue) {
        if (!this.checker(initialValue))
            utils_1.fail("Error while instantiating " + this.name + ". Expected a " + this.name + ", got " + initialValue + " ");
        return node_1.createNode(this, parent, subPath, initialValue, this.initializer);
    };
    CoreType.prototype.isValidSnapshot = function (value) {
        return utils_1.isPrimitive(value) && this.checker(value);
    };
    CoreType.prototype.getSnapshot = function (node) {
        return node.data;
    };
    CoreType.prototype.applySnapshot = function (node, snapshot) {
        throw new Error("Method not implemented.");
    };
    CoreType.prototype.getDefaultSnapshot = function () {
        return [];
    };
    /**
     * Return an empty array of Instance because primitive can't have children.
     * @return {Array<Node>}
     */
    CoreType.prototype.getChildren = function (node) {
        return [];
    };
    return CoreType;
}(type_1.Type));
exports.CoreType = CoreType;
//# sourceMappingURL=coreType.js.map