"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Union_1 = require("./Union");
var Optional_1 = require("./Optional");
var Primitives_1 = require("./Primitives");
var optionalNullType = Optional_1.optional(Primitives_1.nullType, null);
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
    return Union_1.union(optionalNullType, type);
}
exports.maybe = maybe;
//# sourceMappingURL=maybe.js.map