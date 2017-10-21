import {Operation} from "fast-json-patch";
import {Instance, Node} from "../lib/Instance";
import {fail} from "../lib/utils";

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

    readonly isType: boolean; // Just to certify it is a types

    create(snapshot?: S): T;

    is(thing: any): thing is S | T;

    validate(thing: any): boolean;

    serialize(instance: Instance): any;

    restore(instance: Instance, snapshot: S): void;

    // Internal API
    instantiate(initialValue?: any): Instance;

    getValue(instance: Instance): T;
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

export type IObjectProperties<T> = { [K in keyof T]: IType<any, T[K]> | T[K] };

export type Snapshot<T> = {
    [K in keyof T]?: Snapshot<T[K]> | any // Any because we cannot express conditional types yet, so this escape is needed for refs and such....
    };

export abstract class Type<S, T> implements IType<S, T> {
    name: string;
    readonly isType = true;
    constructor(name: string) {
        this.name = name;
    }

    abstract isValidSnapshot(value: any): boolean; // todo use IContext ?
    abstract serialize(instance: Instance): S;
    abstract instantiate(initialValue: any): Instance;

    is(thing: any): thing is S | T {
        throw new Error("Method not implemented.");
    }

    validate(thing: any): boolean {
        return this.isValidSnapshot(thing);
    }

    create(snapshot?: S): T {
        return this.instantiate(snapshot).value;
    }

    restore(instance: Instance, snapshot: S): void {
        fail("Error from abstract class Type. The class you call this method from should implement Immutable value and can't be restored.");
    }

    getValue(instance: Instance): T {
        return instance.storedValue;
    }
}

export abstract class ComplexType<S, T> extends Type<S, T> implements IComplexType<S, T> {
    is(thing: any): thing is S | (T & Node) {
        throw new Error("Method not implemented.");
    }

    restore(instance: Instance, snapshot: S) {
        fail("Immutable types do not support applying snapshots");
    }

    applyPatch(instance: Instance, patch: Array<Operation>) {
        throw new Error("Method not implemented.");
    }
}

export function isType(value: any): value is IType<any, any> {
    return typeof value === "object" && value && value.isType === true;
}