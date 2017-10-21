import {IComplexType, IType} from "./Type";
import {IObservableArray} from "mobx";
import {ArrayType} from "../lib/Array";

export function array<S, T>(subtype: IType<S, T>): IComplexType<S[], IObservableArray<T>> {
  return new ArrayType<S, T>(subtype.name + "[]", subtype);
}