import { Operation } from "fast-json-patch";
import { Node, Instance } from "../lib/Node";
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
    getSnapshot(node: Node): any;
    applySnapshot(node: Node, snapshot: S): void;
    instantiate(parent: Node, subPath: string, initialValue?: any): Node;
    getValue(node: Node): T;
    /**
     * When a complex array is receiving a snapshot it needs to change the value of all its children. The most basic method to do this is to recreate a new Node
     * for each children.
     * But very often there is a Node of the same instance than the new value. For example an typed Array of the same Model instance.
     * In such case it is quite inefficient to recreate the node just to change their value. So we use a reconciliation mechanism to math existing compatible
     * Node with the new value.
     * @param {Node} current
     * @param newValue
     * @return {Node}
     */
    reconcile(current: Node, newValue: any): Node;
    /**
     * Return all children of an Node.
     * @return {Array<Node>}
     */
    getChildren(node: Node): Array<Node>;
}
export interface ISimpleType<T> extends IType<T, T> {
}
export interface ISnapshottable<S> {
}
export interface IComplexType<S, T> extends IType<S, T & Instance> {
    create(snapshot?: S, environment?: any): T & ISnapshottable<S>;
    applyPatch(node: Node, patch: Array<Operation>): void;
}
export interface IObjectType<S, T> extends IComplexType<S, T & Instance> {
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
    abstract getSnapshot(node: Node): S;
    abstract instantiate(parent: Node | null, subPath: string, initialValue?: any): Node;
    abstract getChildren(node: Node): Array<Node>;
    is(thing: any): thing is S | T;
    validate(thing: any): boolean;
    create(snapshot?: S): T;
    applySnapshot(node: Node, snapshot: S): void;
    getValue(node: Node): T;
    reconcile(current: Node, newValue: any): Node;
}
export declare abstract class ComplexType<S, T> extends Type<S, T> implements IComplexType<S, T> {
    is(thing: any): thing is S | (T & Instance);
    applySnapshot(node: Node, snapshot: S): void;
    applyPatch(node: Node, patch: Array<Operation>): void;
}
export declare function isType(value: any): value is IType<any, any>;
