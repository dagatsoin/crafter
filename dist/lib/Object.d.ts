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
    getSnapshot(instance: Instance): S;
    applySnapshot(instance: Instance, snapshot: S): void;
    getValue(instance: Instance): T;
    private createEmptyInstance();
    /**
     * We create the Node of the Instance. The Node is the final value the user will "see". Is is an object where each property is also a Node.
     * @param {Instance} instance
     * @param {S} snapshot
     */
    private buildInstance;
    private forAllProps;
    /**
     * Return all children Instance of an object Instance.
     * @return {Array<Instance>}
     */
    getChildren(instance: Instance): Array<Instance>;
}
