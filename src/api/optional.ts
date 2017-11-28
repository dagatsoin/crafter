import {IType} from "./type";
import {OptionalValue} from "../lib/Optional";
import {getNode, isInstance} from "../lib/core/node";
import {assertType} from "../../dist/lib/utils";
import {isType} from "./typeFlags";

declare const process: any;

export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: S): IType<S, T>;
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: T): IType<S, T>;
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => S): IType<S, T>;
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => T): IType<S, T>;
/**
 * `types.optional` can be used to create a property with a default value.
 * If the given value is not provided in the snapshot, it will default to the provided `defaultValue`.
 * If `defaultValue` is a function, the function will be invoked for every new instance.
 * Applying a snapshot in which the optional value is _not_ present, causes the value to be reset
 *
 * @example
 * const Todo = types.model({
 *   title: types.optional(types.string, "Test"),
 *   done: types.optional(types.boolean, false),
 *   created: types.optional(types.Date, () => new Date())
 * })
 *
 * // it is now okay to omit 'created' and 'done'. created will get a freshly generated timestamp
 * const todo = Todo.create({ title: "Get coffee "})
 *
 * @export
 * @alias types.optional
 */
export function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: any): IType<S, T> {
    if (process.env.NODE_ENV !== "production") {
        if (!isType(type))
            fail("expected a mobx-state-tree type as first argument, got " + type + " instead");
        const defaultValue =
            typeof defaultValueOrFunction === "function"
                ? defaultValueOrFunction()
                : defaultValueOrFunction;
        const defaultSnapshot = isInstance(defaultValue)
            ? getNode(defaultValue).snapshot
            : defaultValue;
        assertType(type, defaultSnapshot);
    }
    return new OptionalValue(type, defaultValueOrFunction);
}
