import {IType, Type} from "../api/type";
import {createNode, isInstance, Node} from "./core/node";
import {fail} from "./utils";
import {TypeFlag} from "../api/typeFlags";

export class IdentifierType<T> extends Type<T, T> {
    readonly flag = TypeFlag.Identifier;

    constructor(public readonly identifierType: IType<T, T>) {
        super(`identifier(${identifierType.name})`);
    }

    describe(): string {
        return `identifier(${this.identifierType.describe()})`
    }

    instantiate(parent: Node | null, subPath: string, snapshot: T): Node {
        if (!parent || !isInstance(parent.data))
            return fail(`Identifier types can only be instantiated as direct child of an object type`);

        if (parent.identifierAttribute)
            fail(
                `Cannot define property '${subPath}' as object identifier, property '${parent.identifierAttribute}' is already defined as identifier property`
            );
        parent.identifierAttribute = subPath;
        return createNode(this, parent, subPath, snapshot);
    }

    reconcile(current: Node, newValue: any) {
        if (current.data !== newValue)
            return fail(
                `Tried to change identifier from '${current.data}' to '${newValue}'. Changing identifiers is not allowed.`
            );
        return current;
    }

    isValidSnapshot(value: any): boolean {
        if (
            value === undefined ||
            value === null ||
            typeof value === "string" ||
            typeof value === "number"
        ) return this.identifierType.validate(value);
        return false;
    }

    getSnapshot(node: Node): T {
        return this.identifierType.getSnapshot(node);
    }

    getChildren(node: Node): Array<Node> {
        return this.identifierType.getChildren(node);
    }
}