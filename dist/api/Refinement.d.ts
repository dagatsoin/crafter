import { IType } from "./type";
export declare function refinement<T>(name: string, type: IType<T, T>, predicate: (snapshot: T) => boolean, message?: string | ((v: any) => string)): IType<T, T>;
export declare function refinement<S, T extends S, U extends S>(name: string, type: IType<S, T>, predicate: (snapshot: S) => snapshot is U, message?: string | ((v: any) => string)): IType<S, U>;
export declare function refinement<S, T extends S, U extends S>(type: IType<S, T>, predicate: (snapshot: S) => snapshot is U, message?: string | ((v: any) => string)): IType<S, U>;
export declare function refinement<T>(type: IType<T, T>, predicate: (snapshot: T) => boolean, message?: string | ((v: any) => string)): IType<T, T>;
