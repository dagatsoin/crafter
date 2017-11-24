"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeFlags_1 = require("./TypeFlags");
var Refinement_1 = require("../lib/Refinement");
var utils_1 = require("../lib/utils");
/**
 * `types.refinement(baseType, (snapshot) => boolean)` creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.
 *
 * @export
 * @alias types.refinement
 * @template T
 * @returns {IType<T, T>}
 * @param args
 */
function refinement() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var name = typeof args[0] === "string" ? args.shift() : TypeFlags_1.isType(args[0]) ? args[0].name : null;
    var type = args[0];
    var predicate = args[1];
    var message = args[2]
        ? args[2]
        : function (v) { return "Value does not respect the refinement predicate"; };
    // ensures all parameters are correct
    utils_1.assertType(name, "string", "first");
    utils_1.assertType(type, "Type", "first or second");
    utils_1.assertType(predicate, "function");
    utils_1.assertType(message, "function");
    return new Refinement_1.Refinement(name, type, predicate, message);
}
exports.refinement = refinement;
//# sourceMappingURL=Refinement.js.map