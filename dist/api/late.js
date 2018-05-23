"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../lib/utils");
var late_1 = require("../lib/late");
/**
 * Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies.
 * Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.
 * You need to declare an interface to explicit the return type of the late parameter function.
 *
 * @example
 *  interface INode {
 *       childs: INode[]
 *  }
 *
 *   // TypeScript is'nt smart enough to infer self referencing types.
 *  const Node = types.model({
 *       childs: types.optional(types.array(types.late<any, INode>(() => Node)), [])
 *  })
 *
 * @export
 * @alias types.late
 * @template S
 * @template T
 * @param {string} [name] The name to use for the type that will be returned.
 * @param {ILateType<S, T>} type A function that returns the type that will be defined.
 * @returns {IType<S, T>}
 */
function late(nameOrType, maybeType) {
    var name = typeof nameOrType === "string" ? nameOrType : "late(" + nameOrType.toString() + ")";
    var type = typeof nameOrType === "string" ? maybeType : nameOrType;
    utils_1.assertType(type, "function");
    return new late_1.Late(name, type);
}
exports.late = late;
//# sourceMappingURL=late.js.map