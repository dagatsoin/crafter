import {Operation} from "fast-json-patch";
import {Node, Instance} from "../lib/core/Node";
import {assertType, fail} from "../lib/utils";
import {TypeFlag} from "./typeFlags";

////////////////////
////////////////////
/////// API ////////
////////////////////
////////////////////

export interface IValidationError {
    value: any;
    message?: string;
}

export type IValidationResult = IValidationError[];

export interface IType<S, T> {
    name: string;
    readonly flag: TypeFlag;
    readonly isType: boolean; // Just to certify it is a types

    create(snapshot?: S, check?: boolean): T;

    is(thing: any): thing is S | T;

    validate(thing: any): boolean;

    getSnapshot(node: Node): any;

    applySnapshot(node: Node, snapshot: S): void;

    // Internal API
    instantiate(parent: Node, subPath: string, initialValue?: any): Node;

    getValue(node: Node): T;

    getChildType(key: string): IType<any, any>;

    getChildNode(node: Node, key: string): Node;

    isAssignableFrom(type: IType<any, any>): boolean;

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
}

export type IObjectProperties<T> = { [K in keyof T]: IType<any, T[K]> | T[K] };

export type Snapshot<T> = {
    [K in keyof T]?: Snapshot<T[K]> | any // Any because we cannot express conditional types yet, so this escape is needed for refs and such....
    };

export abstract class Type<S, T> implements IType<S, T> {
    name: string;
    readonly flag: TypeFlag;
    readonly isType = true;
    constructor(name: string) {
        this.name = name;
    }

    abstract isValidSnapshot(value: any): boolean; // todo use IContext ?
    abstract getSnapshot(node: Node): S;
    abstract instantiate(parent: Node | null, subPath: string, initialValue?: any): Node;
    abstract getChildren(node: Node): Array<Node>;

    getChildNode(node: Node, key: string): Node {
        return fail(`No child '${key}' available in type: ${this.name}`)
    }

    is(thing: any): thing is S | T {
        throw new Error("Method not implemented.");
    }

    validate(thing: any): boolean {
        return this.isValidSnapshot(thing);
    }

    create(snapshot?: S, check?: boolean): T {
        if (check) assertType(snapshot, this, 0, check);
        return this.instantiate(null, "", snapshot).value;
    }

    applySnapshot(node: Node, snapshot: S): void {
        fail("Error from abstract class Type. Immutable value can't be restored.");
    }

    getValue(node: Node): T {
        return node.data;
    }

    reconcile(current: Node, newValue: any): Node {
        // reconcile only if type and value are still the same
        if (current.type === this && current.data === newValue) return current;
        const res = this.instantiate(
            current.parent,
            current.subPath,
            newValue
        );
        current.remove();
        return res;
    }

    getChildType(key: string): IType<any, any> {
        return fail(`No child '${key}' available in type: ${this.name}`);
    }

    isAssignableFrom(type: IType<any, any>): boolean {
        return type === this;
    }
}

export abstract class ComplexType<S, T> extends Type<S, T> implements IComplexType<S, T> {
    abstract getDefaultSnapshot(): any;

    is(value: any): value is S | T {
        return this.validate(value);
    }

    create(snapshot: S = this.getDefaultSnapshot(), check?: boolean): T {
        return super.create(snapshot, check);
    }

    applySnapshot(node: Node, snapshot: S) {
        fail("Immutable types do not support applying snapshots");
    }

    applyPatch(node: Node, patch: Array<Operation>) {
        throw new Error("Method not implemented.");
    }

    getChildNode(node: Node, key: string): Node {
        return fail(`No child '${key}' available in type: ${this.name}`);
    }
}