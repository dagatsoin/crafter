import {IType} from "./Type";
import {ReferenceType} from "../lib/Reference";
import {assertType} from "../lib/utils";
declare const process: any;

export function reference<T>(factory: IType<any, T>): IType<string | number, T>;
/**
 * Creates a reference to another type, which should have defined an identifier.
 *
 * @export
 * @alias types.reference
 */
export function reference<T>(subType: IType<any, T>): any {
    assertType(subType, "Type");
    return new ReferenceType(subType);
}
