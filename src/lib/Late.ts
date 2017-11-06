import { TypeFlag } from "../api/typeFlags";
import { Node } from "./core/Node";
import {IType, Type} from "../api/Type";

export class Late<S, T> extends Type<S, T> {
    readonly definition: () => IType<S, T>;
    private _subType: IType<S, T> | null = null;

    get flags() {
        return this.subType.flag | TypeFlag.Late;
    }

    get subType(): IType<S, T> {
        if (this._subType === null) {
            this._subType = this.definition();
        }
        return this._subType;
    }

    constructor(name: string, definition: () => IType<S, T>) {
        super(name);
        this.definition = definition;
    }

    instantiate(parent: Node | null, subPath: string, snapshot: T): Node {
        return this.subType.instantiate(parent, subPath, snapshot);
    }

    getSnapshot(node: Node): S {
        return this.subType.getSnapshot(node);
    }

    getChildren(node: Node): Node[] {
        return this.subType.getChildren(node);
    }

    reconcile(current: Node, newValue: any): Node {
        return this.subType.reconcile(current, newValue);
    }

    describe() {
        return this.subType.name;
    }

    isValidSnapshot(value: any): boolean {
        return this.subType.validate(value);
    }

    isAssignableFrom(type: IType<any, any>) {
        return this.subType.isAssignableFrom(type);
    }
}