import {fail, identity, isPrimitive, typeCheckFailure, typeCheckSuccess} from "./utils";
import {ISimpleType, IValidationResult, Type} from "./Type";
import {createInstance, Instance} from "../lib/Instance";

/**
 * From MST implementation https://github.com/mobxjs/mobx-state-tree/blob/master/src/types/primitives.ts
 */
export class CoreType<S, T> extends Type<T> {
    readonly checker: (value: any) => boolean;
    readonly initializer: (v: any) => any;

    constructor(name: any,
                checker: any,
                initializer: (v: any) => any = identity) {
        super(name);
        this.checker = checker;
        this.initializer = initializer;
    }

    instantiate(snapshot: T): Instance {
        return createInstance(this, snapshot, this.initializer);
    }

    isValidSnapshot(value: any): IValidationResult {
        if (isPrimitive(value) && this.checker(value)) {
            return typeCheckSuccess();
        }
        const typeName = this.name === "Date" ? "Date or a unix milliseconds timestamp" : this.name;
        return typeCheckFailure(value, `Value is not a ${typeName}`);
    }

    serialize(instance: Instance): S {
        return instance.storedValue;
    }
}

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
    (v: string) => typeof v === "string"
);

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
        //case "object":
        //  if (value instanceof Date) return DatePrimitive
    }
    return fail("Cannot determine primtive type from value " + value);
}