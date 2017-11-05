"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Reference_1 = require("../lib/Reference");
var utils_1 = require("../lib/utils");
/**
 * Creates a reference to another type, which should have defined an identifier.
 *
 * @export
 * @alias types.reference
 */
function reference(subType) {
    utils_1.assertType(subType, "Type");
    return new Reference_1.ReferenceType(subType);
}
exports.reference = reference;
//# sourceMappingURL=Reference.js.map