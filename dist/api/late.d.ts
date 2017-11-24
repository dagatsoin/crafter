import { IType } from "./Type";
export declare type ILateType<S, T> = () => IType<S, T>;
export declare function late<S = any, T = any>(type: ILateType<S, T>): IType<S, T>;
export declare function late<S = any, T = any>(name: string, type: ILateType<S, T>): IType<S, T>;
