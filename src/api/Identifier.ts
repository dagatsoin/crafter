import {IdentifierType} from "../lib/Identifier";
import {string} from "./Primitives";
import {IType} from "./Type";
import {isType} from "./TypeFlags";

declare const process: any;

export function identifier<T>(baseType: IType<T, T>): IType<T, T>;
export function identifier<T>(): T;
/**
 * Identifiers are used to make references, lifecycle events and reconciling works.
 * Inside a state tree, for each type can exist only one instance for each given identifier.
 * For example there couldn't be 2 instances of user with id 1. If you need more, consider using references.
 * Identifier can be used only as type property of a model.
 * This type accepts as parameter the value type of the identifier field that can be either string or number.
 *
 * @example
 *  const Todo = types.model("Todo", {
 *      id: types.identifier(types.string),
 *      title: types.string
 *  })
 *
 * @export
 * @alias types.identifier
 * @template T
 * @param {IType<T, T>} baseType
 * @returns {IType<T, T>}
 */

export function identifier(baseType: IType<any, any> = string): any {
    if (process.env.NODE_ENV !== "production") {
        if (!isType(baseType))
            fail("expected a mobx-state-tree type as first argument, got " + baseType + " instead");
    }
    return new IdentifierType(baseType);
}
