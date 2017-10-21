import { Operation } from "fast-json-patch";
import { Instance, Node } from "../lib/Instance";
export interface IValidationError {
    value: any;
    message?: string;
}
export declare type IValidationResult = IValidationError[];
export interface IType<S, T> {
    name: string;
    readonly isType: boolean;
    create(snapshot?: S): T;
    is(thing: any): thing is S | T;
    validate(thing: any): boolean;
    getSnapshot(instance: Instance): any;
    applySnapshot(instance: Instance, snapshot: S): void;
    instantiate(initialValue?: any): Instance;
    getValue(instance: Instance): T;
    /**
     * Return all children Instance of an Instance.
     * @return {Array<Instance>}
     */
    getChildren(instance: Instance): Array<Instance>;
}
export interface ISimpleType<T> extends IType<T, T> {
}
export interface ISnapshottable<S> {
}
export interface IComplexType<S, T> extends IType<S, T & Node> {
    create(snapshot?: S, environment?: any): T & ISnapshottable<S>;
    applyPatch(instance: Instance, patch: Array<Operation>): void;
}
export interface IObjectType<S, T> extends IComplexType<S, T & Node> {
}
export declare type IObjectProperties<T> = {
    [K in keyof T]: IType<any, T[K]> | T[K];
};
export declare type Snapshot<T> = {
    [K in keyof T]?: Snapshot<T[K]> | any;
};
export declare abstract class Type<S, T> implements IType<S, T> {
    name: string;
    readonly isType: boolean;
    constructor(name: string);
    abstract isValidSnapshot(value: any): boolean;
    abstract getSnapshot(instance: Instance): S;
    abstract instantiate(initialValue: any): Instance;
    abstract getChildren(instance: Instance): Array<Instance>;
    is(thing: any): thing is S | T;
    validate(thing: any): boolean;
    create(snapshot?: S): T;
    applySnapshot(instance: Instance, snapshot: S): void;
    getValue(instance: Instance): T;
}
export declare abstract class ComplexType<S, T> extends Type<S, T> implements IComplexType<S, T> {
    is(thing: any): thing is S | (T & Node);
    applySnapshot(instance: Instance, snapshot: S): void;
    applyPatch(instance: Instance, patch: Array<Operation>): void;
}
export declare function isType(value: any): value is IType<any, any>;
