import { Node } from "./core/node";
import { IType, Type } from "../api/type";
import { TypeFlag } from "../api/typeFlags";
export declare type ITypeDispatcher = (snapshot: any) => IType<any, any>;
export declare class Union extends Type<any, any> {
    readonly dispatcher: ITypeDispatcher | null;
    readonly types: IType<any, any>[];
    constructor(name: string, types: IType<any, any>[], dispatcher: ITypeDispatcher | null);
    getSnapshot(node: Node): any;
    getChildren(node: Node): Array<Node>;
    readonly flag: TypeFlag;
    isAssignableFrom(type: IType<any, any>): boolean;
    describe(): string;
    instantiate(parent: Node | any, subPath: string, initialValue?: any): Node;
    reconcile(current: Node, newValue: any): Node;
    determineType(value: any): IType<any, any>;
    isValidSnapshot(value: any): boolean;
}
