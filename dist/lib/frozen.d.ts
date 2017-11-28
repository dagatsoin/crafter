import { Type } from "../api/Type";
import { TypeFlag } from "../api/TypeFlags";
import { Node } from "./core/Node";
export declare class Frozen<T> extends Type<T, T> {
    flag: TypeFlag;
    constructor();
    describe(): string;
    instantiate(parent: Node | null, subpath: string, value: any): Node;
    isValidSnapshot(value: any): boolean;
    getSnapshot(node: Node): T;
    getChildren(node: Node): Node[];
}
