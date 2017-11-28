import {IType} from "./type";
import {assertType} from "../lib/utils";
import {Late} from "../lib/late";

export type ILateType<S, T> = () => IType<S, T>

export function late<S = any, T = any>(type: ILateType<S, T>): IType<S, T>
export function late<S = any, T = any>(name: string, type: ILateType<S, T>): IType<S, T>
/**
 * Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies.
 * Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.
 * You need to declare an interface to explicit the return type of the late parameter function.
 *
 * @example
 *  interface INode {
 *       childs: INode[]
 *  }
 *
 *   // TypeScript is'nt smart enough to infer self referencing types.
 *  const Node = types.model({
 *       childs: types.optional(types.array(types.late<any, INode>(() => Node)), [])
 *  })
 *
 * @export
 * @alias types.late
 * @template S
 * @template T
 * @param {string} [name] The name to use for the type that will be returned.
 * @param {ILateType<S, T>} type A function that returns the type that will be defined.
 * @returns {IType<S, T>}
 */
export function late<S, T>(nameOrType: any, maybeType?: ILateType<S, T>): IType<S, T> {
    const name = typeof nameOrType === "string" ? nameOrType : `late(${nameOrType.toString()})`
    const type = typeof nameOrType === "string" ? maybeType : nameOrType
    assertType(type, "function");
    return new Late<S, T>(name, type)
}
