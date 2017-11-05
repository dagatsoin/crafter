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
    Date = 8,
    Array = 16,
    Map = 32,
    Object = 64,
    Frozen = 128,
    Optional = 256,
    Reference = 512,
    Identifier = 1024,
    Refinement = 2048,
    Union = 4096,
}
export declare function isType(value: any): value is IType<any, any>;
export declare function isPrimitiveType(type: any): type is CoreType<any, any>;
export declare function isArrayType<S, T>(type: any): type is IComplexType<S[], IObservableArray<T>>;
export declare function isObjectType(type: any): type is ObjectType<any, any>;
export declare function isIdentifierType(type: any): type is IdentifierType<any>;
export declare function isOptionalType(type: any): type is OptionalValue<any, any>;
export declare function isReferenceType(type: any): type is ReferenceType<any>;
