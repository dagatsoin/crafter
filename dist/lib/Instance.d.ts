import { IType } from "../api/Type";
export declare class Instance {
    readonly type: IType<any, any>;
    readonly storedValue: any;
    constructor(type: IType<any, any>, initialValue: any, createNewInstance?: (initialValue: any) => any);
    restore(snapshot: any): void;
    readonly snapshot: any;
    isRoot(): void;
    readonly value: any;
}
export declare function createInstance<S, T>(type: IType<S, T>, initialValue: any, createNewInstance?: (initialValue: any) => T): Instance;
