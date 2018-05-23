import { ComplexType, IObjectType, IType } from "../api/type";
import { Node } from "./core/node";
import { IObjectChange, IObjectWillChange } from "mobx";
import { TypeFlag } from "../api/typeFlags";
import { IJsonPatch } from "./core/jsonPatch";
export declare type IObjectProperties<T> = {
    [K in keyof T]: IType<any, T[K]> | T[K];
};
export declare class ObjectType<S, T> extends ComplexType<S, T> implements IObjectType<S, T> {
    readonly flag: TypeFlag;
    readonly mutations: Array<string>;
    private readonly propertiesNames;
    private properties;
    constructor(opts: {
        name?: string;
        properties?: object;
    });
    describe(): string;
    isValidSnapshot(value: any): boolean;
    instantiate(parent: Node, subPath: string, initialValue?: any): Node;
    getSnapshot(node: Node): any;
    applyPatchLocally(node: Node, subPath: string, patch: IJsonPatch): void;
    applySnapshot(node: Node, snapshot: S): void;
    private createEmptyInstance();
    getDefaultSnapshot(): any;
    /**
     * We create the Node of the Instance. The Node is the final value the user will "see". Is is an object where each property is also a Node.
     * @param {Node} node
     * @param {S} snapshot
     */
    private buildInstance;
    willChange(change: IObjectWillChange): IObjectWillChange | null;
    didChange(change: IObjectChange): void;
    getChildNode(node: Node, key: string): Node;
    private forAllProps;
    /**
     * Return all children Instance of an object Instance.
     * @return {Array<Node>}
     */
    getChildren(node: Node): Node[];
    getChildType(key: string): IType<any, any>;
}
