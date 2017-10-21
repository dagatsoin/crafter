import { ComplexType, IObjectType, IType } from "../api/Type";
import { Instance } from "./Instance";
export declare type IObjectProperties<T> = {
    [K in keyof T]: IType<any, T[K]> | T[K];
};
export declare class ObjectType<S, T> extends ComplexType<S, T> implements IObjectType<S, T> {
    private readonly propertiesNames;
    private properties;
    constructor(opts: {
        name?: string;
        properties?: object;
    });
    isValidSnapshot(value: any): boolean;
    instantiate(snapshot: S): Instance;
    serialize(instance: Instance): S;
    restore(instance: Instance, snapshot: S): void;
    getValue(instance: Instance): T;
    private createEmptyInstance();
    /**
     * We build the instance:
     * 1- create the Node of the Instance. The Node is the public readonly value which is actually used. Is is an object where each properties is also a Node.
     * 2- register all properties Node as child.
     * @param {Instance} instance
     * @param {S} snapshot
     */
    private buildInstance;
    private forAllProps;
}
