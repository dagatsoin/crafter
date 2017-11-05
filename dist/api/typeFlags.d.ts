import { IObservableArray } from "mobx";
import { IComplexType, IType } from "./Type";
import { CoreType } from "../lib/CoreType";
import { IdentifierType } from "../lib/Identifier";
import { OptionalValue } from "../lib/Optional";
import { ReferenceType } from "../lib/Reference";
import { ObjectType } from "../lib/Object";
export declare enum TypeFlag {
    String = 1,
    Number = 2,
    Boolean = 4,
    Array = 8,
    Object = 16,
    Frozen = 32,
    Optional = 64,
    Reference = 128,
    Identifier = 256,
}
export declare function isType(value: any): value is IType<any, any>;
export declare function isPrimitiveType(type: any): type is CoreType<any, any>;
export declare function isArrayType<S, T>(type: any): type is IComplexType<S[], IObservableArray<T>>;
export declare function isObjectType(type: any): type is ObjectType<any, any>;
export declare function isIdentifierType(type: any): type is IdentifierType<any>;
export declare function isOptionalType(type: any): type is OptionalValue<any, any>;
export declare function isReferenceType(type: any): type is ReferenceType<any>;
