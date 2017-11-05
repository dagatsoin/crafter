import { IType } from "./Type";
export declare function reference<T>(factory: IType<any, T>): IType<string | number, T>;
