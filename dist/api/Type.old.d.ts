import { Operation } from "fast-json-patch";
import { Instance } from "../lib/Instance";
export interface IValidationError {
    value: any;
    message?: string;
}
export declare type IValidationResult = IValidationError[];
export declare type ValueInstance = {
    readonly $instance?: Instance;
};
export interface IType<S, T> {
    name: string;
    create(snapshot?: S): T;
    is(thing: any): thing is S | T;
    validate(thing: any): boolean;
    serialize(instance: Instance): any;
    restore(instance: Instance, snapshot: S): void;
    instantiate(initialValue?: any): Instance;
    getValue(instance: Instance): T;
}
export interface ISimpleType<T> extends IType<T, T> {
}
export interface ISnapshottable<S> {
}
export interface IComplexType<S, T> extends IType<S, T & ValueInstance> {
    create(snapshot?: S, environment?: any): T & ISnapshottable<S>;
    applyPatch(instance: Instance, patch: Array<Operation>): void;
}
export interface IObjectType<S, T> extends IComplexType<S, T & ValueInstance> {
}
export declare type IObjectProperties<T> = {
    [K in keyof T]: IType<any, T[K]> | T[K];
};
export declare type Snapshot<T> = {
    [K in keyof T]?: Snapshot<T[K]> | any;
};
export declare abstract class Type<S, T> implements IType<S, T> {
    name: string;
    constructor(name: string);
    abstract isValidSnapshot(value: any): IValidationResult;
    abstract serialize(instance: Instance): S;
    abstract instantiate(initialValue: any): Instance;
    is(thing: any): thing is S | T;
    validate(thing: any): boolean;
    create(snapshot?: S): T;
    restore(instance: Instance, snapshot: S): void;
    getValue(instance: Instance): T;
}
export declare abstract class ComplexType<S, T> extends Type<S, T> implements IComplexType<S, T> {
    is(thing: any): thing is S | (T & ValueInstance);
    restore(instance: Instance, snapshot: S): void;
    applyPatch(instance: Instance, patch: Array<Operation>): void;
}
