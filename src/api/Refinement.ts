import {IType} from "./Type";
import {isType} from "./TypeFlags";
import {Refinement} from "../lib/Refinement";
import { fail } from "../lib/utils";

declare const process: any;

export function refinement<T>(
    name: string,
    type: IType<T, T>,
    predicate: (snapshot: T) => boolean,
    message?: string | ((v: any) => string)
): IType<T, T>;
export function refinement<S, T extends S, U extends S>(
    name: string,
    type: IType<S, T>,
    predicate: (snapshot: S) => snapshot is U,
    message?: string | ((v: any) => string)
): IType<S, U>;
export function refinement<S, T extends S, U extends S>(
    type: IType<S, T>,
    predicate: (snapshot: S) => snapshot is U,
    message?: string | ((v: any) => string)
): IType<S, U>;
export function refinement<T>(
    type: IType<T, T>,
    predicate: (snapshot: T) => boolean,
    message?: string | ((v: any) => string)
): IType<T, T>;
/**
 * `types.refinement(baseType, (snapshot) => boolean)` creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.
 *
 * @export
 * @alias types.refinement
 * @template T
 * @returns {IType<T, T>}
 * @param args
 */
export function refinement(...args: any[]): IType<any, any> {
    const name = typeof args[0] === "string" ? args.shift() : isType(args[0]) ? args[0].name : null;
    const type = args[0];
    const predicate = args[1];
    const message = args[2]
        ? args[2]
        : (v: any) => "Value does not respect the refinement predicate";
    // ensures all parameters are correct
    if (process.env.NODE_ENV !== "production") {
        if (typeof name !== "string")
            fail("expected a string as first argument, got " + name + " instead");
        if (!isType(type))
            fail(
                "expected a mobx-state-tree type as first or second argument, got " +
                    type +
                    " instead"
            );
        if (typeof predicate !== "function")
            fail("expected a function as third argument, got " + predicate + " instead");
        if (typeof message !== "function")
            fail("expected a function as fourth argument, got " + message + " instead");
    }
    return new Refinement(name, type, predicate, message);
}
