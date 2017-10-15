import { ComplexType, IObjectType, IValidationResult } from "../api/Type";
import { Instance } from "./Instance";
export declare class ObjectType<S, T> extends ComplexType<S, T> implements IObjectType<S, T> {
    private readonly propertiesNames;
    private properties;
    constructor(opts: {
        name?: string;
        properties?: object;
    });
    isValidSnapshot(value: any): IValidationResult;
    instantiate(snapshot: S): Instance;
    serialize(instance: Instance): S;
    restore(instance: Instance, snapshot: S): void;
    private createNewInstance;
}
