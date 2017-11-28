import { ISimpleType, Type } from "../api/Type"
import { TypeFlag } from "../api/TypeFlags"
import { createNode, Node } from "./core/Node"

export class Frozen<T> extends Type<T, T> {
    flag: TypeFlag = TypeFlag.Frozen

    constructor() {
        super("frozen")
    }

    describe() {
        return "<any immutable value>"
    }

    instantiate(parent: Node | null, subpath: string, value: any): Node {
        return createNode(this, parent, subpath, value)
    }

    isValidSnapshot(value: any): boolean {
        return typeof value !== "function"
    }

    getSnapshot(node: Node): T {
        throw new Error("Method not implemented.");
    }
    getChildren(node: Node): Node[] {
        throw new Error("Method not implemented.");
    }
}
