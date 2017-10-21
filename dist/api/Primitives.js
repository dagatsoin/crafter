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
var Type_1 = require("./Type");
var Instance_1 = require("../lib/Instance");
/**
 * From MST implementation https://github.com/mobxjs/mobx-state-tree/blob/master/src/types/primitives.ts
 */
var CoreType = /** @class */ (function (_super) {
    __extends(CoreType, _super);
    function CoreType(name, checker, initializer) {
        if (initializer === void 0) { initializer = utils_1.identity; }
        var _this = _super.call(this, name) || this;
        _this.checker = checker;
        _this.initializer = initializer;
        return _this;
    }
    CoreType.prototype.instantiate = function (snapshot) {
        return Instance_1.createInstance(this, snapshot, this.initializer);
    };
    CoreType.prototype.isValidSnapshot = function (value) {
        return utils_1.isPrimitive(value) && this.checker(value);
    };
    CoreType.prototype.getSnapshot = function (instance) {
        return instance.storedValue;
    };
    CoreType.prototype.applySnapshot = function (instance, snapshot) {
        throw new Error("Method not implemented.");
    };
    /**
     * Return an empty array of Instance because primitive can't have children.
     * @return {Array<Instance>}
     */
    CoreType.prototype.getChildren = function (instance) {
        return [];
    };
    return CoreType;
}(Type_1.Type));
exports.CoreType = CoreType;
/**
 * Creates a type that can only contain a string value.
 * This type is used for string values by default
 *
 * @export
 * @alias types.string
 * @example
 * const Person = types.model({
 *   firstName: types.string,
 *   lastName: "Doe"
 * })
 */
// tslint:disable-next-line:variable-name
exports.string = new CoreType("string", function (v) { return typeof v === "string"; });
/**
 * Creates a type that can only contain a numeric value.
 * This type is used for numeric values by default
 *
 * @export
 * @alias types.number
 * @example
 * const Vector = types.model({
 *   x: types.number,
 *   y: 0
 * })
 */
// tslint:disable-next-line:variable-name
exports.number = new CoreType("number", function (v) { return typeof v === "number"; });
/**
 * Creates a type that can only contain a boolean value.
 * This type is used for boolean values by default
 *
 * @export
 * @alias types.boolean
 * @example
 * const Thing = types.model({
 *   isCool: types.boolean,
 *   isAwesome: false
 * })
 */
// tslint:disable-next-line:variable-name
exports.boolean = new CoreType("boolean", function (v) { return typeof v === "boolean"; });
function getPrimitiveFactoryFromValue(value) {
    switch (typeof value) {
        case "string":
            return exports.string;
        case "number":
            return exports.number;
        case "boolean":
            return exports.boolean;
    }
    return utils_1.fail("Cannot determine primtive type from value " + value);
}
exports.getPrimitiveFactoryFromValue = getPrimitiveFactoryFromValue;
//# sourceMappingURL=Primitives.js.map