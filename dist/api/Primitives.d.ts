import { ISimpleType, Type } from "./Type";
import { Instance } from "../lib/Instance";
/**
 * From MST implementation https://github.com/mobxjs/mobx-state-tree/blob/master/src/types/primitives.ts
 */
export declare class CoreType<S, T> extends Type<S, T> {
    readonly checker: (value: any) => boolean;
    readonly initializer: (v: any) => any;
    constructor(name: any, checker: any, initializer?: (v: any) => any);
    instantiate(snapshot: T): Instance;
    isValidSnapshot(value: any): boolean;
    getSnapshot(instance: Instance): S;
    applySnapshot(instance: Instance, snapshot: S): void;
    /**
     * Return an empty array of Instance because primitive can't have children.
     * @return {Array<Instance>}
     */
    getChildren(instance: Instance): Array<Instance>;
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
export declare const string: ISimpleType<string>;
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
