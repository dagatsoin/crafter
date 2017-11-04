import { ComplexType, IObjectType, IType } from "../api/Type";
import { Node } from "./core/Node";
import { TypeFlag } from "../api/TypeFlags";
export declare type IObjectProperties<T> = {
    [K in keyof T]: IType<any, T[K]> | T[K];
};
export declare class ObjectType<S, T> extends ComplexType<S, T> implements IObjectType<S, T> {
    readonly flag: TypeFlag;
    private readonly propertiesNames;
    private properties;
    constructor(opts: {
        name?: string;
        properties?: object;
    });
    isValidSnapshot(value: any): boolean;
    instantiate(parent: Node, subPath: string, initialValue?: any): Node;
    getSnapshot(node: Node): S;
    applySnapshot(node: Node, snapshot: S): void;
    getValue(node: Node): T;
    private createEmptyInstance();
    /**
     * We create the Node of the Instance. The Node is the final value the user will "see". Is is an object where each property is also a Node.
     * @param {Node} node
     * @param {S} snapshot
     */
    private buildInstance;
    private forAllProps;
    /**
     * Return all children Instance of an object Instance.
     * @return {Array<Node>}
     */
    getChildren(node: Node): Array<Node>;
    getChildType(key: string): IType<any, any>;
}
