"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../lib/utils");
var TypeFlags_1 = require("./TypeFlags");
var Union_1 = require("../lib/Union");
/**
 * types.union(dispatcher?, types...) create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form (snapshot) => Type.
 *
 * @export
 * @alias types.union
 * @param {(ITypeDispatcher | IType<any, any>)} dispatchOrType
 * @param {...IType<any, any>[]} otherTypes
 * @returns {IType<any, any>}
 */
function union(dispatchOrType) {
    var otherTypes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        otherTypes[_i - 1] = arguments[_i];
    }
    var dispatcher = TypeFlags_1.isType(dispatchOrType) ? null : dispatchOrType;
    var types = TypeFlags_1.isType(dispatchOrType) ? otherTypes.concat(dispatchOrType) : otherTypes;
    var name = "(" + types.map(function (type) { return type.name; }).join(" | ") + ")";
    // check all options
    if (process.env.NODE_ENV !== "production") {
        types.forEach(function (type) {
            if (!TypeFlags_1.isType(type))
                utils_1.fail("expected all possible types to be a mobx-state-tree type, got " +
                    type +
                    " instead");
        });
    }
    return new Union_1.Union(name, types, dispatcher);
}
exports.union = union;
//# sourceMappingURL=Union.js.map