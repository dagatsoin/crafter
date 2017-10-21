import { Operation } from "fast-json-patch";
import { Node } from "../lib/Instance";
export interface IValidationError {
    value: any;
    message?: string;
}
export declare type IValidationResult = IValidationError[];
export declare type ValueNode = {
    readonly $instance?: Node;
};
export interface IType<S, T> {
    name: string;
    create(snapshot?: S): T;
    is(thing: any): thing is S | T;
    validate(thing: any): boolean;
    serialize(instance: Node): any;
    restore(instance: Node, snapshot: S): void;
    instantiate(initialValue?: any): Node;
    getValue(instance: Node): T;
}
export interface ISimpleType<T> extends IType<T, T> {
}
export interface ISnapshottable<S> {
}
export interface IComplexType<S, T> extends IType<S, T & ValueNode> {
    create(snapshot?: S, environment?: any): T & ISnapshottable<S>;
    applyPatch(instance: Node, patch: Array<Operation>): void;
}
export interface IObjectType<S, T> extends IComplexType<S, T & ValueNode> {
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
    abstract isValidSnapshot(value: any): boolean;
    abstract serialize(instance: Node): S;
    abstract instantiate(initialValue: any): Node;
    is(thing: any): thing is S | T;
    validate(thing: any): boolean;
    create(snapshot?: S): T;
    restore(instance: Node, snapshot: S): void;
    getValue(instance: Node): T;
}
export declare abstract class ComplexType<S, T> extends Type<S, T> implements IComplexType<S, T> {
    is(thing: any): thing is S | (T & ValueNode);
    restore(instance: Node, snapshot: S): void;
    applyPatch(instance: Node, patch: Array<Operation>): void;
}
