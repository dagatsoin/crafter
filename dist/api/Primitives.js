"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../lib/utils");
var CoreType_1 = require("../lib/CoreType");
var typeFlags_1 = require("./typeFlags");
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
exports.string = new CoreType_1.CoreType("string", typeFlags_1.TypeFlag.String, function (v) { return typeof v === "string"; });
/**
 * The type of the value `null`
 *
 * @export
 * @alias types.null
 */
exports.nullType = new CoreType_1.CoreType("null", typeFlags_1.TypeFlag.Null, function (v) { return v === null; });
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
exports.number = new CoreType_1.CoreType("number", typeFlags_1.TypeFlag.Number, function (v) { return typeof v === "number"; });
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
exports.boolean = new CoreType_1.CoreType("boolean", typeFlags_1.TypeFlag.Boolean, function (v) { return typeof v === "boolean"; });
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