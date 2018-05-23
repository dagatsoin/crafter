import { IComplexType, IType } from "./type";
import { IObservableArray } from "mobx";
export declare function array<S, T>(subtype: IType<S, T>): IComplexType<S[], IObservableArray<T>>;
