import { fail } from "../lib/utils";
import {IType} from "./Type";
import {isType} from "./TypeFlags";
import {Union, ITypeDispatcher} from "../lib/Union";
import { assertType } from "../lib/utils";

declare const process: any;

export function union<SA, SB, TA, TB>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>
): IType<SA | SB, TA | TB>;
export function union<SA, SB, TA, TB>(A: IType<SA, TA>, B: IType<SB, TB>): IType<SA | SB, TA | TB>;

export function union<SA, SB, SC, TA, TB, TC>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>
): IType<SA | SB | SC, TA | TB | TC>;
export function union<SA, SB, SC, TA, TB, TC>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>
): IType<SA | SB | SC, TA | TB | TC>;

export function union<SA, SB, SC, SD, TA, TB, TC, TD>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>
): IType<SA | SB | SC | SD, TA | TB | TC | TD>;
export function union<SA, SB, SC, SD, TA, TB, TC, TD>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>
): IType<SA | SB | SC | SD, TA | TB | TC | TD>;

export function union<SA, SB, SC, SD, SE, TA, TB, TC, TD, TE>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>
): IType<SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>;
export function union<SA, SB, SC, SD, SE, TA, TB, TC, TD, TE>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>
): IType<SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>;

export function union<SA, SB, SC, SD, SE, SF, TA, TB, TC, TD, TE, TF>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>
): IType<SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>;
export function union<SA, SB, SC, SD, SE, SF, TA, TB, TC, TD, TE, TF>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>
): IType<SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF>;

export function union<SA, SB, SC, SD, SE, SF, SG, TA, TB, TC, TD, TE, TF, TG>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>
): IType<SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>;
export function union<SA, SB, SC, SD, SE, SF, SG, TA, TB, TC, TD, TE, TF, TG>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>
): IType<SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG>;

export function union<SA, SB, SC, SD, SE, SF, SG, SH, TA, TB, TC, TD, TE, TF, TG, TH>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>
): IType<SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>;
export function union<SA, SB, SC, SD, SE, SF, SG, SH, TA, TB, TC, TD, TE, TF, TG, TH>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>
): IType<SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH>;

export function union<SA, SB, SC, SD, SE, SF, SG, SH, SI, TA, TB, TC, TD, TE, TF, TG, TH, TI>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>,
    I: IType<SI, TI>
): IType<SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>;
export function union<SA, SB, SC, SD, SE, SF, SG, SH, SI, TA, TB, TC, TD, TE, TF, TG, TH, TI>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>,
    I: IType<SI, TI>
): IType<SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI>;

export function union<
    SA,
    SB,
    SC,
    SD,
    SE,
    SF,
    SG,
    SH,
    SI,
    SJ,
    TA,
    TB,
    TC,
    TD,
    TE,
    TF,
    TG,
    TH,
    TI,
    TJ
>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>,
    I: IType<SI, TI>,
    J: IType<SJ, TJ>
): IType<
    SA | SB | SC | SD | SE | SF | SG | SH | SI | SJ,
    TA | TB | TC | TD | TE | TF | TG | TH | TI | TJ
>;
export function union<
    SA,
    SB,
    SC,
    SD,
    SE,
    SF,
    SG,
    SH,
    SI,
    SJ,
    TA,
    TB,
    TC,
    TD,
    TE,
    TF,
    TG,
    TH,
    TI,
    TJ
>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>,
    F: IType<SF, TF>,
    G: IType<SG, TG>,
    H: IType<SH, TH>,
    I: IType<SI, TI>,
    J: IType<SJ, TJ>
): IType<
    SA | SB | SC | SD | SE | SF | SG | SH | SI | SJ,
    TA | TB | TC | TD | TE | TF | TG | TH | TI | TJ
>;

export function union(...types: IType<any, any>[]): IType<any, any>;
export function union(
    dispatchOrType: ITypeDispatcher | IType<any, any>,
    ...otherTypes: IType<any, any>[]
): IType<any, any>;

/**
 * types.union(dispatcher?, types...) create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form (snapshot) => Type.
 *
 * @export
 * @alias types.union
 * @param {(ITypeDispatcher | IType<any, any>)} dispatchOrType
 * @param {...IType<any, any>[]} otherTypes
 * @returns {IType<any, any>}
 */
export function union(
    dispatchOrType: ITypeDispatcher | IType<any, any>,
    ...otherTypes: IType<any, any>[]
): IType<any, any> {
    const dispatcher = isType(dispatchOrType) ? null : dispatchOrType;
    const types = isType(dispatchOrType) ? otherTypes.concat(dispatchOrType) : otherTypes;
    const name = "(" + types.map(type => type.name).join(" | ") + ")";

    // check all options
    if (process.env.NODE_ENV !== "production") {
        types.forEach(type => {
            assertType(type, "Type");
        });
    }
    return new Union(name, types, dispatcher);
}
