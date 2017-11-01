"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Object_1 = require("../lib/Object");
function object() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var name = typeof args[0] === "string" ? args.shift() : "AnonymousModel";
    var properties = args.shift() || {};
    return new Object_1.ObjectType({ name: name, properties: properties });
}
exports.object = object;
//# sourceMappingURL=Object.js.map