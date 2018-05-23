import { Operation } from "fast-json-patch";
import { Node, Instance, Mutation } from "../lib/core/node";
import { TypeFlag } from "./typeFlags";
import { IJsonPatch } from "../lib/core/jsonPatch";
export interface IValidationError {
    value: any;
    message?: string;
}
export declare type IValidationResult = IValidationError[];
export interface IType<S, T> {
    name: string;
    readonly flag: TypeFlag;
    readonly isType: boolean;
    Type: T;
    /**
     * The type mutations are "static". This means that any addition/deletion will be reflected
     * on all Instance of this Type.
     */
    readonly mutations: Array<string>;
    create(snapshot?: S, check?: boolean): T;
    is(thing: any): thing is S | T;
    validate(thing: any): boolean;
    getSnapshot(node: Node): any;
    applySnapshot(node: Node, snapshot: S): void;
    instantiate(parent: Node | null, subPath: string, initialValue?: any): Node;
    getValue(node: Node): T;
    getChildType(key: string): IType<any, any>;
    getChildNode(node: Node, key: string): Node;
    isAssignableFrom(type: IType<any, any>): boolean;
    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void;
    describe(): string;
    getMutation(type: string): Mutation<any> | null;
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
    create(snapshot?: S, check?: boolean): T & ISnapshottable<S>;
    applyPatch(node: Node, patch: Array<Operation>): void;
    getDefaultSnapshot(): any;
}
export interface IObjectType<S, T> extends IComplexType<S, T & Instance> {
    addMutations(mutationTypes: Array<string>): void;
    removeMutations(mutationTypes: Array<string>): void;
}
export declare type IObjectProperties<T> = {
    [K in keyof T]: IType<any, T[K]> | T[K];
};
export declare type Snapshot<T> = {
    [K in keyof T]?: Snapshot<T[K]> | any;
};
export declare abstract class Type<S, T> implements IType<S, T> {
    name: string;
    readonly flag: TypeFlag;
    readonly isType: boolean;
    mutations: Array<string>;
    protected static readonly allowedMutations: Array<{
        mutationType: string;
        mutation: Mutation<any>;
    }>;
    constructor(name: string);
    abstract isValidSnapshot(value: any): boolean;
    abstract getSnapshot(node: Node): S;
    abstract instantiate(parent: Node | null, subPath: string, initialValue?: any): Node;
    abstract getChildren(node: Node): Array<Node>;
    abstract describe(): string;
    readonly Type: T;
    /**
     * Register an allowed mutation for an ObjectType instance
     * @param mutationType
     */
    static registerMutation(mutationType: string, mutation: Mutation<any>): void;
    addMutations(mutationTypes: Array<string>): void;
    removeMutations(mutationTypes: Array<string>): void;
    getMutation(type: string): Mutation<any> | null;
    getChildNode(node: Node, key: string): Node;
    is(value: any): value is S | T;
    validate(thing: any): boolean;
    create(snapshot?: S, check?: boolean): T;
    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void;
    applySnapshot(node: Node, snapshot: S): void;
    getValue(node: Node): T;
    reconcile(current: Node, newValue: any): Node;
    getChildType(key: string): IType<any, any>;
    isAssignableFrom(type: IType<any, any>): boolean;
}
export declare abstract class ComplexType<S, T> extends Type<S, T> implements IComplexType<S, T> {
    abstract getDefaultSnapshot(): any;
    create(snapshot?: S, check?: boolean): T;
    applySnapshot(node: Node, snapshot: S): void;
    applyPatch(node: Node, patch: Array<Operation>): void;
    getChildNode(node: Node, key: string): Node;
}
