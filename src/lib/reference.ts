import {assertType, fail, isReferenceType} from "./utils";
import {getNode, Node, isInstance, createNode, Instance} from "./core/node";
import {IType, Type} from "../api/type";
import {TypeFlag} from "../api/typeFlags";

class StoredReference {
    constructor(public mode: "identifier" | "object", public value: any) {
        if (mode === "object") {
            if (!isInstance(value))  fail(`Can only store references to tree nodes, got: '${value}'`);

            const targetNode = getNode(value);
            if (!targetNode.identifierAttribute)  fail(`Can only store references with a defined identifier attribute.`);
        }
    }
}

export class ReferenceType<T> extends Type<string | number, T> {

    readonly flags = TypeFlag.Reference;

    constructor(private readonly targetType: IType<any, T>) {
        super(`reference(${targetType.name})`);
    }

    describe() {
        return this.name;
    }

    getValue(node: Node) {
        const ref = node.data as StoredReference;
        if (ref.mode === "object") return ref.value;

        if (!node.isAlive) return undefined;
        // reference was initialized with the identifier of the target
        const target = node.root.identifierCache!.resolve(this.targetType, ref.value);
        if (!target)
            return fail(
                `Failed to resolve reference of type ${this.targetType
                    .name}: '${ref.value}' (in: ${node.path})`
            );
        return target.value;
    }

    getSnapshot(node: Node): any {
        const ref = node.data as StoredReference;
        switch (ref.mode) {
            case "identifier":
                return ref.value;
            case "object":
                return getNode(ref.value).identifier;
        }
    }

    instantiate(parent: Node | null, subPath: string, snapshot: any): Node {
        const isComplex = isInstance(snapshot);
        return createNode(
            this,
            parent,
            subPath,
            new StoredReference(isComplex ? "object" : "identifier", snapshot)
        );
    }

    reconcile(current: Node, newValue: any): Node {
        const targetMode = isInstance(newValue) ? "object" : "identifier";
        if (isReferenceType(current.type)) {
            const ref = current.data as StoredReference;
            if (targetMode === ref.mode && ref.value === newValue) return current;
        }
        const newNode = this.instantiate(
            current.parent,
            current.subPath,
            newValue
        );
        current.remove();
        return newNode;
    }

    isAssignableFrom(type: IType<any, any>): boolean {
        return this.targetType.isAssignableFrom(type);
    }

    isValidSnapshot(value: any): boolean {
        return (typeof value === "string" || typeof value === "number")
            || (isInstance(value) && this.targetType.isAssignableFrom(getNode(value as Instance).type));
    }

    getChildren(node: Node): Node[] {
        return [];
    }
}

export function reference<T>(factory: IType<any, T>): IType<string | number, T>;
/**
 * Creates a reference to another type, which should have defined an identifier.
 * See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.
 *
 * @export
 * @alias types.reference
 */
export function reference<T>(subType: IType<any, T>): any {
    // check that a type is given
    assertType(subType, "Type");
    return new ReferenceType(subType);
}
