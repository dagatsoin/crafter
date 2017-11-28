import { ISimpleType } from "./Type";
/**
 * Creates a type that can only contain a string value.
 * This type is used for string values by default
 *
 * @export
 * @alias types.string
 * @example
 * const Person = types.model({
 *   firstName: types.string,
 *   lastName: "Doe"
 * })
 */
export declare const string: ISimpleType<string>;
/**
 * The type of the value `null`
 *
 * @export
 * @alias types.null
 */
export declare const nullType: ISimpleType<null>;
/**
 * Creates a type that can only contain a numeric value.
 * This type is used for numeric values by default
 *
 * @export
 * @alias types.number
 * @example
 * const Vector = types.model({
 *   x: types.number,
 *   y: 0
 * })
 */
export declare const number: ISimpleType<number>;
/**
 * Creates a type that can only contain a boolean value.
 * This type is used for boolean values by default
 *
 * @export
 * @alias types.boolean
 * @example
 * const Thing = types.model({
 *   isCool: types.boolean,
 *   isAwesome: false
 * })
 */
export declare const boolean: ISimpleType<boolean>;
export declare function getPrimitiveFactoryFromValue(value: any): ISimpleType<any>;
