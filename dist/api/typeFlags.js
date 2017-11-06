"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeFlag;
(function (TypeFlag) {
    TypeFlag[TypeFlag["String"] = 1] = "String";
    TypeFlag[TypeFlag["Number"] = 2] = "Number";
    TypeFlag[TypeFlag["Boolean"] = 4] = "Boolean";
    TypeFlag[TypeFlag["Date"] = 8] = "Date";
    TypeFlag[TypeFlag["Array"] = 16] = "Array";
    TypeFlag[TypeFlag["Map"] = 32] = "Map";
    TypeFlag[TypeFlag["Object"] = 64] = "Object";
    TypeFlag[TypeFlag["Frozen"] = 128] = "Frozen";
    TypeFlag[TypeFlag["Optional"] = 256] = "Optional";
    TypeFlag[TypeFlag["Reference"] = 512] = "Reference";
    TypeFlag[TypeFlag["Identifier"] = 1024] = "Identifier";
    TypeFlag[TypeFlag["Refinement"] = 2048] = "Refinement";
    TypeFlag[TypeFlag["Union"] = 4096] = "Union";
    TypeFlag[TypeFlag["Late"] = 8192] = "Late";
})(TypeFlag = exports.TypeFlag || (exports.TypeFlag = {}));
function isType(value) {
    return typeof value === "object" && value && value.isType === true;
}
exports.isType = isType;
function isPrimitiveType(type) {
    return (isType(type) &&
        (type.flag & (TypeFlag.String | TypeFlag.Number | TypeFlag.Boolean | TypeFlag.Date)) >
            0);
}
exports.isPrimitiveType = isPrimitiveType;
function isArrayType(type) {
    return isType(type) && (type.flag & TypeFlag.Array) > 0;
}
exports.isArrayType = isArrayType;
function isObjectType(type) {
    return isType(type) && (type.flag & TypeFlag.Object) > 0;
}
exports.isObjectType = isObjectType;
function isIdentifierType(type) {
    return isType(type) && (type.flag & TypeFlag.Identifier) > 0;
}
exports.isIdentifierType = isIdentifierType;
function isOptionalType(type) {
    return isType(type) && (type.flag & TypeFlag.Optional) > 0;
}
exports.isOptionalType = isOptionalType;
function isReferenceType(type) {
    return (type.flag & TypeFlag.Reference) > 0;
}
exports.isReferenceType = isReferenceType;
//# sourceMappingURL=TypeFlags.js.map