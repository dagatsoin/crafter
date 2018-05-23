import { Type } from "../api/type";
import { TypeFlag } from "../api/typeFlags";
import { Node } from "./core/node";
export declare class Frozen<T> extends Type<T, T> {
    flag: TypeFlag;
    constructor();
    describe(): string;
    instantiate(parent: Node | null, subpath: string, value: any): Node;
    isValidSnapshot(value: any): boolean;
    getSnapshot(node: Node): T;
    getChildren(node: Node): Node[];
}
