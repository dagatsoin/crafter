import { union } from "./Union";
import { optional } from "./Optional";
import { IType } from "./Type";
import { isType } from "./TypeFlags";
import { fail } from "../lib/utils";
import { nullType } from "./Primitives";

const optionalNullType = optional(nullType, null)

/**
 * Maybe will make a type nullable, and also null by default.
 *
 * @export
 * @alias types.maybe
 * @template S
 * @template T
 * @param {IType<S, T>} type The type to make nullable
 * @returns {(IType<S | null | undefined, T | null>)}
 */
export function maybe<S, T>(type: IType<S, T>): IType<S | null | undefined, T | null> {
    return union(optionalNullType, type)
}