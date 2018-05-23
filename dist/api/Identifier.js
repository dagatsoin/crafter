"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var identifier_1 = require("../lib/identifier");
var primitives_1 = require("./primitives");
var typeFlags_1 = require("./typeFlags");
/**
 * Identifiers are used to make references, lifecycle events and reconciling works.
 * Inside a state tree, for each type can exist only one instance for each given identifier.
 * For example there couldn't be 2 instances of user with id 1. If you need more, consider using references.
 * Identifier can be used only as type property of a model.
 * This type accepts as parameter the value type of the identifier field that can be either string or number.
 *
 * @example
 *  const Todo = types.model("Todo", {
 *      id: types.identifier(types.string),
 *      title: types.string
 *  })
 *
 * @export
 * @alias types.identifier
 * @template T
 * @param {IType<T, T>} baseType
 * @returns {IType<T, T>}
 */
function identifier(baseType) {
    if (baseType === void 0) { baseType = primitives_1.string; }
    if (process.env.NODE_ENV !== "production") {
        if (!typeFlags_1.isType(baseType))
            fail("expected a mobx-state-tree type as first argument, got " + baseType + " instead");
    }
    return new identifier_1.IdentifierType(baseType);
}
exports.identifier = identifier;
//# sourceMappingURL=identifier.js.map