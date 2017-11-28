import {IType, Type} from "../api/type";
import {TypeFlag} from "../api/typeFlags";
import {getNode, isInstance, Node} from "./core/node";

export class Refinement<S, T> extends Type<S, T> {
    readonly type: IType<any, any>;
    readonly predicate: (v: any) => boolean;
    readonly message: (v: any) => string;

    constructor(
        name: string,
        type: IType<any, any>,
        predicate: (v: any) => boolean,
        message: (v: any) => string
    ) {
        super(name);
        this.type = type;
        this.predicate = predicate;
        this.message = message;
    }

    getSnapshot(node: Node) {
        return node.data;
    }

    get flag() {
        return this.type.flag | TypeFlag.Refinement;
    }

    getChildren(node: Node): Node[] {
        return [];
    }

    describe() {
        return this.name;
    }

    instantiate(parent: Node, subPath: string, value: any): Node {
        return this.type.instantiate(parent, subPath, value);
    }

    isAssignableFrom(type: IType<any, any>) {
        return this.type.isAssignableFrom(type);
    }

    isValidSnapshot(value: any): boolean {
        if (!this.type.validate(value)) return false;
        return this.predicate(isInstance(value) ? getNode(value).snapshot : value);
    }
}