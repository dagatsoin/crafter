"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var union_1 = require("./union");
var optional_1 = require("./optional");
var primitives_1 = require("./primitives");
var optionalNullType = optional_1.optional(primitives_1.nullType, null);
/**
 * Maybe will make a type nullable, and also null by default.
 *
 * @export
 * @alias types.maybe
 * @template S
 * @template T
 * @param {IType<S, T>} type The type to make nullable
 * @returns {(IType<S | null | undefined, T | null>)}
 */
function maybe(type) {
    return union_1.union(optionalNullType, type);
}
exports.maybe = maybe;
//# sourceMappingURL=maybe.js.map