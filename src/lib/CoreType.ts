import {Type} from "../api/Type";
import {identity, isPrimitive, fail} from "./utils";
import {createNode, Node} from "./Node";

/**
 * From MST implementation https://github.com/mobxjs/mobx-state-tree/blob/master/src/types/primitives.ts
 */

export class CoreType<S, T> extends Type<S, T> {
    readonly checker: (value: any) => boolean;
    readonly initializer: (v: any) => any;

    constructor(name: any,
                checker: any,
                initializer: (v: any) => any = identity) {
        super(name);
        this.checker = checker;
        this.initializer = initializer;
    }

    instantiate(parent: Node, subPath: string, initialValue?: any): Node {
        if (!this.checker(initialValue)) fail(`Error while instantiating ${this.name}. Expected a ${this.name}, got ${initialValue} `)
        return createNode(this, parent, subPath, initialValue, this.initializer);
    }

    isValidSnapshot(value: any): boolean {
        return isPrimitive(value) && this.checker(value);
    }

    getSnapshot(node: Node): S {
        return node.data;
    }

    applySnapshot(node: Node, snapshot: S): void {
        throw new Error("Method not implemented.");
    }

    /**
     * Return an empty array of Instance because primitive can't have children.
     * @return {Array<Node>}
     */
    getChildren(node: Node): Array<Node> {
        return [];
    }
}