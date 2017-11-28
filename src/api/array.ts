import {IComplexType, IType} from "./type";
import {IObservableArray} from "mobx";
import {ArrayType} from "../lib/array";

export function array<S, T>(subtype: IType<S, T>): IComplexType<S[], IObservableArray<T>> {
  return new ArrayType<S, T>(subtype.name + "[]", subtype);
}