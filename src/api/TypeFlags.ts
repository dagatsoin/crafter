import { IObservableArray } from "mobx";
import {IComplexType, IType} from "./Type";
import {CoreType} from "../lib/CoreType";
import {IdentifierType} from "../lib/Identifier";
import {OptionalValue} from "../lib/Optional";
import {ReferenceType} from "../lib/Reference";
import {ObjectType} from "../lib/object";

export enum TypeFlag {
    String = 1 << 0,
    Number = 1 << 1,
    Boolean = 1 << 2,
    Date = 1 << 3,
    Array = 1 << 4,
    Map = 1 << 5,
    Object = 1 << 6,
    Frozen = 1 << 7,
    Optional = 1 << 8,
    Reference = 1 << 9,
    Identifier = 1 << 10,
    Refinement = 1 << 11,
    Union= 1 << 12,
    Late = 1 << 13,
    Null = 1 << 14,
}

export function isType(value: any): value is IType<any, any> {
    return typeof value === "object" && value && value.isType === true;
}

export function isPrimitiveType(type: any): type is CoreType<any, any> {
    return (
        isType(type) &&
        (type.flag & (TypeFlag.String | TypeFlag.Number | TypeFlag.Boolean | TypeFlag.Date)) >
        0
    );
}

export function isArrayType<S, T>(type: any): type is IComplexType<S[], IObservableArray<T>> {
    return isType(type) && (type.flag & TypeFlag.Array) > 0;
}

export function isObjectType(type: any): type is ObjectType<any, any> {
    return isType(type) && (type.flag & TypeFlag.Object) > 0;
}

export function isIdentifierType(type: any): type is IdentifierType<any> {
    return isType(type) && (type.flag & TypeFlag.Identifier) > 0;
}

export function isOptionalType(type: any): type is OptionalValue<any, any> {
    return isType(type) && (type.flag & TypeFlag.Optional) > 0;
}

export function isReferenceType(type: any): type is ReferenceType<any> {
    return (type.flag & TypeFlag.Reference) > 0;
}