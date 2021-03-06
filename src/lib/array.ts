import {ComplexType, IType} from "../api/type";
import {addHiddenFinalProp, fail} from "./utils";
import {
    extras, IArrayChange, IArraySplice, IArrayWillChange, IArrayWillSplice, intercept, IObservableArray, isObservableArray, observable,
    observe
} from "mobx";
import {areSame, getNode, isInstance, Instance, valueAsNode, createNode, Node} from "./core/node";
import {TypeFlag} from "../api/typeFlags";
import {IJsonPatch} from "./core/jsonPatch";

export function arrayToString(this: IObservableArray<any> & Instance) {
    return `${getNode(this)}(${this.length} items)`;
}

export class ArrayType<S, T> extends ComplexType<S[], IObservableArray<T>> {
    itemType: IType<any, T>;
    readonly flag: TypeFlag = TypeFlag.Array;

    constructor(name: string, itemType: IType<any, any>) {
        super(name);
        this.itemType = itemType;
    }

    describe() {
        return this.itemType.describe() + "[]";
    }

    getSnapshot(node: Node): S[] {
        return node.children.map(childNode => childNode.snapshot);
    }

    instantiate(parent: Node, subPath: string, initialValue?: any): Node {
        return createNode(
            this,
            parent,
            subPath,
            initialValue,
            this.createEmptyInstance,
            this.buildInstance
        );
    }

    getDefaultSnapshot(): Array<T> {
        return [];
    }

    private createEmptyInstance = (snapshot: S[]) => {
        const array = observable.shallowArray();
        addHiddenFinalProp(array, "toString", arrayToString);
        return array;
    }

    private buildInstance = (node: Node, snapshot: S[]) => {
        extras.getAdministration(node.data).dehancer = node.unbox;
        intercept(node.data as IObservableArray<any>, change => this.willChange(change) as any);
        node.applySnapshot(snapshot);
        observe(node.data, this.didChange);
    }

    isValidSnapshot(value: any): boolean {
        return (Array.isArray(value) || isObservableArray(value)) && value.length ?
            value.every((item: any, index: any) => this.itemType.validate(item)) : true;
    }

    applySnapshot(node: Node, snapshot: any[]): void {
        const target = node.data as IObservableArray<any>;
        target.replace(snapshot);
    }

    getChildren(node: Node): Node[] {
        return node.data.peek();
    }

    getChildNode(node: Node, key: string): Node {
        const index = parseInt(key, 10);
        if (index < node.data.length) return node.data[index];
        return fail("Not a child: " + key);
    }

    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void {
        const target = node.data as IObservableArray<any>;
        const index = subpath === "-" ? target.length : parseInt(subpath);
        switch (patch.op) {
            case "replace":
                target[index] = patch.value;
                break;
            case "add":
                target.splice(index, 0, patch.value);
                break;
            case "remove":
                target.splice(index, 1);
                break;
        }
    }

    private willChange(change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null {
        const node = getNode(change.object as Instance);
        const children = node.children;

        switch (change.type) {
            case "update":
                if (change.newValue === change.object[change.index]) return null;
                change.newValue = this.reconcileArrayChildren(
                    node,
                    this.itemType,
                    [children[change.index]],
                    [change.newValue],
                    [change.index]
                )[0].data;
                break;
            case "splice":
                const { index, removedCount, added } = change;
                change.added = this.reconcileArrayChildren(
                    node,
                    this.itemType,
                    children.slice(index, index + removedCount),
                    added,
                    added.map((_, i) => index + i)
                );

                // update paths of remaining items
                for (let i = index + removedCount; i < children.length; i++) {
                    children[i].setParent(node, "" + (i + added.length - removedCount));
                }
                break;
        }
        return change;
    }

    didChange(this: {}, change: IArrayChange<any> | IArraySplice<any>): void {
        const node = getNode(change.object as Instance);
        switch (change.type) {
            case "update":
                return void node.emitPatch(
                    {
                        op: "replace",
                        path: "" + change.index,
                        value: change.newValue.snapshot,
                        oldValue: change.oldValue ? change.oldValue.snapshot : undefined
                    },
                    node
                );
            case "splice":
                for (let i = change.removedCount - 1; i >= 0; i--)
                    node.emitPatch(
                        {
                            op: "remove",
                            path: "" + (change.index + i),
                            oldValue: change.removed[i].snapshot
                        },
                        node
                    );
                for (let i = 0; i < change.addedCount; i++)
                    node.emitPatch(
                        {
                            op: "add",
                            path: "" + (change.index + i),
                            value: node.getChildNode("" + (change.index + i)).snapshot,
                            oldValue: undefined
                        },
                        node
                    );
                return;
        }
    }

    private reconcileArrayChildren<T>(
        parent: Node,
        childType: IType<any, T>,
        currentNodes: Node[],
        newValues: T[],
        newPaths: (string | number)[]
    ): Node[] {
        let currentNode: Node,
            newValue: any,
            hasNewNode = false,
            currentMatch: Node | undefined = undefined;

        for (let i = 0; ; i++) {
            currentNode = currentNodes[i];
            newValue = newValues[i];

            hasNewNode = i <= newValues.length - 1;

            // both are empty, end
            if (!currentNode && !hasNewNode) {
                break;
                // new one does not exists, old one dies
            } else if (!hasNewNode) {
                currentNode.remove();
                currentNodes.splice(i, 1);
                i--;
                // there is no old node, create it
            } else if (!currentNode) {
                // check if already belongs to the same parent. if so, avoid pushing item in. only swapping can occur.
                if (isInstance(newValue) && getNode(newValue).parent === parent) {
                    // this node is owned by this parent, but not in the reconcilable set, so it must be double
                    fail(
                        `Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '${parent.path}${newPaths[
                            i
                            ]}', but it lives already at '${getNode(newValue).path}'`
                    );
                }
                currentNodes.splice(i, 0, valueAsNode(childType, parent, "" + newPaths[i], newValue));
                // both are the same, reconcile
            } else if (areSame(currentNode, newValue)) {
                currentNodes[i] = valueAsNode(childType, parent, "" + newPaths[i], newValue, currentNode);
                // nothing to do, try to reorder
            } else {
                currentMatch = undefined;

                // find a possible candidate to reuse
                for (let j = i; j < currentNodes.length; j++) {
                    if (areSame(currentNodes[j], newValue)) {
                        currentMatch = currentNodes.splice(j, 1)[0];
                        break;
                    }
                }

                currentNodes.splice(
                    i,
                    0,
                    valueAsNode(childType, parent, "" + newPaths[i], newValue, currentMatch)
                );
            }
        }

        return currentNodes;
    }

    getChildType(key: string): IType<any, any> {
        return this.itemType;
    }
}