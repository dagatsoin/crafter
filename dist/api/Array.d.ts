import { IComplexType, IType } from "./Type";
import { IObservableArray } from "mobx";
export declare function array<S, T>(subtype: IType<S, T>): IComplexType<S[], IObservableArray<T>>;
