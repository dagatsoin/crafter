import {fail} from "../lib/utils";
import {ISimpleType} from "./type";
import {CoreType} from "../lib/coreType";
import {TypeFlag} from "./typeFlags";

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
// tslint:disable-next-line:variable-name
export const string: ISimpleType<string> = new CoreType<string, string>(
    "string",
    TypeFlag.String,
    (v: string) => typeof v === "string"
);

/**
 * The type of the value `null`
 *
 * @export
 * @alias types.null
 */
export const nullType: ISimpleType<null> = new CoreType<null, null>(
    "null",
    TypeFlag.Null,
    (v: any) => v === null
)

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
// tslint:disable-next-line:variable-name
export const number: ISimpleType<number> = new CoreType<number, number>(
    "number",
    TypeFlag.Number,
    (v: number) => typeof v === "number"
);

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
// tslint:disable-next-line:variable-name
export const boolean: ISimpleType<boolean> = new CoreType<boolean, boolean>(
    "boolean",
    TypeFlag.Boolean,
    (v: boolean) => typeof v === "boolean"
);

export function getPrimitiveFactoryFromValue(value: any): ISimpleType<any> {
    switch (typeof value) {
        case "string":
            return string;
        case "number":
            return number;
        case "boolean":
            return boolean;
        // case "object":
        //  if (value instanceof Date) return DatePrimitive
    }
    return fail("Cannot determine primtive type from value " + value);
}