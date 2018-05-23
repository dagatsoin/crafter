import { IType } from "./type";
export declare function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: S): IType<S, T>;
export declare function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: T): IType<S, T>;
export declare function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => S): IType<S, T>;
export declare function optional<S, T>(type: IType<S, T>, defaultValueOrFunction: () => T): IType<S, T>;
