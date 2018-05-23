"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var array_1 = require("../lib/array");
function array(subtype) {
    return new array_1.ArrayType(subtype.name + "[]", subtype);
}
exports.array = array;
//# sourceMappingURL=array.js.map